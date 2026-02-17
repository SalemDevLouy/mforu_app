import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/signin", "/auth/signup", "/auth/error", "/unauthorized"];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For API routes, skip middleware (client will handle auth)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // For protected routes, the client-side will handle redirect
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/salon/:path*",
    "/reception/:path*",
  ],
};
