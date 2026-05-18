//this code is not in the repo completly in the local . 
import connectToDb from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import User from "@/models/User.schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(req) {
  try {
    await connectToDb()
    const reqBody = await req.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide email and password" },
        { status: 400 }
      );
    }

    //check if user exits
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist" },
        { status: 400 }
      );
    }
    //check if password correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid password" }, 
        { status: 400 }
      );
    }

    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      position: user.position,
    };
    //create a Token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "12h",
    });
    
    const response = NextResponse.json({
      message: "login successfully!",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12h — matches JWT expiry
    });
    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
