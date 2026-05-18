import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Delete the token cookie by clearing its value and expiring it immediately.
  // httpOnly must match the flag used when the cookie was SET (login route uses httpOnly: true).
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });

  return response;
}
