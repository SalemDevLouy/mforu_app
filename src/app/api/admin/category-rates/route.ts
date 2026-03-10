import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get all category rates for a salon
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon_id = searchParams.get("salon_id");

    if (!salon_id) {
      return NextResponse.json(
        { error: "salon_id is required" },
        { status: 400 }
      );
    }

    const rates = await prisma.categoryRate.findMany({
      where: { salon_id },
      include: {
        category: true,
        salon: {
          select: {
            salon_id: true,
            name: true,
            site: true,
          },
        },
      },
      orderBy: {
        category: {
          cat_name: "asc",
        },
      },
    });

    return NextResponse.json(rates);
  } catch (error) {
    console.error("Error fetching category rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch category rates" },
      { status: 500 }
    );
  }
}

// POST - Create a new category rate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salon_id, cat_id, rate } = body;

    // Validation
    if (!salon_id || !cat_id || rate === undefined || rate === null) {
      return NextResponse.json(
        { error: "salon_id, cat_id, and rate are required" },
        { status: 400 }
      );
    }

    // Validate rate is between 0 and 1
    if (rate < 0 || rate > 1) {
      return NextResponse.json(
        { error: "Rate must be between 0 and 1" },
        { status: 400 }
      );
    }

    // Check if rate already exists for this salon and category
    const existing = await prisma.categoryRate.findUnique({
      where: {
        salon_id_cat_id: {
          salon_id,
          cat_id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Rate already exists for this salon and category. Use PUT to update." },
        { status: 409 }
      );
    }

    const categoryRate = await prisma.categoryRate.create({
      data: {
        salon_id,
        cat_id,
        rate,
      },
      include: {
        category: true,
        salon: {
          select: {
            salon_id: true,
            name: true,
            site: true,
          },
        },
      },
    });

    return NextResponse.json(categoryRate, { status: 201 });
  } catch (error) {
    console.error("Error creating category rate:", error);
    return NextResponse.json(
      { error: "Failed to create category rate" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing category rate
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { rate_id, rate } = body;

    if (!rate_id || rate === undefined || rate === null) {
      return NextResponse.json(
        { error: "rate_id and rate are required" },
        { status: 400 }
      );
    }

    // Validate rate is between 0 and 1
    if (rate < 0 || rate > 1) {
      return NextResponse.json(
        { error: "Rate must be between 0 and 1" },
        { status: 400 }
      );
    }

    const categoryRate = await prisma.categoryRate.update({
      where: { rate_id },
      data: { rate },
      include: {
        category: true,
        salon: {
          select: {
            salon_id: true,
            name: true,
            site: true,
          },
        },
      },
    });

    return NextResponse.json(categoryRate);
  } catch (error) {
    console.error("Error updating category rate:", error);
    return NextResponse.json(
      { error: "Failed to update category rate" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category rate
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rate_id = searchParams.get("rate_id");

    if (!rate_id) {
      return NextResponse.json(
        { error: "rate_id is required" },
        { status: 400 }
      );
    }

    await prisma.categoryRate.delete({
      where: { rate_id },
    });

    return NextResponse.json({ message: "Category rate deleted successfully" });
  } catch (error) {
    console.error("Error deleting category rate:", error);
    return NextResponse.json(
      { error: "Failed to delete category rate" },
      { status: 500 }
    );
  }
}
