export interface Withdrawal {
  withdraw_id: string;
  emp_id: string;
  emp_name: string;
  emp_role?: string;
  salon_name: string;
  amount: number;
  date: string;
}

export interface Employee {
  emp_id: string;
  emp_name: string;
  field: string;
  role?: string;
}

export interface WithdrawalFormData {
  emp_id: string;
  amount: string;
  date: string;
  notes: string;
}

export interface WithdrawalFilters {
  emp_id: string;
  month: string;
}
