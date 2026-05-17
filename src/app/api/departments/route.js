import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Department from "@/models/Department.schema";

// GET all departments
export async function GET() {
  try {
    await connectToDb();
    const departments = await Department.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: departments }, { status: 200 });
  } catch (error) {
    console.log("GET DEPARTMENTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

// POST - Create department (Admin only in UI; API is open for MVP)
export async function POST(req) {
  try {
    await connectToDb();
    const body = await req.json();

    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Department name is required" },
        { status: 400 }
      );
    }

    const department = await Department.create({
      name: body.name.trim(),
      description: body.description || "",
    });

    return NextResponse.json(
      { success: true, message: "Department created", data: department },
      { status: 201 }
    );
  } catch (error) {
    // Duplicate name
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "A department with this name already exists" },
        { status: 409 }
      );
    }
    console.log("CREATE DEPARTMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create department" },
      { status: 500 }
    );
  }
}

// DELETE - Remove department (Admin only in UI)
export async function DELETE(req) {
  try {
    await connectToDb();
    const body = await req.json();
    await Department.findByIdAndDelete(body.id);
    return NextResponse.json(
      { success: true, message: "Department deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log("DELETE DEPARTMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete department" },
      { status: 500 }
    );
  }
}
