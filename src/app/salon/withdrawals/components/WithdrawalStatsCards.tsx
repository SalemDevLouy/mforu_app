"use client";
import { Card } from "@heroui/card";
import { Withdrawal } from "../types";

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
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">إجمالي السحوبات</p>
            <p className="text-2xl font-bold text-danger">
              {totalWithdrawals.toFixed(2)} دج
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
            <span className="text-2xl">💸</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">سحوبات هذا الشهر</p>
            <p className="text-2xl font-bold text-warning">
              {thisMonthWithdrawals.toFixed(2)} دج
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">عدد السحوبات</p>
            <p className="text-2xl font-bold text-primary">
              {withdrawals.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
