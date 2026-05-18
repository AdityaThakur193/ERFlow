import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // ── 1. Public paths — anyone can visit ────────────────────────────────────
  const isPublicPath =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register";

  // Logged-in user tries to visit /login → bounce to dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // No token on a protected path → redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ── 2. Token exists — verify and apply RBAC ───────────────────────────────
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      // DOCTOR — allowed page routes
      if (decoded.position === "Doctor") {
        const doctorRoutes = ["/patients", "/doctor-dashboard"];
        const isAllowed = doctorRoutes.some((r) => pathname.startsWith(r));
        if (!isAllowed) {
          return NextResponse.redirect(new URL("/doctor-dashboard", req.url));
        }
      }

      // RECEPTIONIST — allowed page routes
      if (decoded.position === "Receptionist") {
        const receptionistRoutes = ["/dashboard", "/patients", "/equipment"];
        const isAllowed = receptionistRoutes.some((r) => pathname.startsWith(r));
        if (!isAllowed) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      // ADMIN — can access everything, no restrictions

    } catch {
      // Token is invalid/expired — clear it and redirect to login
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.set("token", "", { httpOnly: true, maxAge: 0, path: "/" });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Run on all page routes EXCEPT:
   * - api/*              (API routes handle their own auth)
   * - _next/static       (static assets)
   * - _next/image        (image optimisation)
   * - favicon.ico
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
