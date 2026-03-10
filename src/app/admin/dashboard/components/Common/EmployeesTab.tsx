import { Card } from "@heroui/card";
import { MonthlyReport } from "../../types";
import EmployeeCard from "../Cards/EmployeeCard";

interface EmployeesTabProps {
  report: MonthlyReport;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedEmployee: string;
  onEmployeeChange: (empId: string) => void;
  filteredEmployees: MonthlyReport["employee_incomes"];
}

export default function EmployeesTab({
  report,
  selectedMonth,
  onMonthChange,
  selectedEmployee,
  onEmployeeChange,
  filteredEmployees,
}: EmployeesTabProps) {
  return (
    <div className="space-y-6">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        {/* Month filter */}
        <div className="flex flex-col gap-1">
          <label htmlFor="emp-month" className="text-xs font-medium text-default-500">الشهر</label>
          <input
            id="emp-month"
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-3 py-2 border border-default-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Employee filter */}
        <div className="flex flex-col gap-1">
          <label htmlFor="emp-filter" className="text-xs font-medium text-default-500">الموظف</label>
          <select
            id="emp-filter"
            value={selectedEmployee}
            onChange={(e) => onEmployeeChange(e.target.value)}
            className="px-3 py-2 border border-default-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">كل الموظفين</option>
            {report.employee_incomes.map((emp) => (
              <option key={emp.emp_id} value={emp.emp_id}>{emp.emp_name}</option>
            ))}
          </select>
        </div>

        {/* Results count badge */}
        <span className="text-xs text-default-500 self-end pb-2">
          {filteredEmployees.length} موظف
        </span>
      </div>

      {/* Employee cards */}
      {filteredEmployees.length === 0 ? (
        <Card className="p-8 text-center text-default-400">
          لا توجد نتائج للفلتر المحدد
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.emp_id} employee={employee} />
          ))}
        </div>
      )}
    </div>
  );
}
