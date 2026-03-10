import { MonthlyReport } from "../../types";
import EmployeeTasksTable from "../tables/EmployeeTasksTable";
import EmployeeWithdrawalsTable from "../tables/EmployeeWithdrawalsTable";
import { formatCurrency } from "../../accounting/[salonId]/utils";

type Employee = MonthlyReport["employee_incomes"][number];

interface EmployeeCardProps {
  employee: Employee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <div className="border border-default-200 rounded-xl overflow-hidden shadow-sm">
      {/* Employee header */}
      <div className="bg-default-100 px-5 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">{employee.emp_name}</h3>
            <p className="text-sm text-default-500 font-mono" dir="ltr">
              {employee.emp_phone || "—"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-xs text-default-500 mb-1">المكتسب</p>
              <p className="font-bold text-success">{formatCurrency(employee.total_earned)}</p>
            </div>
            <div>
              <p className="text-xs text-default-500 mb-1">المسحوب</p>
              <p className="font-bold text-danger">{formatCurrency(employee.total_withdrawn)}</p>
            </div>
            <div>
              <p className="text-xs text-default-500 mb-1">الرصيد</p>
              <p className="font-bold text-primary">{formatCurrency(employee.balance)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <EmployeeTasksTable
          tasks={employee.tasks}
          tasksCount={employee.tasks_count}
          totalEarned={employee.total_earned}
          formatCurrency={formatCurrency}
        />
        <EmployeeWithdrawalsTable
          withdrawals={employee.withdrawals}
          totalWithdrawn={employee.total_withdrawn}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}
