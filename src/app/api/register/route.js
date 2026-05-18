import connectToDb from "@/dbconfig/dbconfig";
import User from "@/models/User.schema";
import Doctor from "@/models/Doctor.schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // ── 1. Verify the caller is an authenticated Admin ──
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid session" },
        { status: 401 }
      );
    }

    if (decoded.position !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Only Admins can create users" },
        { status: 403 }
      );
    }

    // ── 2. Validate request body ──
    await connectToDb();
    const reqbody = await req.json();
    const { username, email, password, position, specialization, department, roomNumber } = reqbody;

    if (!username || !email || !password || !position) {
      return NextResponse.json(
        { success: false, message: "Please fill all fields" },
        { status: 400 }
      );
    }

    // Doctor-specific fields are required when position is Doctor
    if (position === "Doctor" && (!specialization || !department || !roomNumber)) {
      return NextResponse.json(
        { success: false, message: "Specialization, department, and room number are required for doctors" },
        { status: 400 }
      );
    }

    const allowedPositions = ["Admin", "Doctor", "Receptionist"];
    if (!allowedPositions.includes(position)) {
      return NextResponse.json(
        { success: false, message: "Invalid position value" },
        { status: 400 }
      );
    }

    // ── 3. Check for duplicate ──
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      return NextResponse.json(
        { success: false, message: `A user with that ${field} already exists` },
        { status: 400 }
      );
    }

    // ── 4. Hash password & save User ──
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      position,
      password: hashedPassword,
      isAdmin: position === "Admin",
    });

    const savedUser = await newUser.save();

    // ── 5. If Doctor, also create a linked Doctor profile ──
    if (position === "Doctor") {
      await Doctor.create({
        userId: savedUser._id, // permanent link — no name-matching needed
        name: username,
        specialization,
        department,
        roomNumber,
        status: "Available",
        patients: [],
      });
    }

    const safeUser = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      position: savedUser.position,
      createdAt: savedUser.createdAt,
    };

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
