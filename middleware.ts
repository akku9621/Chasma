import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get("isAdmin")?.value;

  // If not logged in and trying to access /admin, redirect
  if (!isAdmin && request.nextUrl.pathname.startsWith("/auth/admin")) {
    return NextResponse.redirect(new URL("/auth/Login", request.url));
  }

  // If already logged in and trying to visit /Login, redirect to /admin
  if (isAdmin && request.nextUrl.pathname.startsWith("/Login")) {
    return NextResponse.redirect(new URL("/auth/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["auth/admin/:path*", "/auth/Login"],
};
