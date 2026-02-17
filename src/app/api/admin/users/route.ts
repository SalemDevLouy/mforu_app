import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/admin/users - Get all users with optional filters
export async function GET() {
  try {
    const usersList = await prisma.user.findMany({
      select: {
        user_id: true,
        name: true,
        phone: true,
        status: true,
        salon_id: true,
        role: {
          select: {
            role_id: true,
            role_name: true,
          },
        },
        salon: {
          select: { 
            salon_id: true,
            name: true,
            site: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
   
    return NextResponse.json({
      users: usersList,
      numberOfUsers: usersList.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

//POST add new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, password, role_id ,salon_id } = body;

    // Validate required fields
    if (!name || !phone || !password || !role_id) {
      return NextResponse.json(
        { error: "name, phone, password, and role_id are required" },
        { status: 400 }
      );
    }

    // Validate phone format (optional but recommended)
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findFirst({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role_id,
        salon_id,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        phone: newUser.phone,
        role_id: newUser.role_id,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - Update existing user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, name, phone, password, role_id, salon_id, status } = body;

    // Validate required fields
    if (!user_id || !name || !phone || !role_id) {
      return NextResponse.json(
        { error: "user_id, name, phone, and role_id are required" },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if phone is already used by another user
    const phoneExists = await prisma.user.findFirst({
      where: {
        phone,
        user_id: { not: user_id },
      },
    });

    if (phoneExists) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: {
      name: string;
      phone: string;
      role_id: string;
      salon_id: string | null;
      status: string;
      password?: string;
    } = {
      name,
      phone,
      role_id,
      salon_id: salon_id || null,
      status: status || "ACTIVE",
    };

    // Only hash and update password if provided
    if (password && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: updateData,
      select: {
        user_id: true,
        name: true,
        phone: true,
        role: {
          select: {
            role_name: true,
          },
        },
        status: true,
        salon_id: true,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { user_id },
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
