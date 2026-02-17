import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/admin/users - Get all users with optional filters
export async function GET(request: NextRequest) {
  try {
    const usersList = await prisma.user.findMany({
      select: {
        user_id: true,
        name: true,
        phone: true,
        role: {
          select: {
            role_name: true,
          },
        }
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
    if (!name || !phone || !password || !role_id || !salon_id) {
      return NextResponse.json(
        { error: "All fields are required (name, phone, password, role_id)" },
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
