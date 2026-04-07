export interface Expense {
  exp_id: string;
  date: string;
  status: string;
  exp_type: string;
  exp_val: number;
  description?: string | null;
}

export interface ExpenseFormData {
  exp_type: string;
  exp_val: string;
  date: string;
  status: string;
  description: string;
}

export interface ExpenseFilters {
  exp_type: string;
  status: string;
  month: string;
}
