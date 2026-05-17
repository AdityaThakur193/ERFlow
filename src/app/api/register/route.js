import connectToDb from "@/dbconfig/dbconfig";
import User from "@/models/User.schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(req) {
  try {
    await connectToDb();

    const reqbody = await req.json();
    const { username, email, password, position } = reqbody;

    console.log(reqbody);

    if (!username || !email || !password || !position) {
      return NextResponse.json(
        { success: false, message: "Please fill all fields" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { success: false, message: "User with email already exists" },
        { status: 400 },
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      position,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.log(
      "Something went wrong while registering the user, in Register route",
      error,
    );
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
