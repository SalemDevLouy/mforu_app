import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sub, sum, parseAmount } from "@/lib/math";

type DebtRecord = { debt_id: string; debt_val: number; date_reg: Date };

// Helper function to process credit payment
async function processCreditPayment(
  clientId: string,
  amount: number,
  pendingDebts: DebtRecord[]
) {
  let remainingCredit = amount;
  const updatedDebts = [];

  // Sort debts by date (oldest first)
  const sortedDebts = [...pendingDebts].sort((a, b) =>
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
      remainingCredit = sub(remainingCredit, debt.debt_val);
      updatedDebts.push({
        debt_id: debt.debt_id,
        amount: debt.debt_val,
        status: "paid",
      });
    } else {
      // Partially pay off this debt
      const newDebtValue = sub(debt.debt_val, remainingCredit);
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

  // If there's remaining credit after paying all debts, keep it as active client credit
  if (remainingCredit > 0) {
    const creditDebt = await prisma.debt.create({
      data: {
        client_id: clientId,
        debt_val: remainingCredit,
        date_reg: new Date(),
        date_exp: null,
        status: "credit",
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

async function processDebitAgainstCreditBalance(
  clientId: string,
  amount: number,
  creditDebts: DebtRecord[],
  dateExp?: string
) {
  let remainingDebit = amount;
  const updatedCredits = [];

  const sortedCredits = [...creditDebts].sort((a, b) =>
    a.date_reg.getTime() - b.date_reg.getTime()
  );

  for (const credit of sortedCredits) {
    if (remainingDebit <= 0) break;

    if (credit.debt_val <= remainingDebit) {
      await prisma.debt.update({
        where: { debt_id: credit.debt_id },
        data: { status: "credit_returned" },
      });
      remainingDebit = sub(remainingDebit, credit.debt_val);
      updatedCredits.push({
        debt_id: credit.debt_id,
        amount: credit.debt_val,
        status: "credit_used",
      });
    } else {
      const newCreditValue = sub(credit.debt_val, remainingDebit);
      await prisma.debt.update({
        where: { debt_id: credit.debt_id },
        data: { debt_val: newCreditValue },
      });
      updatedCredits.push({
        debt_id: credit.debt_id,
        amount: remainingDebit,
        status: "partially_used",
        remaining: newCreditValue,
      });
      remainingDebit = 0;
    }
  }

  let createdDebt = null;
  if (remainingDebit > 0) {
    createdDebt = await prisma.debt.create({
      data: {
        client_id: clientId,
        debt_val: remainingDebit,
        date_reg: new Date(),
        date_exp: dateExp ? new Date(dateExp) : null,
        status: "pending",
      },
    });
  }

  return { updatedCredits, remainingDebit, createdDebt };
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
          where: { status: { in: ["pending", "credit"] } },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "العميل غير موجود" },
        { status: 404 }
      );
    }

    const numericAmount = parseAmount(amount);

    if (type === "debit") {
      const creditDebts = client.debts.filter((debt) => debt.status === "credit" && debt.debt_val > 0);
      const { createdDebt, updatedCredits, remainingDebit } = await processDebitAgainstCreditBalance(
        client_id,
        numericAmount,
        creditDebts,
        date_exp
      );

      return NextResponse.json({
        success: true,
        message: "تم إضافة دين بنجاح",
        debt: createdDebt
          ? {
              debt_id: createdDebt.debt_id,
              amount: createdDebt.debt_val,
              type: "debit",
            }
          : null,
        creditApplied: sub(numericAmount, remainingDebit),
        updatedCredits,
      });
    }
    
    // Process credit payment
    const { updatedDebts, remainingCredit } = await processCreditPayment(
      client_id,
      numericAmount,
      client.debts.filter((debt) => debt.status === "pending" && debt.debt_val > 0)
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

    const totalBalance = sum(
      client.debts
        .filter((debt) => debt.status === "pending")
        .map((debt) => debt.debt_val)
    );

    const pendingDebts = sum(
      client.debts
        .filter((d) => d.status === "pending" && d.debt_val > 0)
        .map((d) => d.debt_val)
    );

    const creditBalance = Math.abs(
      sum(
        client.debts
          .filter((d) => d.status === "credit")
          .map((d) => d.debt_val)
      )
    );

    let balanceStatus: "debtor" | "creditor" | "balanced";
    if (pendingDebts > 0) {
      balanceStatus = "debtor";
    } else if (creditBalance > 0) {
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
