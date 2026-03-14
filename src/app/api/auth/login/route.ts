import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    // Validate input
    if (!phone || !password) {
      return NextResponse.json(
        { error: "Phone and password are required" },
        { status: 400 }
      );
    }

    // Find user by phone
    const user = await prisma.user.findFirst({
      where: { phone: phone },
      include: {
        role: true, // Include role information
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid phone or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid phone or password" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 403 }
      );
    }

    // Return user data (without password)
    const userData = {
      user_id: user.user_id,
      name: user.name,
      phone: user.phone,
      role: user.role?.role_name || "",
      salon_id: user.salon_id,
      status: user.status,
    };

    // Sign a JWT and store it in an HTTP-only cookie for middleware validation
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "fallback-secret-change-me"
    );
    const token = await new SignJWT({
      userId: user.user_id,
      role: user.role?.role_name || "",
      salonId: user.salon_id || null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json(
      { message: "Login successful", user: userData },
      { status: 200 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
