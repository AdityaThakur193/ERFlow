import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Equipment from "@/models/Equipment.schema";
import Patient from "@/models/Patients.schema";

// DELETE EQUIPMENT
export async function DELETE(req) {
  try {
    await connectToDb();

    const body = await req.json();

    // FIND EQUIPMENT
    const equipment = await Equipment.findById(body.id);

    // REMOVE EQUIPMENT FROM PATIENT
    if (equipment?.assignedPatient) {
      await Patient.findByIdAndUpdate(
        equipment.assignedPatient,

        {
          $pull: {
            equipment: equipment._id,
          },
        },
      );
    }

    // DELETE EQUIPMENT
    await Equipment.findByIdAndDelete(body.id);

    return NextResponse.json(
      {
        success: true,
        message: "Equipment deleted successfully",
      },

      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("DELETE EQUIPMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete equipment",
      },

      {
        status: 500,
      },
    );
  }
}

// export async function PATCH(req) {
//   try {
//     await connectToDb();
//     const body = await req.json();

//     const updatedEquipment = await Equipment.findByIdAndUpdate(
//       body.id,
//       {
//         status: body.status,
//         assignedPatient: body.assignedPatient || null,
//       },
//       { new: true },
//     );
//     //update the patient aswell
//     await Patient.findByIdAndUpdate(body.assignedPatient, {
//       $push: {
//         equipment: updatedEquipment._id,
//       },
//     });
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Equipment assigned successfully",

//         data: updatedEquipment,
//       },
//       {
//         status: 200,
//       },
//     );
//   } catch (error) {
//     console.log("PATCH EQUIPMENT ERROR:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to update equipment",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

export async function GET() {
  try {
    await connectToDb();

    const equipment = await Equipment.find({})
      .populate("assignedPatient")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: equipment,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("GET EQUIPMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch equipment",
      },
      {
        status: 500,
      },
    );
  }
}
export async function POST(req) {
  try {
    await connectToDb();
    const body = await req.json();

    const equipment = await Equipment.create({
      name: body.name,
      category: body.category,
      roomNumber: body.roomNumber,

      status: body.status || "Available",

      assignedPatient: body.assignedPatient || null,
    });
    return NextResponse.json({
      success: true,
      message: "Equipment added successfully",
      data: equipment,
    });
  } catch (error) {
    console.log("Some thing went wrong in the addequipment api", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add equipment",
      },
      {
        status: 500,
      },
    );
  }
}
