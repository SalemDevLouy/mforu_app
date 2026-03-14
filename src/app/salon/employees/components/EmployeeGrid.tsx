"use client";
import { Employee } from "../types";
import { EmployeeCard } from "./EmployeeCard";

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
        <EmployeeCard
          key={emp.emp_id}
          employee={emp}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
