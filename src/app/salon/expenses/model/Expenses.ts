import { Expense, ExpenseFilters } from "../types";

export interface ExpenseCreatePayload {
  salon_id: string;
  exp_type: string;
  exp_val: string;
  date: string;
  status: string;
  description: string;
}

export interface ExpenseUpdatePayload extends ExpenseCreatePayload {
  exp_id: string;
}

interface ExpensesResponse {
  success: boolean;
  expenses: Expense[];
  error?: string;
}

interface MutationResponse {
  success: boolean;
  error?: string;
}

function getMonthDateRange(month: string): { startDate: string; endDate: string } {
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;

  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return { startDate: "", endDate: "" };
  }

  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const paddedMonth = String(monthIndex + 1).padStart(2, "0");
  return {
    startDate: `${year}-${paddedMonth}-01`,
    endDate: `${year}-${paddedMonth}-${String(lastDay).padStart(2, "0")}`,
  };
}

export async function fetchExpenses(
  salonId: string,
  filters: ExpenseFilters
): Promise<Expense[]> {
  let url = `/api/salon/expenses?salon_id=${salonId}`;
  if (filters.exp_type) url += `&exp_type=${encodeURIComponent(filters.exp_type)}`;
  if (filters.status) url += `&status=${filters.status}`;
  if (filters.month) {
    const { startDate, endDate } = getMonthDateRange(filters.month);
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
  }

  const response = await fetch(url);
  const data: ExpensesResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch expenses");
  }
  return data.expenses;
}

export async function createExpense(payload: ExpenseCreatePayload): Promise<void> {
  const response = await fetch("/api/salon/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: MutationResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to create expense");
}

export async function updateExpense(payload: ExpenseUpdatePayload): Promise<void> {
  const response = await fetch("/api/salon/expenses", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: MutationResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to update expense");
}

export async function deleteExpense(expId: string): Promise<void> {
  const response = await fetch(`/api/salon/expenses?exp_id=${expId}`, {
    method: "DELETE",
  });
  const data: MutationResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to delete expense");
}
