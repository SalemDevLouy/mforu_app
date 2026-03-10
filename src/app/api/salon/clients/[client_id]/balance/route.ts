import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to process credit payment
async function processCreditPayment(
  clientId: string,
  amount: number,
  pendingDebts: Array<{ debt_id: string; debt_val: number; date_reg: Date }>
) {
  let remainingCredit = amount;
  const updatedDebts = [];

  // Sort debts by date (oldest first)
  const sortedDebts = pendingDebts.sort((a, b) =>
    a.date_reg.getTime() - b.date_reg.getTime()
  );

  for (const debt of sortedDebts) {
    if (remainingCredit <= 0) break;

    if (debt.debt_val <= remainingCredit) {
      // Fully pay off this debt
      await prisma.debt.update({
        where: { debt_id: debt.debt_id },
        data: { status: "paid" },
      });
      remainingCredit -= debt.debt_val;
      updatedDebts.push({
        debt_id: debt.debt_id,
        amount: debt.debt_val,
        status: "paid",
      });
    } else {
      // Partially pay off this debt
      const newDebtValue = debt.debt_val - remainingCredit;
      await prisma.debt.update({
        where: { debt_id: debt.debt_id },
        data: { debt_val: newDebtValue },
      });
      updatedDebts.push({
        debt_id: debt.debt_id,
        amount: remainingCredit,
        status: "partially_paid",
        remaining: newDebtValue,
      });
      remainingCredit = 0;
    }
  }

  // If there's remaining credit after paying all debts, create a negative debt (credit balance)
  if (remainingCredit > 0) {
    const creditDebt = await prisma.debt.create({
      data: {
        client_id: clientId,
        debt_val: -remainingCredit, // Negative value represents credit
        date_reg: new Date(),
        date_exp: null,
        status: "paid",
      },
    });
    updatedDebts.push({
      debt_id: creditDebt.debt_id,
      amount: remainingCredit,
      type: "credit_balance",
    });
  }

  return { updatedDebts, remainingCredit };
}

// POST /api/salon/clients/[client_id]/balance - Adjust client balance (add credit or debt)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ client_id: string }> }
) {
  try {
    const { client_id } = await params;
    const body = await request.json();
    const { amount, type, date_exp } = body;

    if (!amount || amount === 0) {
      return NextResponse.json(
        { error: "المبلغ مطلوب ويجب أن لا يكون صفراً" },
        { status: 400 }
      );
    }

    if (!type || !["debit", "credit"].includes(type)) {
      return NextResponse.json(
        { error: "نوع العملية غير صحيح" },
        { status: 400 }
      );
    }

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { client_id },
      include: {
        debts: {
          where: { status: "pending" },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }

    const numericAmount = Number.parseFloat(amount);

    if (type === "debit") {
      // Add debt (client owes money)
      const debt = await prisma.debt.create({
        data: {
          client_id,
          debt_val: numericAmount,
          date_reg: new Date(),
          date_exp: date_exp ? new Date(date_exp) : null,
          status: "pending",
        },
      });

      return NextResponse.json({
        success: true,
        message: "تم إضافة دين بنجاح",
        debt: {
          debt_id: debt.debt_id,
          amount: debt.debt_val,
          type: "debit",
        },
      });
    }
    
    // Process credit payment
    const { updatedDebts, remainingCredit } = await processCreditPayment(
      client_id,
      numericAmount,
      client.debts
    );

    return NextResponse.json({
      success: true,
      message: "تم إضافة رصيد بنجاح",
      paidDebts: updatedDebts,
      paidAmount: numericAmount,
      remainingCredit,
    });
  } catch (error) {
    console.error("Error adjusting client balance:", error);
    return NextResponse.json(
      { error: "فشل تعديل رصيد العميل" },
      { status: 500 }
    );
  }
}

// GET /api/salon/clients/[client_id]/balance - Get client balance summary
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ client_id: string }> }
) {
  try {
    const { client_id } = await params;

    const client = await prisma.client.findUnique({
      where: { client_id },
      include: {
        debts: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }

    const totalBalance = client.debts.reduce((sum, debt) => {
      if (debt.status === "pending" || (debt.status === "paid" && debt.debt_val < 0)) {
        return sum + debt.debt_val;
      }
      return sum;
    }, 0);

    const pendingDebts = client.debts
      .filter((d) => d.status === "pending" && d.debt_val > 0)
      .reduce((sum, d) => sum + d.debt_val, 0);

    const creditBalance = Math.abs(
      client.debts
        .filter((d) => d.status === "paid" && d.debt_val < 0)
        .reduce((sum, d) => sum + d.debt_val, 0)
    );

    let balanceStatus: "debtor" | "creditor" | "balanced";
    if (totalBalance > 0) {
      balanceStatus = "debtor";
    } else if (totalBalance < 0) {
      balanceStatus = "creditor";
    } else {
      balanceStatus = "balanced";
    }

    return NextResponse.json({
      success: true,
      balance: {
        total: totalBalance,
        pendingDebts,
        creditBalance,
        status: balanceStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching client balance:", error);
    return NextResponse.json(
      { error: "فشل جلب رصيد العميل" },
      { status: 500 }
    );
  }
}
