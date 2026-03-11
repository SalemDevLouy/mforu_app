type ViewMode = "grid" | "table";

interface ApiSalon {
  salon_id: string;
  name: string;
  site: string | null;
  owner: {
    name: string;
    phone?: string | null;
    status?: string | null;
  } | null;
}
interface Salon {
  salon_id: string;
  site: string | null;
  owner: {
    name: string;
    phone?: string | null;
  } | null;
}
interface MonthlyReport {
  salon: {
    salon_id: string;
    name: string;
    site: string;
    owner: {
      name: string;
      phone: string | null;
    } | null;
  };
  period: {
    start: string;
    end: string;
    type: string;
  };
  summary: {
    total_income: number;
    total_expenses: number;
    constants_total: number;
    employee_income_total: number;
    net_profit: number;
    services_count: number;
  };
  services: Array<{
    service_id: string;
    price_total: number;
    date: string;
    client: { name: string };
  }>;
  expenses: Array<{
    exp_id: string;
    exp_type: string;
    exp_val: number;
    date: string;
  }>;
  constants: Array<{
    const_id: string;
    const_name: string;
    const_value: number;
    repetation: string;
  }>;
  employee_incomes: Array<{
    emp_id: string;
    emp_name: string;
    emp_phone: string | null;
    total_earned: number;
    total_withdrawn: number;
    balance: number;
    tasks_count: number;
    tasks: Array<{
      task_id: string;
      amount: number;
      service_price: number;
      percentage: number;
      category: string | null;
      date: string;
      client: string | null;
      client_phone: string | null;
    }>;
    withdrawals: Array<{
      withdraw_id: string;
      amount: number;
      date: string;
    }>;
  }>;
}


    
export type { ViewMode, ApiSalon, Salon, MonthlyReport };