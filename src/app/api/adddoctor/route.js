import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Doctor from "@/models/Doctor.schema";

// GET all doctors
export async function GET() {
  try {
    await connectToDb();
    const doctors = await Doctor.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        data: doctors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("GET DOCTORS ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch doctors",
      },
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
      roomNumber: body.roomNumber,
      status: body.status || "Available",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Doctor added successfully",
        data: doctor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("ADD DOCTOR ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add doctor",
      },
      { status: 500 }
    );
  }
}

// PATCH - Update doctor status
export async function PATCH(req) {
  try {
    await connectToDb();
    const body = await req.json();

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      body.id,
      {
        status: body.status,
        // roomNumber: body.roomNumber,
        // specialization: body.specialization,
      },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Doctor updated successfully",
        data: updatedDoctor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("UPDATE DOCTOR ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update doctor",
      },
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
      {
        success: true,
        message: "Doctor deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("DELETE DOCTOR ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete doctor",
      },
      { status: 500 }
    );
  }
}