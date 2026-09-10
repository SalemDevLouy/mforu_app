import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { add, sub } from "@/lib/math";

function safeNumber(value: number | null | undefined): number {
  return value ?? 0;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon_id = searchParams.get("salon_id");

    if (!salon_id) {
      return NextResponse.json({ error: "معرف الصالون مطلوب" }, { status: 400 });
    }

    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(now);
    dayEnd.setHours(23, 59, 59, 999);

    const [
      todayServices,
      totalServices,
      todayDeposits,
      totalDeposits,
      todayExpenses,
      totalExpenses,
      todayWithdrawals,
      totalWithdrawals,
      todayPendingDebts,
      totalPendingDebts,
      todayCredits,
      totalCredits,
      todayVisitsCount,
      todayReservationsCount,
      activeClientsCount,
      employeesCount,
    ] = await Promise.all([
      prisma.serviceAction.aggregate({
        where: {
          salon_id,
          date: { gte: dayStart, lte: dayEnd },
        },
        _sum: { price_total: true },
      }),
      prisma.serviceAction.aggregate({
        where: { salon_id },
        _sum: { price_total: true },
      }),
      prisma.reservation.aggregate({
        where: {
          salon_id,
          date_register: { gte: dayStart, lte: dayEnd },
        },
        _sum: { deposit: true },
      }),
      prisma.reservation.aggregate({
        where: { salon_id },
        _sum: { deposit: true },
      }),
      prisma.expense.aggregate({
        where: {
          salon_id,
          date: { gte: dayStart, lte: dayEnd },
        },
        _sum: { exp_val: true },
      }),
      prisma.expense.aggregate({
        where: { salon_id },
        _sum: { exp_val: true },
      }),
      prisma.withdrawal.aggregate({
        where: {
          salon_id,
          date: { gte: dayStart, lte: dayEnd },
        },
        _sum: { amount: true },
      }),
      prisma.withdrawal.aggregate({
        where: { salon_id },
        _sum: { amount: true },
      }),
      // الديون المسجلة اليوم (المبالغ الغير محصلة - status: pending)
      prisma.debt.aggregate({
        where: {
          client: { salon_id },
          status: "pending",
          date_reg: { gte: dayStart, lte: dayEnd },
        },
        _sum: { debt_val: true },
      }),
      // إجمالي الديون المعلقة على العملاء
      prisma.debt.aggregate({
        where: {
          client: { salon_id },
          status: "pending",
        },
        _sum: { debt_val: true },
      }),
      // الفكة المسجلة اليوم (مبالغ مستلمة زائدة مستحقة للعملاء - status: credit)
      prisma.debt.aggregate({
        where: {
          client: { salon_id },
          status: "credit",
          date_reg: { gte: dayStart, lte: dayEnd },
        },
        _sum: { debt_val: true },
      }),
      // إجمالي الفكة المعلقة المستحقة للعملاء
      prisma.debt.aggregate({
        where: {
          client: { salon_id },
          status: "credit",
        },
        _sum: { debt_val: true },
      }),
      prisma.serviceAction.count({
        where: {
          salon_id,
          date: { gte: dayStart, lte: dayEnd },
        },
      }),
      prisma.reservation.count({
        where: {
          salon_id,
          date_register: { gte: dayStart, lte: dayEnd },
        },
      }),
      prisma.client.count({
        where: { salon_id },
      }),
      prisma.employee.count({
        where: { salon_id },
      }),
    ]);

    const todayServicesIncome = safeNumber(todayServices._sum.price_total);
    const totalServicesIncome = safeNumber(totalServices._sum.price_total);

    const todayDepositIncome = safeNumber(todayDeposits._sum.deposit);
    const totalDepositIncome = safeNumber(totalDeposits._sum.deposit);

    const todayExpensesTotal = safeNumber(todayExpenses._sum.exp_val);
    const totalExpensesTotal = safeNumber(totalExpenses._sum.exp_val);

    const todayWithdrawalsTotal = safeNumber(todayWithdrawals._sum.amount);
    const totalWithdrawalsTotal = safeNumber(totalWithdrawals._sum.amount);

    const todayPendingDebtsTotal = safeNumber(todayPendingDebts._sum.debt_val);
    const totalPendingDebtsTotal = safeNumber(totalPendingDebts._sum.debt_val);

    const todayCreditsTotal = safeNumber(todayCredits._sum.debt_val);
    const totalCreditsTotal = safeNumber(totalCredits._sum.debt_val);

    // النقود في محفظة الصالون =
    //   دخل الخدمات + العربون (عربون الحجز) + الفكة المستحقة للعملاء (أموال مستلمة زائدة)
    //   − المصاريف − السحوبات − الديون المسجلة (أموال لم تُحصل بعد)
    const todayNetWallet = sub(
      add(add(todayServicesIncome, todayDepositIncome), todayCreditsTotal),
      add(add(todayExpensesTotal, todayWithdrawalsTotal), todayPendingDebtsTotal)
    );

    const totalNetWallet = sub(
      add(add(totalServicesIncome, totalDepositIncome), totalCreditsTotal),
      add(add(totalExpensesTotal, totalWithdrawalsTotal), totalPendingDebtsTotal)
    );

    return NextResponse.json({
      success: true,
      stats: {
        todayNetWallet,
        todayServicesIncome,
        todayDepositIncome,
        todayExpenses: todayExpensesTotal,
        todayWithdrawals: todayWithdrawalsTotal,
        todayPendingDebts: todayPendingDebtsTotal,
        todayCredits: todayCreditsTotal,
        todayVisitsCount,
        todayReservationsCount,
        totalNetWallet,
        totalServicesIncome,
        totalDepositIncome,
        totalExpenses: totalExpensesTotal,
        totalWithdrawals: totalWithdrawalsTotal,
        totalPendingDebts: totalPendingDebtsTotal,
        totalCredits: totalCreditsTotal,
        activeClientsCount,
        employeesCount,
      },
    });
  } catch (error) {
    console.error("Error fetching salon dashboard stats:", error);
    return NextResponse.json(
      { error: "فشل جلب إحصائيات الصالون" },
      { status: 500 }
    );
  }
}
