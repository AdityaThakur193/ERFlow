import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Patient from "@/models/Patients.schema";
import Doctor from "@/models/Doctor.schema";
import Equipment from "@/models/Equipment.schema";

// ============================================================
// DELETE patient → full cleanup of doctors & equipment
// ============================================================
export async function DELETE(req) {
  try {
    await connectToDb();
    const body = await req.json();
    const patientId = body.id;

    // Find the patient first to get assigned doctors & equipment
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // 1. For each assigned doctor, remove this patient and auto-set Available if needed
    if (patient.doctor && patient.doctor.length > 0) {
      await Promise.all(
        patient.doctor.map(async (doctorId) => {
          await Doctor.findByIdAndUpdate(doctorId, {
            $pull: { patients: patient._id },
          });
          // Re-fetch to check remaining patients
          const doctor = await Doctor.findById(doctorId);
          if (doctor && doctor.patients.length === 0 && doctor.status === "busy") {
            await Doctor.findByIdAndUpdate(doctorId, { status: "Available" });
          }
        })
      );
    }

    // 2. For each assigned equipment, restore inventory and clear assignedPatient
    if (patient.equipment && patient.equipment.length > 0) {
      await Promise.all(
        patient.equipment.map(async (equipId) => {
          await Equipment.findByIdAndUpdate(equipId, {
            $inc: { inventory: 1 },
            status: "Available",
            assignedPatient: null,
          });
        })
      );
    }

    // 3. Delete the patient
    await Patient.findByIdAndDelete(patientId);

    return NextResponse.json(
      { success: true, message: "Patient deleted and cleanup complete" },
      { status: 200 }
    );
  } catch (error) {
    console.log("DELETE PATIENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete patient" },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH status → on "Completed", auto-release doctors & equipment
// ============================================================
export async function PATCH(req) {
  try {
    await connectToDb();
    const body = await req.json();

    const patient = await Patient.findById(body.id);
    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // Update the status first
    patient.status = body.status;
    await patient.save();

    if (body.status === "Completed") {
      // 1. For each assigned doctor, remove patient and check if they become Available
      if (patient.doctor && patient.doctor.length > 0) {
        await Promise.all(
          patient.doctor.map(async (doctorId) => {
            await Doctor.findByIdAndUpdate(doctorId, {
              $pull: { patients: patient._id },
            });
            // Re-fetch to get updated patient count
            const doctor = await Doctor.findById(doctorId);
            if (doctor && doctor.patients.length === 0 && doctor.status === "busy") {
              await Doctor.findByIdAndUpdate(doctorId, { status: "Available" });
            }
          })
        );
      }

      // 2. For each assigned equipment, restore inventory atomically
      if (patient.equipment && patient.equipment.length > 0) {
        await Promise.all(
          patient.equipment.map(async (equipId) => {
            await Equipment.findByIdAndUpdate(equipId, {
              $inc: { inventory: 1 },
              status: "Available",
              assignedPatient: null,
            });
          })
        );
      }
    }

    return NextResponse.json(
      { success: true, message: "Patient status updated" },
      { status: 200 }
    );
  } catch (error) {
    console.log("UPDATE PATIENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update patient" },
      { status: 500 }
    );
  }
}

// ============================================================
// GET all patients (sorted: Critical first, then by createdAt)
// ============================================================
export async function GET() {
  try {
    await connectToDb();
    const patients = await Patient.find({})
      .populate("doctor") // populate full doctor objects
      .sort({ createdAt: -1 });

    // Sort: Critical first, then High, Medium, Low (within same priority, preserve createdAt order)
    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    patients.sort(
      (a, b) =>
        (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4)
    );

    return NextResponse.json({ success: true, data: patients }, { status: 200 });
  } catch (error) {
    console.log("GET PATIENTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST - Add patient
// ============================================================
export async function POST(req) {
  try {
    await connectToDb();
    const body = await req.json();
    const patient = await Patient.create({
      name: body.name,
      age: body.age,
      gender: body.gender,
      symptoms: body.symptoms,
      priority: body.priority,
      department: body.department,
      doctor: [],
      status: "Waiting",
    });
    return NextResponse.json(
      { message: "Patient added successfully", data: patient, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.log("ADD PATIENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create patient" },
      { status: 500 }
    );
  }
}
