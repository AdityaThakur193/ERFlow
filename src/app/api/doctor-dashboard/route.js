import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Doctor from "@/models/Doctor.schema";
import Patient from "@/models/Patients.schema";
import Equipment from "@/models/Equipment.schema";

/**
 * GET /api/doctor-dashboard
 * Returns the calling doctor's profile, their active patients (with priority),
 * their completed patient count, and available equipment.
 * Auth: must be logged in as Doctor or Admin.
 */
export async function GET(req) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    await connectToDb();

    // ── Find the Doctor record linked to the logged-in user ───────────────
    // Primary: match by userId (set when doctor account is created via Staff page)
    // Fallback: match by name regex (for seeded / legacy doctor records without userId)
    let doctorRecord = await Doctor.findOne({ userId: decoded.id });

    if (!doctorRecord) {
      // Legacy fallback — name-based match
      doctorRecord = await Doctor.findOne({
        name: { $regex: new RegExp(decoded.username, "i") },
      });
    }

    if (!doctorRecord) {
      return NextResponse.json(
        { success: false, message: "No doctor profile found for this account" },
        { status: 404 }
      );
    }

    // ── Active patients assigned to this doctor ───────────────────────────
    const activePatients = await Patient.find({
      doctor: doctorRecord._id,
      status: { $ne: "Completed" },
    }).sort({ createdAt: -1 });

    // ── Completed patients (historical) ───────────────────────────────────
    const completedCount = await Patient.countDocuments({
      doctor: doctorRecord._id,
      status: "Completed",
    });

    // ── Priority breakdown ────────────────────────────────────────────────
    const priorityCounts = {
      Critical: activePatients.filter((p) => p.priority === "Critical").length,
      High: activePatients.filter((p) => p.priority === "High").length,
      Medium: activePatients.filter((p) => p.priority === "Medium").length,
      Low: activePatients.filter((p) => p.priority === "Low").length,
    };

    // ── Available equipment ───────────────────────────────────────────────
    const equipment = await Equipment.find({ status: "Available", inventory: { $gt: 0 } })
      .populate("assignedPatient", "name")
      .sort({ name: 1 });

    return NextResponse.json({
      success: true,
      data: {
        doctor: doctorRecord,
        activePatients,
        completedCount,
        priorityCounts,
        equipment,
      },
    });
  } catch (error) {
    console.error("DOCTOR DASHBOARD ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
