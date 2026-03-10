import { Debt, DebtFormData, BalanceFormData } from "../types";

export async function fetchDebts(clientId: string): Promise<Debt[]> {
  const response = await fetch(`/api/salon/clients/${clientId}/debts`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "فشل تحميل بيانات الديون");
  return data.debts;
}

export async function addDebt(
  clientId: string,
  formData: DebtFormData
): Promise<Debt> {
  const response = await fetch(`/api/salon/clients/${clientId}/debts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "فشل إضافة الدين");
  return data.debt;
}

export async function updateDebtStatus(
  debtId: string,
  status: string
): Promise<void> {
  const response = await fetch(`/api/salon/clients/debts/${debtId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "فشل تحديث حالة الدين");
}

export async function adjustBalance(
  clientId: string,
  formData: BalanceFormData
): Promise<void> {
  const response = await fetch(`/api/salon/clients/${clientId}/balance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "فشل تعديل الرصيد");
}
