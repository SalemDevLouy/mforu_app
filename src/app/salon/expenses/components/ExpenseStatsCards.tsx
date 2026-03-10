"use client";
import { Card } from "@heroui/card";
import { Expense } from "../types";

interface ExpenseStatsCardsProps {
  readonly expenses: Expense[];
}

export function ExpenseStatsCards({ expenses }: ExpenseStatsCardsProps) {
  const total   = expenses.reduce((s, e) => s + e.exp_val, 0);
  const paid    = expenses.filter((e) => e.status === "paid").reduce((s, e) => s + e.exp_val, 0);
  const pending = expenses.filter((e) => e.status === "pending").reduce((s, e) => s + e.exp_val, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 border-r-4 border-red-400">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">إجمالي المصروفات</p>
            <p className="text-2xl font-bold text-red-600">{total.toFixed(2)} دج</p>
          </div>
          <span className="text-3xl">💸</span>
        </div>
      </Card>

      <Card className="p-4 border-r-4 border-green-400">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">مدفوع</p>
            <p className="text-2xl font-bold text-green-600">{paid.toFixed(2)} دج</p>
          </div>
          <span className="text-3xl">✅</span>
        </div>
      </Card>

      <Card className="p-4 border-r-4 border-amber-400">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">معلّق</p>
            <p className="text-2xl font-bold text-amber-600">{pending.toFixed(2)} دج</p>
          </div>
          <span className="text-3xl">⏳</span>
        </div>
      </Card>
    </div>
  );
}
