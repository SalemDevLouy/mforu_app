import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret-change-me"
);

// Route → required roles mapping
const ROUTE_ROLES: { prefix: string; roles: string[] }[] = [
  { prefix: "/admin", roles: ["admin of system", "accounting man"] },
  { prefix: "/salon",  roles: ["salon owner", "reception"] },
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Determine if this route has a role requirement
  const routeRule = ROUTE_ROLES.find((r) => pathname.startsWith(r.prefix));
  if (!routeRule) return NextResponse.next();

  const token = req.cookies.get("auth-token")?.value;

  // ── No token → not authenticated ──────────────────────────────────────────
  if (!token) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // ── Verify token ───────────────────────────────────────────────────────────
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string | undefined;

    if (!role || !routeRule.roles.includes(role)) {
      // Authenticated but wrong role → unauthorized
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // All good – pass through
    return NextResponse.next();
  } catch {
    // Token invalid / expired → force re-login
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(signInUrl);
    // Clear the bad cookie
    response.cookies.set("auth-token", "", { maxAge: 0, path: "/" });
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/salon/:path*",
    "/reception/:path*",
  ],
};
