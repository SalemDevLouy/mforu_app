"use client";
import { DashCard } from "@/components/common/DashCard";
import { Expense } from "../types";
import { HiBanknotes, HiCheckCircle, HiClock } from "react-icons/hi2";

interface ExpenseStatsCardsProps {
  readonly expenses: Expense[];
}

export function ExpenseStatsCards({ expenses }: ExpenseStatsCardsProps) {
  const total   = expenses.reduce((s, e) => s + e.exp_val, 0);
  const paid    = expenses.filter((e) => e.status === "paid").reduce((s, e) => s + e.exp_val, 0);
  const pending = expenses.filter((e) => e.status === "pending").reduce((s, e) => s + e.exp_val, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashCard
        title="إجمالي المصروفات"
        value={`${total.toFixed(2)} دج`}
        icon={<HiBanknotes className="text-blue-500" />}
      />
      <DashCard
        title="مدفوع"
        value={`${paid.toFixed(2)} دج`}
        icon={<HiCheckCircle className="text-blue-500" />}
      />
      <DashCard
        title="معلّق"
        value={`${pending.toFixed(2)} دج`}
        icon={<HiClock className="text-blue-500" />}
      />
    </div>
  );
}
