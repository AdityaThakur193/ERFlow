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
    console.log(reqBody);

    //check if user exits
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    //check if password correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      position:user.position
    };
    //create a Token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    
    const response = NextResponse.json({
      message: "login successfully!",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
