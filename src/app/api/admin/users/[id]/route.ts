import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role, UserStatus } from "@/generated/prisma";

// GET /api/admin/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { fullName, phone, password, role, salonId, status } = body;

    // Validate required fields
    if (!fullName?.trim() || !phone?.trim() || !role) {
      return NextResponse.json(
        { error: "Full name, phone, and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["APP_OWNER", "ACCOUNTANT", "SALON_OWNER", "RECEPTIONIST", "EMPLOYEE"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Check if phone is already used by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        phone: phone.trim(),
        id: { not: params.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Phone number already in use by another user" },
        { status: 400 }
      );
    }

    // If user has a salon-related role, validate salonId
    if (["SALON_OWNER", "RECEPTIONIST", "EMPLOYEE"].includes(role) && !salonId) {
      return NextResponse.json(
        { error: "Salon ID is required for this role" },
        { status: 400 }
      );
    }

    // If salonId is provided, verify it exists
    if (salonId) {
      const salonExists = await prisma.salon.findUnique({
        where: { id: salonId },
      });
      if (!salonExists) {
        return NextResponse.json(
          { error: "Salon not found" },
          { status: 404 }
        );
      }
    }

    // Build update data
    interface UpdateData {
      fullName: string;
      phone: string;
      role: Role;
      salonId: string | null;
      status?: UserStatus;
      password?: string;
    }
    const updateData: UpdateData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      role: role as Role,
      salonId: salonId || null,
    };

    // Only update password if provided
    if (password?.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Only update status if provided
    if (status) {
      updateData.status = status as UserStatus;
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      include: {
        salon: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
