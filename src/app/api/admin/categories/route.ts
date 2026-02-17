import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/categories - Get all categories
export async function GET() {
  try {
    const categories = await prisma.categories.findMany({});

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// add new cateory 
export async function POST(reaquest : NextRequest){
  try {
    const body = await reaquest.json()
    const {category_name} = body; 
    // avouid duplicate category names
    const existingCategory = await prisma.categories.findFirst({
      where: {
        cat_name: category_name,
      },
    });
    console.log("Existing category found:", existingCategory);

    if (existingCategory) {
      return NextResponse.json({
        message: "Category name already exists sdfg",
        status: 400,
      });
    }
    const addcat = await prisma.categories.create({
      data:{
        cat_name : category_name,
      }
    })

    if (addcat) {
      return NextResponse.json({
        message :"Add new category successful",
        status : 200
      })
    }

  } catch (error) {
    console.error("POST /api/admin/categories error", error);
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