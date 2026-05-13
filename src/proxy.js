import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "erflow_auth";

function isProtectedPath(pathname) {
  // Protect app pages that exist under /dashboard, /patients, /doctors, /equipment
  return [
    
    "/dashboard",
    "/patients",
    "/doctors",
    "/equipment",
  ].includes(pathname);
}

function hasAuthCookie(req) {
  const cookies = req.cookies;
  return Boolean(cookies.get(AUTH_COOKIE_NAME));
}

export function proxy(req) {
  const { pathname, search } = req.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (hasAuthCookie(req)) {
    return NextResponse.next();
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    
    "/dashboard",
    "/patients",
    "/doctors",
    "/equipment",
  ],
};

