"use client";
import { DashCard } from "@/components/common/DashCard";
import { Withdrawal } from "../types";
import { HiBanknotes, HiCalendarDays, HiChartBar } from "react-icons/hi2";

interface WithdrawalStatsCardsProps {
  readonly withdrawals: Withdrawal[];
}

export function WithdrawalStatsCards({
  withdrawals,
}: WithdrawalStatsCardsProps) {
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0);

  const thisMonthWithdrawals = withdrawals
    .filter((w) => {
      const wDate = new Date(w.date);
      const now = new Date();
      return (
        wDate.getMonth() === now.getMonth() &&
        wDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashCard
        title="إجمالي السحوبات"
        value={`${totalWithdrawals.toFixed(2)} دج`}
        icon={<HiBanknotes className="text-blue-500" />}
      />
      <DashCard
        title="سحوبات هذا الشهر"
        value={`${thisMonthWithdrawals.toFixed(2)} دج`}
        icon={<HiCalendarDays className="text-blue-500" />}
      />
      <DashCard
        title="عدد السحوبات"
        value={withdrawals.length}
        icon={<HiChartBar className="text-blue-500" />}
      />
    </div>
  );
}
