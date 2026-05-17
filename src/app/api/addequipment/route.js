import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Equipment from "@/models/Equipment.schema";
import Patient from "@/models/Patients.schema";

// ============================================================
// DELETE equipment (future: check assignment - see roadmap)
// ============================================================
export async function DELETE(req) {
  try {
    await connectToDb();
    const body = await req.json();

    const equipment = await Equipment.findById(body.id);
    if (!equipment) {
      return NextResponse.json(
        { success: false, message: "Equipment not found" },
        { status: 404 }
      );
    }

    // Remove from assigned patient's equipment list if assigned
    if (equipment.assignedPatient) {
      await Patient.findByIdAndUpdate(equipment.assignedPatient, {
        $pull: { equipment: equipment._id },
      });
    }

    await Equipment.findByIdAndDelete(body.id);

    return NextResponse.json(
      { success: true, message: "Equipment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("DELETE EQUIPMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete equipment" },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH - Assign equipment to patient (decrements inventory atomically)
//         or update inventory/status (admin action)
// ============================================================
export async function PATCH(req) {
  try {
    await connectToDb();
    const body = await req.json();

    // --- ASSIGNMENT action ---
    if (body.action === "assign" && body.assignedPatient) {
      // Atomically check inventory > 0 and decrement
      const equipment = await Equipment.findOneAndUpdate(
        { _id: body.id, inventory: { $gt: 0 } }, // guard: only update if inventory > 0
        {
          $inc: { inventory: -1 },
          status: "In Use",
          assignedPatient: body.assignedPatient,
        },
        { new: true }
      );

      if (!equipment) {
        return NextResponse.json(
          { success: false, message: "Equipment is out of stock or not found" },
          { status: 400 }
        );
      }

      // Update patient's equipment array
      await Patient.findByIdAndUpdate(body.assignedPatient, {
        $push: { equipment: equipment._id },
      });

      return NextResponse.json(
        { success: true, message: "Equipment assigned successfully", data: equipment },
        { status: 200 }
      );
    }

    // --- UNASSIGN action ---
    if (body.action === "unassign") {
      const equipment = await Equipment.findById(body.id);
      if (!equipment) {
        return NextResponse.json(
          { success: false, message: "Equipment not found" },
          { status: 404 }
        );
      }

      const previousPatient = equipment.assignedPatient;

      const updated = await Equipment.findByIdAndUpdate(
        body.id,
        {
          $inc: { inventory: 1 },
          status: "Available",
          assignedPatient: null,
        },
        { new: true }
      );

      if (previousPatient) {
        await Patient.findByIdAndUpdate(previousPatient, {
          $pull: { equipment: equipment._id },
        });
      }

      return NextResponse.json(
        { success: true, message: "Equipment unassigned successfully", data: updated },
        { status: 200 }
      );
    }

    // --- ADMIN inventory/status update ---
    const updateFields = {};
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.inventory !== undefined) updateFields.inventory = body.inventory;

    const updated = await Equipment.findByIdAndUpdate(body.id, updateFields, {
      new: true,
    });

    return NextResponse.json(
      { success: true, message: "Equipment updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.log("PATCH EQUIPMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update equipment" },
      { status: 500 }
    );
  }
}

// GET all equipment (populate assignedPatient)
export async function GET() {
  try {
    await connectToDb();
    const equipment = await Equipment.find({})
      .populate("assignedPatient", "name department priority")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: equipment }, { status: 200 });
  } catch (error) {
    console.log("GET EQUIPMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}

// POST - Add equipment (admin sets base inventory)
export async function POST(req) {
  try {
    await connectToDb();
    const body = await req.json();

    const equipment = await Equipment.create({
      name: body.name,
      category: body.category,
      roomNumber: body.roomNumber,
      status: body.status || "Available",
      inventory: body.inventory ?? 1,
      assignedPatient: null,
    });

    return NextResponse.json(
      { success: true, message: "Equipment added successfully", data: equipment },
      { status: 201 }
    );
  } catch (error) {
    console.log("ADD EQUIPMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add equipment" },
      { status: 500 }
    );
  }
}
