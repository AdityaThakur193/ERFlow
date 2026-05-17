import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req) {
  try {
    const token = req.cookies.get("token")?.value;

    // NO TOKEN
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const pathname = req.nextUrl.pathname;

    // DOCTOR ACCESS
    if (decoded.position === "Doctor") {
      const allowedRoutes = ["/patients", "/doctors"];

      const isAllowed = allowedRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/patients", req.url));
      }
    }

    // RECEPTIONIST ACCESS
    if (decoded.position === "Receptionist") {
      const allowedRoutes = ["/dashboard", "/patients", "/equipment"];

      const isAllowed = allowedRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // ADMIN ACCESS
    // admin can access everything

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/patients/:path*",
    "/equipment/:path*",
    "/doctors/:path*",
    "/departments/:path*",
  ],
};
// updated proxy
