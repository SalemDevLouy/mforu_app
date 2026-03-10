import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/salons/[id] - Get single salon
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const salon = await prisma.salon.findUnique({
      where: { salon_id: id },
      include: {
        users: {
          select: {
            user_id: true,
            name: true,
            phone: true,
            role_id: true,
            status: true,
          },
        },
        employees: {
          select: {
            emp_id: true,
            emp_name: true,
          },
        },
        clients: {
          select: {
            client_id: true,
            name: true,
            phone: true,
          },
        },
        _count: {
          select: {
            employees: true,
            clients: true,
            services: true,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, site } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Salon name is required" },
        { status: 400 }
      );
    }

    // Update salon
    const salon = await prisma.salon.update({
      where: { salon_id: id },
      data: {
        name: name.trim(),
        site: site?.trim() || null,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if salon has related data
    const salon = await prisma.salon.findUnique({
      where: { salon_id: id },
      include: {
        _count: {
          select: {
            users: true,
            employees: true,
            clients: true,
            services: true,
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
      salon._count.clients +
      salon._count.services;

    if (totalRecords > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete salon. It has ${totalRecords} related records (users, employees, clients, or services).`,
          details: salon._count,
        },
        { status: 400 }
      );
    }

    // Delete salon
    await prisma.salon.delete({
      where: { salon_id: id },
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
