import { NextResponse } from "next/server";
import crypto from "crypto";

// Simple secure auth for this project:
// - Uses env vars: ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET
// - Sets an HTTP-only cookie named: erflow_auth
// - Cookie value is a signed payload (HMAC) containing an expiry timestamp.

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const AUTH_SECRET = process.env.AUTH_SECRET;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !AUTH_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Server auth is not configured. Please set ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET in environment variables.",
        },
        { status: 500 }
      );
    }

    if (String(email || "").trim().toLowerCase() !== String(ADMIN_EMAIL).toLowerCase()) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (String(password || "") !== String(ADMIN_PASSWORD)) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour
    const payload = `${expiresAt}`;
    const signature = sign(payload, AUTH_SECRET);

    const res = NextResponse.json({ success: true }, { status: 200 });

    res.cookies.set({
      name: "erflow_auth",
      value: `${payload}.${signature}`,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // seconds
    });

    return res;
  } catch {
    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 }
    );
  }
}


