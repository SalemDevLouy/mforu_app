export interface Employee {
  emp_id: string;
  emp_name: string;
  emp_phone?: string | null;
  salon_id: string;
}

export interface EmployeeFormData {
  emp_name: string;
  emp_phone: string;
}
