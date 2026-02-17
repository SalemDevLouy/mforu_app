import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/categories - Get all categories
export async function GET() {
  try {
    const constants = await prisma.constants.findMany({
        select: {
            const_id: true,
            const_name: true,
            const_value: true,
            repetation: true,
            status: true,
            started_at: true,
            salon: {
                select: {
                    salon_id: true,
                    name: true,
                },
            },
        },
    });

    return NextResponse.json(constants);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// add new constant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 5c4e314a-c627-4f43-bd64-bb3a8a2186b7
    const {
      const_name,
      const_value,
      repetation,
      status,
      salon_id,
      started_at
    } = body;
    // avoid duplicate constant names
    const existingConstant = await prisma.constants.findFirst({
      where: {
        const_name: const_name,
      },
    });

    if (existingConstant) {
      return NextResponse.json({
        message: "Constant name already exists",
        status: 400,
      });
    }
    const addConstant = await prisma.constants.create({
      data: {
        const_name: const_name,
        const_value: const_value,
        repetation: repetation,
        status: status,
        salon_id: salon_id,
        started_at: new Date(started_at),
      }
    });

    if (addConstant) {
      return NextResponse.json({
        message: "Add new constant successful",
        status: 200
      });
    }

  } catch (error) {
    console.error("POST /api/admin/constant error", error);
    const message = error instanceof Error ? error.message : String(error);
    return new NextResponse(JSON.stringify({ error: message }), { status: 400 });
  }
}
































// PUT
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, category_name } = body;
  
  try {
    // Check if category exists
    const existingCategory = await prisma.categories.findUnique({
      where: { cat_id: id },
    });
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Update category
    const updatedCategory = await prisma.categories.update({
      where: { cat_id: id },
      data: { cat_name: category_name },
    });

    return NextResponse.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });

} catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

//Delete category
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { id } = body;

  try {
    // Check if category exists
    const existingCategory = await prisma.categories.findUnique({
      where: { cat_id: id },
    });
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Delete category
    await prisma.categories.delete({
      where: { cat_id: id },
    });

    return NextResponse.json({
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}