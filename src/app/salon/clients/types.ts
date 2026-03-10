export interface Client {
  client_id: string;
  name: string;
  phone?: string;
  notes?: string;
  totalDebt?: number;
  debtCount?: number;
  totalCredit?: number;
  creditCount?: number;
  lastVisit?: string | null;
}

export interface Debt {
  debt_id: string;
  amount: number;
  date_reg: string;
  date_exp: string | null;
  status: string;
}

export interface ClientFormData {
  name: string;
  phone?: string;
  notes?: string;
}

export interface DebtFormData {
  debt_val: string;
  date_exp: string;
}

export interface BalanceFormData {
  amount: string;
  type: "debit" | "credit";
  date_exp: string;
}
