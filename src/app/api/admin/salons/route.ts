import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/admin/salons - Get all salons
export async function GET() {
  try {
    const salons = await prisma.salon.findMany({
      select: {
        salon_id: true,
        site: true,
      },
    });

    return NextResponse.json(salons);
  } catch (error) {
    console.error("Error fetching salons:", error);
    return NextResponse.json(
      { error: "Failed to fetch salons" },
      { status: 500 }
    );
  }
}

// POST /api/admin/salons - Create new salon with owner account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, site, ownerName, ownerPhone, ownerPassword } = body;

    // Validate required fields
    if (!name || !site || !ownerName || !ownerPhone || !ownerPassword) {
      return NextResponse.json(
        { error: "All fields are required (name, site, ownerName, ownerPhone, ownerPassword)" },
        { status: 400 }
      );
    }

    // Validate phone format (optional but recommended)
    if (!/^\d{10}$/.test(ownerPhone)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 }
      );
    }

    // Validate password length
    if (ownerPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findFirst({
      where: { phone: ownerPhone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);

    // Create salon with owner in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get the salon owner role
      const ownerRole = await tx.roleTable.findFirst({
        where: { role_name: "salon owner" },
      });

      if (!ownerRole) {
        throw new Error("Salon owner role not found. Please run seed first.");
      }

      // Step 1: Create owner user account first (without salon_id)
      const ownerUser = await tx.user.create({
        data: {
          name: ownerName,
          phone: ownerPhone,
          password: hashedPassword,
          role_id: ownerRole.role_id,
          status: "ACTIVE",
        },
      });

      // Step 2: Create salon with owner_id
      const salon = await tx.salon.create({
        data: {
          name,
          site,
          owner_id: ownerUser.user_id,
        },
      });

      // Step 3: Update owner with salon_id
      const updatedOwner = await tx.user.update({
        where: { user_id: ownerUser.user_id },
        data: { salon_id: salon.salon_id },
      });

      return { salon, ownerUser: updatedOwner };
    });

    return NextResponse.json(
      {
        message: "Salon and owner account created successfully",
        salon: {
          salon_id: result.salon.salon_id,
          name: result.salon.name,
          site: result.salon.site,
          owner_id: result.salon.owner_id,
        },
        owner: {
          user_id: result.ownerUser.user_id,
          name: result.ownerUser.name,
          phone: result.ownerUser.phone,
          role_id: result.ownerUser.role_id,
          status: result.ownerUser.status,
          salon_id: result.ownerUser.salon_id, // Now includes salon_id
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating salon:", error);
    return NextResponse.json(
      { error: "Failed to create salon" },
      { status: 500 }
    );
  }
}
