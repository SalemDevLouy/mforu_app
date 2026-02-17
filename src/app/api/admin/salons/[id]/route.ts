import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/salons/[id] - Get single salon
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const salon = await prisma.salon.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
        employees: {
          select: {
            id: true,
            name: true,
            hiredAt: true,
          },
        },
        customers: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        _count: {
          select: {
            employees: true,
            customers: true,
            visits: true,
          },
        },
      },
    });

    if (!salon) {
      return NextResponse.json(
        { error: "Salon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(salon);
  } catch (error) {
    console.error("Error fetching salon:", error);
    return NextResponse.json(
      { error: "Failed to fetch salon" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/salons/[id] - Update salon
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, site, phone, ownerName, ownerPhone } = body;

    // Validate required fields
    if (!name?.trim() || !site?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Salon name, site, and phone are required" },
        { status: 400 }
      );
    }

    // Check if phone is already used by another salon
    const existingSalon = await prisma.salon.findFirst({
      where: {
        phone: phone.trim(),
        id: { not: params.id },
      },
    });

    if (existingSalon) {
      return NextResponse.json(
        { error: "Phone number already in use by another salon" },
        { status: 400 }
      );
    }

    // Update salon
    const salon = await prisma.salon.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        site: site.trim(),
        phone: phone.trim(),
        ownerName: ownerName?.trim(),
        ownerPhone: ownerPhone?.trim(),
      },
    });

    return NextResponse.json({
      message: "Salon updated successfully",
      salon,
    });
  } catch (error) {
    console.error("Error updating salon:", error);
    return NextResponse.json(
      { error: "Failed to update salon" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/salons/[id] - Delete salon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if salon has related data
    const salon = await prisma.salon.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            users: true,
            employees: true,
            customers: true,
            visits: true,
          },
        },
      },
    });

    if (!salon) {
      return NextResponse.json(
        { error: "Salon not found" },
        { status: 404 }
      );
    }

    const totalRecords =
      salon._count.users +
      salon._count.employees +
      salon._count.customers +
      salon._count.visits;

    if (totalRecords > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete salon. It has ${totalRecords} related records (users, employees, customers, or visits).`,
          details: salon._count,
        },
        { status: 400 }
      );
    }

    // Delete salon
    await prisma.salon.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Salon deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting salon:", error);
    return NextResponse.json(
      { error: "Failed to delete salon" },
      { status: 500 }
    );
  }
}
