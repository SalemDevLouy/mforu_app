import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sum, add, parseAmount } from "@/lib/math";

// GET /api/salon/expenses - Get all expenses for a salon
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon_id = searchParams.get("salon_id");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const exp_type = searchParams.get("exp_type");

    if (!salon_id) {
      return NextResponse.json(
        { error: "معرف الصالون مطلوب" },
        { status: 400 }
      );
    }

    const expenses = await prisma.expense.findMany({
      where: {
        salon_id,
        ...(status && { status }),
        ...(exp_type && { exp_type }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      },
      orderBy: {
        date: "desc",
      },
    });

    const totalExpenses = sum(expenses.map((exp) => exp.exp_val));
    const expensesByType = expenses.reduce((acc, exp) => {
      acc[exp.exp_type] = add(acc[exp.exp_type] ?? 0, exp.exp_val);
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      expenses: expenses.map((exp) => ({
        exp_id: exp.exp_id,
        date: exp.date,
        status: exp.status,
        exp_type: exp.exp_type,
        exp_val: exp.exp_val,
        description: exp.description,
      })),
      summary: {
        total: totalExpenses,
        count: expenses.length,
        byType: expensesByType,
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "فشل جلب بيانات المصروفات" },
      { status: 500 }
    );
  }
}

// POST /api/salon/expenses - Create a new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { salon_id, exp_type, exp_val, date, status, description } = body;

    if (!salon_id || !exp_type || !exp_val) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب ملؤها" },
        { status: 400 }
      );
    }

    if (exp_val <= 0) {
      return NextResponse.json(
        { error: "قيمة المصروف يجب أن تكون أكبر من صفر" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        salon_id,
        exp_type: exp_type.trim(),
        exp_val: parseAmount(exp_val),
        date: date ? new Date(date) : new Date(),
        status: status || "paid",
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      expense: {
        exp_id: expense.exp_id,
        date: expense.date,
        status: expense.status,
        exp_type: expense.exp_type,
        exp_val: expense.exp_val,
        description: expense.description,
      },
      message: "تم إضافة المصروف بنجاح",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "فشل إضافة المصروف" },
      { status: 500 }
    );
  }
}

// PUT /api/salon/expenses - Update an expense
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { exp_id, exp_type, exp_val, date, status, description } = body;

    if (!exp_id) {
      return NextResponse.json(
        { error: "معرف المصروف مطلوب" },
        { status: 400 }
      );
    }

    const existingExpense = await prisma.expense.findUnique({
      where: { exp_id },
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: "المصروف غير موجود" },
        { status: 404 }
      );
    }

    const updatedExpense = await prisma.expense.update({
      where: { exp_id },
      data: {
        ...(exp_type && { exp_type: exp_type.trim() }),
        ...(exp_val && { exp_val: parseAmount(exp_val) }),
        ...(date && { date: new Date(date) }),
        ...(status && { status }),
        description: description !== undefined ? (description?.trim() || null) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      expense: {
        exp_id: updatedExpense.exp_id,
        date: updatedExpense.date,
        status: updatedExpense.status,
        exp_type: updatedExpense.exp_type,
        exp_val: updatedExpense.exp_val,
        description: updatedExpense.description,
      },
      message: "تم تحديث المصروف بنجاح",
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "فشل تحديث المصروف" },
      { status: 500 }
    );
  }
}

// DELETE /api/salon/expenses?exp_id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exp_id = searchParams.get("exp_id");

    if (!exp_id) {
      return NextResponse.json(
        { error: "معرف المصروف مطلوب" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.findUnique({
      where: { exp_id },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "المصروف غير موجود" },
        { status: 404 }
      );
    }

    await prisma.expense.delete({
      where: { exp_id },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف المصروف بنجاح",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "فشل حذف المصروف" },
      { status: 500 }
    );
  }
}
