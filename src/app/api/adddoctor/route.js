import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Doctor from "@/models/Doctor.schema";
import Patient from "@/models/Patients.schema";

// GET all doctors (populate patients for count)
export async function GET() {
  try {
    await connectToDb();
    const doctors = await Doctor.find({})
      .populate("patients", "name status") // only name & status for efficiency
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: doctors }, { status: 200 });
  } catch (error) {
    console.log("GET DOCTORS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch doctors", error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

// POST - Add new doctor
export async function POST(req) {
  try {
    await connectToDb();
    const body = await req.json();

    const doctor = await Doctor.create({
      name: body.name,
      specialization: body.specialization,
      department: body.department,
      roomNumber: body.roomNumber,
      status: body.status || "Available",
      patients: [],
    });

    return NextResponse.json(
      { success: true, message: "Doctor added successfully", data: doctor },
      { status: 201 }
    );
  } catch (error) {
    console.log("ADD DOCTOR ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add doctor" },
      { status: 500 }
    );
  }
}

// PATCH - Update doctor status (manual override)
export async function PATCH(req) {
  try {
    await connectToDb();
    const body = await req.json();

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      body.id,
      { status: body.status },
      { new: true }
    );

    return NextResponse.json(
      { success: true, message: "Doctor updated successfully", data: updatedDoctor },
      { status: 200 }
    );
  } catch (error) {
    console.log("UPDATE DOCTOR ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update doctor" },
      { status: 500 }
    );
  }
}

// DELETE - Remove doctor
export async function DELETE(req) {
  try {
    await connectToDb();
    const body = await req.json();

    await Doctor.findByIdAndDelete(body.id);

    return NextResponse.json(
      { success: true, message: "Doctor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("DELETE DOCTOR ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}