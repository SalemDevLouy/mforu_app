import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // If DATABASE_URL is not configured (e.g. local dev without Neon yet),
    // return a small mock dataset so the dashboard still works.
    if (!process.env.DATABASE_URL) {
      const mock = [
        { id: "1", name: "أحمد", email: "ahmed@example.com" },
        { id: "2", name: "سارة", email: "sara@example.com" },
      ];
      return NextResponse.json(mock);
    }

    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (err) {
    console.error("GET /api/users error", err);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch users" }), { status: 500 });
  }
}
