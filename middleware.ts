import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = ["/dashboard", "/admin"];
const authRoutes = ["/auth/login", "/auth/signup"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // If accessing protected route without session, redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If accessing auth routes with session, redirect to dashboard
  if (authRoutes.some((route) => pathname.startsWith(route)) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/login", "/auth/signup"],
};
