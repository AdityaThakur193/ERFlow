import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Patient from "@/models/Patients.schema";
import Doctor from "@/models/Doctor.schema";

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

    // Check if doctor is available
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found" },
        { status: 404 }
      );
    }
    if (doctor.status !== "Available") {
      return NextResponse.json(
        { success: false, message: "Doctor is not available" },
        { status: 400 }
      );
    }

    // Update patient: set status to "In treatment", assign doctor
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        status: "In treatment",
        doctor: doctorId,
      },
      { new: true }
    );

    if (!updatedPatient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    // Update doctor: set status to "busy"
    await Doctor.findByIdAndUpdate(
      doctorId,
      { status: "busy" },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Doctor assigned successfully",
        data: {
          patient: updatedPatient,
          doctor: { _id: doctorId, status: "busy" }
        }
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