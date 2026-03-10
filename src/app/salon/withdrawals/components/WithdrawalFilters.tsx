"use client";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Employee, WithdrawalFilters as Filters } from "../types";

interface WithdrawalFiltersProps {
  readonly filters: Filters;
  readonly employees: Employee[];
  readonly onChange: (filters: Filters) => void;
  readonly onReset: () => void;
}

export function WithdrawalFilters({
  filters,
  employees,
  onChange,
  onReset,
}: WithdrawalFiltersProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">تصفية السحوبات</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="filter-emp"
            className="block text-sm font-medium mb-2"
          >
            الموظف
          </label>
          <select
            id="filter-emp"
            className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.emp_id}
            onChange={(e) => onChange({ ...filters, emp_id: e.target.value })}
          >
            <option value="">الكل</option>
            {employees.map((employee) => (
              <option key={employee.emp_id} value={employee.emp_id}>
                {employee.emp_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-date-from"
            className="block text-sm font-medium mb-2"
          >
            من تاريخ
          </label>
          <input
            id="filter-date-from"
            type="date"
            className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.startDate}
            onChange={(e) =>
              onChange({ ...filters, startDate: e.target.value })
            }
          />
        </div>

        <div>
          <label
            htmlFor="filter-date-to"
            className="block text-sm font-medium mb-2"
          >
            إلى تاريخ
          </label>
          <input
            id="filter-date-to"
            type="date"
            className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.endDate}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
          />
        </div>

        <div className="flex items-end">
          <Button onPress={onReset} color="default" className="w-full">
            إعادة تعيين
          </Button>
        </div>
      </div>
    </Card>
  );
}
