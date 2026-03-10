import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/salon/employees?salon_id=... - Get all employees for a salon
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get("salon_id");

    if (!salonId) {
      return NextResponse.json({ error: "salon_id مطلوب" }, { status: 400 });
    }

    const employees = await prisma.employee.findMany({
      where: { salon_id: salonId },
      orderBy: { emp_name: "asc" },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "فشل في جلب الموظفين" }, { status: 500 });
  }
}

// POST /api/salon/employees - Add new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emp_name, emp_phone, salon_id } = body;

    // Validation
    if (!emp_name || !salon_id) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة (emp_name, salon_id)" },
        { status: 400 }
      );
    }

    // Check if salon exists
    const salon = await prisma.salon.findUnique({
      where: { salon_id },
    });

    if (!salon) {
      return NextResponse.json(
        { error: "الصالون غير موجود" },
        { status: 404 }
      );
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        emp_name,
        emp_phone: emp_phone || null,
        salon_id,
      },
    });

    return NextResponse.json(
      {
        message: "تم إضافة الموظف بنجاح",
        employee,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "فشل في إضافة الموظف" },
      { status: 500 }
    );
  }
}
