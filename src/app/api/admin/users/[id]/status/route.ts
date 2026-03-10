import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/admin/users/[id]/status - Toggle user status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required (ACTIVE or INACTIVE)" },
        { status: 400 }
      );
    }

    // Update user status
    const user = await prisma.user.update({
      where: { user_id: id },
      data: {
        status: status as string,
      },
      include: {
        salon: {
          select: {
            salon_id: true,
            name: true,
          },
        },
      },
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: `User status updated to ${status}`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
