import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Patient from "@/models/Patients.schema";
import Doctor from "@/models/Doctor.schema";

// ============================================================
// POST /api/assign-doctor
// Supports many-to-many: adds doctorId to patient.doctor array
// and patientId to doctor.patients array. Prevents duplicates.
// ============================================================
export async function POST(req) {
  try {
    await connectToDb();
    const body = await req.json();
    const { patientId, doctorId } = body;

    if (!patientId || !doctorId) {
      return NextResponse.json(
        { success: false, message: "Patient ID and Doctor ID are required" },
        { status: 400 }
      );
    }

    // Find both documents upfront
    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId),
      Doctor.findById(doctorId),
    ]);

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }

    // Prevent duplicate assignment
    const alreadyAssigned = patient.doctor.some(
      (id) => id.toString() === doctorId
    );
    if (alreadyAssigned) {
      return NextResponse.json(
        { success: false, message: "This doctor is already assigned to this patient" },
        { status: 400 }
      );
    }

    // Update patient: add doctor to array, set status to "In treatment" if Waiting
    const patientUpdate = {
      $push: { doctor: doctorId },
    };
    if (patient.status === "Waiting") {
      patientUpdate.$set = { status: "In treatment" };
    }
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      patientUpdate,
      { new: true }
    );

    // Update doctor: add patient to array, set status to "busy"
    await Doctor.findByIdAndUpdate(
      doctorId,
      {
        $push: { patients: patientId },
        $set: { status: "busy" },
      },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Doctor assigned successfully",
        data: { patient: updatedPatient },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("ASSIGN DOCTOR ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign doctor" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/assign-doctor
// Removes a doctor from a patient (unassign one doctor)
// ============================================================
export async function DELETE(req) {
  try {
    await connectToDb();
    const body = await req.json();
    const { patientId, doctorId } = body;

    if (!patientId || !doctorId) {
      return NextResponse.json(
        { success: false, message: "Patient ID and Doctor ID are required" },
        { status: 400 }
      );
    }

    // Remove doctor from patient array
    await Patient.findByIdAndUpdate(patientId, {
      $pull: { doctor: doctorId },
    });

    // Remove patient from doctor array
    await Doctor.findByIdAndUpdate(doctorId, {
      $pull: { patients: patientId },
    });

    // Check if doctor now has zero active patients → set Available
    const doctor = await Doctor.findById(doctorId);
    if (doctor && doctor.patients.length === 0 && doctor.status === "busy") {
      await Doctor.findByIdAndUpdate(doctorId, { status: "Available" });
    }

    return NextResponse.json(
      { success: true, message: "Doctor unassigned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("UNASSIGN DOCTOR ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to unassign doctor" },
      { status: 500 }
    );
  }
}