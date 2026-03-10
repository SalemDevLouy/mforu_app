import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/salon/employees/[id] - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { emp_name, emp_phone } = body;

    // Validation
    if (!emp_name) {
      return NextResponse.json(
        { error: "اسم الموظف مطلوب" },
        { status: 400 }
      );
    }

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { emp_id: id },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "الموظف غير موجود" },
        { status: 404 }
      );
    }

    // Update employee
    const employee = await prisma.employee.update({
      where: { emp_id: id },
      data: {
        emp_name,
        emp_phone: emp_phone ?? undefined,
      },
    });

    return NextResponse.json({
      message: "تم تحديث الموظف بنجاح",
      employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "فشل في تحديث الموظف" },
      { status: 500 }
    );
  }
}

// DELETE /api/salon/employees/[id] - Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { emp_id: id },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "الموظف غير موجود" },
        { status: 404 }
      );
    }

    // Delete employee
    await prisma.employee.delete({
      where: { emp_id: id },
    });

    return NextResponse.json({
      message: "تم حذف الموظف بنجاح",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "فشل في حذف الموظف" },
      { status: 500 }
    );
  }
}
