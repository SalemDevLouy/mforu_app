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

export async function fetchExpenses(
  salonId: string,
  filters: ExpenseFilters
): Promise<Expense[]> {
  let url = `/api/salon/expenses?salon_id=${salonId}`;
  if (filters.exp_type) url += `&exp_type=${encodeURIComponent(filters.exp_type)}`;
  if (filters.status) url += `&status=${filters.status}`;

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
