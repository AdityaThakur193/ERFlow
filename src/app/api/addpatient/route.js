import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Patient from "@/models/Patients.schema";

//api to dele patient
export async function DELETE(req) {
  try {
    await connectToDb();
    const body = await req.json();

    await Patient.findByIdAndDelete(body.id);
    return NextResponse.json(
      { success: true, message: "deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("DELETE PATIENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete patient",
      },

      {
        status: 500,
      },
    );
  }
}

// api to patch status of the patient
export async function PATCH(req) {
  try {
    await connectToDb();

    const body = await req.json();

    const updatedPatient = await Patient.findByIdAndUpdate(
      body.id,
      {
        status: body.status,
      },
      {
        new: true,
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Updated successfully!",
        data: updatedPatient,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("UPDATE PATIENT ERROR from the api:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update patient",
      },

      {
        status: 500,
      },
    );
  }
}

//api to get all patients use in the dashboard
export async function GET(req) {
  try {
    await connectToDb();
    const patients = await Patient.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        data: patients,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("GET PATIENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch patients",
      },
      {
        status: 500,
      },
    );
  }
}

//api to add the patient
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
      doctor: body.doctor || null,
      status: "Waiting",
    });
    return NextResponse.json(
      { message: "Patient added successfully", data: patient },
      { status: 201 },
    );
  } catch (error) {
    console.log("ADD patient error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create patient",
      },
      { status: 500 },
    );
  }
}
