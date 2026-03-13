import { Withdrawal, WithdrawalFilters } from "../types";

export interface WithdrawalCreatePayload {
  salon_id: string;
  emp_id: string;
  amount: number;
  date: string;
}

interface WithdrawalsResponse {
  success: boolean;
  withdrawals: Withdrawal[];
  error?: string;
}

interface MutationResponse {
  success: boolean;
  error?: string;
}

export async function fetchWithdrawals(
  salonId: string,
  filters: WithdrawalFilters
): Promise<Withdrawal[]> {
  const params = new URLSearchParams();
  params.append("salon_id", salonId);
  if (filters.emp_id) params.append("emp_id", filters.emp_id);
  if (filters.month) params.append("month", filters.month);

  const response = await fetch(`/api/salon/withdrawals?${params.toString()}`);
  const data: WithdrawalsResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to fetch withdrawals");
  }
  return data.withdrawals;
}

export async function createWithdrawal(
  payload: WithdrawalCreatePayload
): Promise<void> {
  const response = await fetch("/api/salon/withdrawals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: MutationResponse = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to create withdrawal");
  }
}

export async function deleteWithdrawal(withdrawId: string): Promise<void> {
  const response = await fetch(
    `/api/salon/withdrawals?withdraw_id=${withdrawId}`,
    { method: "DELETE" }
  );

  const data: MutationResponse = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to delete withdrawal");
  }
}
