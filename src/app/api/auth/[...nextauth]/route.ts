// NextAuth has been replaced with custom auth
// Use /api/auth/login and /api/auth/logout instead

import { NextResponse } from "next/server";

const message = { message: "NextAuth is disabled. Use /api/auth/login instead." };

export async function GET() {
  return NextResponse.json(message, { status: 404 });
}

export async function POST() {
  return NextResponse.json(message, { status: 404 });
}
