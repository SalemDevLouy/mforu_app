"use client";
import { ExpenseFilters } from "../types";
import { EXPENSE_CATEGORIES } from "../constants";

interface ExpenseFiltersBarProps {
  readonly filters: ExpenseFilters;
  readonly onChange: (filters: ExpenseFilters) => void;
}

export function ExpenseFiltersBar({ filters, onChange }: ExpenseFiltersBarProps) {
  const hasFilters = !!(filters.exp_type || filters.status);

  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <select
        className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={filters.exp_type}
        onChange={(e) => onChange({ ...filters, exp_type: e.target.value })}
      >
        <option value="">🗂 كل الأنواع</option>
        {EXPENSE_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.icon} {c.value}
          </option>
        ))}
      </select>

      <select
        className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">📌 كل الحالات</option>
        <option value="paid">✅ مدفوع</option>
        <option value="pending">⏳ معلّق</option>
      </select>

      {hasFilters && (
        <button
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
          onClick={() => onChange({ exp_type: "", status: "" })}
        >
          × مسح الفلاتر
        </button>
      )}
    </div>
  );
}
