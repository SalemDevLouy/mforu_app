interface Category {
  cat_id: string;
  cat_name: string;
}

interface Employee {
  emp_id: string;
  emp_name: string;
  field: string;
  role: string | null;
}

interface ClientData {
  found: boolean;
  client: {
    client_id: string;
    name: string;
    phone: string;
    notes: string | null;
  } | null;
  totalDebt: number;
  debts: Array<{
    debt_id: string;
    amount: number;
    date_reg: string;
    date_exp: string | null;
    status: string;
  }>;
  hasReservation: boolean;
  reservations: Array<{
    reservation_id: string;
    date: string;
    deposit: number;
    status: string;
  }>;
}

interface CompletedService {
  service_id: string;
  client_name: string;
  client_phone: string | null;
  categories: string[];
  employees: string[];
  price_total: number;
  date: string;
  notes: string | null;
}

interface TaskItem {
  id: number;
  catId: string;
  price: string;
  employeeIds: string[];
}

interface ServiceFormData {
  clientName: string;
  clientPhone: string;
  paidAmount: string;
  notes: string;
}

export type { Category, Employee, ClientData, CompletedService, TaskItem, ServiceFormData };