"use client";
import { Card } from "@heroui/card";
import { Employee } from "../types";

interface EmployeeGridProps {
  readonly employees: Employee[];
  readonly loading: boolean;
  readonly onEdit: (employee: Employee) => void;
  readonly onDelete: (empId: string) => void;
}

export function EmployeeGrid({ employees, loading, onEdit, onDelete }: EmployeeGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-16 text-default-500">
        <p className="text-lg mb-2">لا توجد موظفين حالياً</p>
        <p className="text-sm">قم بإضافة موظف جديد للبدء</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {employees.map((emp) => (
        <Card key={emp.emp_id} className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl">👤</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-base truncate">{emp.emp_name}</p>
              <p className="text-xs text-default-400">
                {emp.emp_phone || "موظف"}
              </p>
            </div>
          </div>
          <div className="flex gap-2 pt-1 border-t border-default-100">
            <button
              className="flex-1 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              onClick={() => onEdit(emp)}
            >
              تعديل
            </button>
            <button
              className="flex-1 py-1.5 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors"
              onClick={() => onDelete(emp.emp_id)}
            >
              حذف
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
