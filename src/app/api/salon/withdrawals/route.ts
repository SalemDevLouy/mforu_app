import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum, parseAmount } from "@/lib/math";

// GET /api/salon/withdrawals - Get all withdrawals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emp_id = searchParams.get("emp_id");
    const salon_id = searchParams.get("salon_id");
    // month param format: YYYY-MM  (e.g. 2026-03)
    const month = searchParams.get("month");

    let dateFilter = {};
    if (month) {
      const [year, mon] = month.split("-").map(Number);
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 1); // exclusive start of next month
      dateFilter = { date: { gte: start, lt: end } };
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        ...(emp_id && { emp_id }),
        ...(salon_id && { salon_id }),
        ...dateFilter,
      },
      include: {
        employee: {
          select: { emp_name: true },
        },
        salon: {
          select: { name: true },
        },
      },
      orderBy: { date: "desc" },
    });

    const totalWithdrawals = sum(withdrawals.map((w) => w.amount));

    return NextResponse.json({
      success: true,
      withdrawals: withdrawals.map((w) => ({
        withdraw_id: w.withdraw_id,
        emp_id: w.emp_id,
        emp_name: w.employee.emp_name,
        salon_name: w.salon.name,
        amount: w.amount,
        date: w.date,
      })),
      summary: {
        total: totalWithdrawals,
        count: withdrawals.length,
      },
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "فشل جلب بيانات السحوبات" },
      { status: 500 }
    );
  }
}

// POST /api/salon/withdrawals - Create a new withdrawal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salon_id, emp_id, amount, date } = body;

    if (!salon_id || !emp_id || !amount) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "المبلغ يجب أن يكون أكبر من صفر" },
        { status: 400 }
      );
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { emp_id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "الموظف غير موجود" },
        { status: 404 }
      );
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        salon_id,
        emp_id,
        amount: parseAmount(amount),
        date: date ? new Date(date) : new Date(),
      },
      include: {
        employee: {
          select: {
            emp_name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      withdrawal: {
        withdraw_id: withdrawal.withdraw_id,
        emp_name: withdrawal.employee.emp_name,
        amount: withdrawal.amount,
        date: withdrawal.date,
      },
      message: "تم إضافة السحب بنجاح",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating withdrawal:", error);
    return NextResponse.json(
      { error: "فشل إضافة السحب" },
      { status: 500 }
    );
  }
}

// PUT /api/salon/withdrawals - Update a withdrawal
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { withdraw_id, amount, date } = body;

    if (!withdraw_id) {
      return NextResponse.json(
        { error: "معرف السحب مطلوب" },
        { status: 400 }
      );
    }

    const existingWithdrawal = await prisma.withdrawal.findUnique({
      where: { withdraw_id },
    });

    if (!existingWithdrawal) {
      return NextResponse.json(
        { error: "السحب غير موجود" },
        { status: 404 }
      );
    }

    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { withdraw_id },
      data: {
        ...(amount && { amount: parseAmount(amount) }),
        ...(date && { date: new Date(date) }),
      },
      include: {
        employee: {
          select: {
            emp_name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      withdrawal: {
        withdraw_id: updatedWithdrawal.withdraw_id,
        emp_name: updatedWithdrawal.employee.emp_name,
        amount: updatedWithdrawal.amount,
        date: updatedWithdrawal.date,
      },
      message: "تم تحديث السحب بنجاح",
    });
  } catch (error) {
    console.error("Error updating withdrawal:", error);
    return NextResponse.json(
      { error: "فشل تحديث السحب" },
      { status: 500 }
    );
  }
}

// DELETE /api/salon/withdrawals?withdraw_id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withdraw_id = searchParams.get("withdraw_id");

    if (!withdraw_id) {
      return NextResponse.json(
        { error: "معرف السحب مطلوب" },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { withdraw_id },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "السحب غير موجود" },
        { status: 404 }
      );
    }

    await prisma.withdrawal.delete({
      where: { withdraw_id },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف السحب بنجاح",
    });
  } catch (error) {
    console.error("Error deleting withdrawal:", error);
    return NextResponse.json(
      { error: "فشل حذف السحب" },
      { status: 500 }
    );
  }
}
