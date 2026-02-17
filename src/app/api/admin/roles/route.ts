import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/roles - Get all roles
export async function GET() {
  try {
    const roles = await prisma.roleTable.findMany({
      select: {
        role_id: true,
        role_name: true,
      },
      orderBy: {
        role_name: 'asc',
      },
    });

    return NextResponse.json({
      roles,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
