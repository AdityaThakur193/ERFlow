import connectToDb from "@/dbconfig/dbconfig";
import User from "@/models/User.schema";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ── Auth guard ─────────────────────────────────────────────────────────────
function getAdminOrError(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return { error: "Unauthorized", status: 401 };
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decoded.position !== "Admin") return { error: "Forbidden", status: 403 };
    return { decoded };
  } catch {
    return { error: "Unauthorized: Invalid session", status: 401 };
  }
}

// ── GET /api/users — list all staff ────────────────────────────────────────
export async function GET(req) {
  const auth = getAdminOrError(req);
  if (auth.error) {
    return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
  }

  try {
    await connectToDb();
    const users = await User.find({}, "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ── DELETE /api/users — remove a staff member ──────────────────────────────
export async function DELETE(req) {
  const auth = getAdminOrError(req);
  if (auth.error) {
    return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
  }

  try {
    await connectToDb();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (String(auth.decoded.id) === String(id)) {
      return NextResponse.json({ success: false, message: "You cannot delete your own account" }, { status: 400 });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
