import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/admin/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { user_id: id },
      include: {
        salon: {
          select: {
            salon_id: true,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone, password, role_id, salonId, status } = body;

    // Validate required fields
    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Name and phone are required" },
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
        user_id: { not: id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Phone number already in use by another user" },
        { status: 400 }
      );
    }

    // If salonId is provided, verify it exists
    if (salonId) {
      const salonExists = await prisma.salon.findUnique({
        where: { salon_id: salonId },
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
      name: string;
      phone: string;
      role_id?: string | null;
      salon_id?: string | null;
      status?: string;
      password?: string;
    }
    const updateData: UpdateData = {
      name: name.trim(),
      phone: phone.trim(),
      role_id: role_id || null,
      salon_id: salonId || null,
    };

    // Only update password if provided
    if (password?.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Only update status if provided
    if (status) {
      updateData.status = status;
    }

    // Update user
    const user = await prisma.user.update({
      where: { user_id: id },
      data: updateData,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { user_id: id },
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
