import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/salon/clients/debts/[debt_id] - Update debt status (mark as paid)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ debt_id: string }> }
) {
  try {
    const { debt_id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["pending", "paid", "cancelled", "credit_returned"].includes(status)) {
      return NextResponse.json(
        { error: "حالة الدين غير صحيحة" },
        { status: 400 }
      );
    }

    const debt = await prisma.debt.findUnique({
      where: { debt_id },
    });

    if (!debt) {
      return NextResponse.json(
        { error: "الدين غير موجود" },
        { status: 404 }
      );
    }

    const updatedDebt = await prisma.debt.update({
      where: { debt_id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      debt: {
        debt_id: updatedDebt.debt_id,
        amount: updatedDebt.debt_val,
        status: updatedDebt.status,
      },
      message: "تم تحديث حالة الدين بنجاح",
    });
  } catch (error) {
    console.error("Error updating debt:", error);
    return NextResponse.json(
      { error: "فشل تحديث حالة الدين" },
      { status: 500 }
    );
  }
}

// DELETE /api/salon/clients/debts/[debt_id] - Delete a debt
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ debt_id: string }> }
) {
  try {
    const { debt_id } = await params;

    const debt = await prisma.debt.findUnique({
      where: { debt_id },
    });

    if (!debt) {
      return NextResponse.json(
        { error: "الدين غير موجود" },
        { status: 404 }
      );
    }

    // Only allow deletion of cancelled or pending debts
    if (debt.status === "paid") {
      return NextResponse.json(
        { error: "لا يمكن حذف دين مدفوع" },
        { status: 400 }
      );
    }

    await prisma.debt.delete({
      where: { debt_id },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف الدين بنجاح",
    });
  } catch (error) {
    console.error("Error deleting debt:", error);
    return NextResponse.json(
      { error: "فشل حذف الدين" },
      { status: 500 }
    );
  }
}
