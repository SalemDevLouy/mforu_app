"use client";

import { useState } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { useEmployees } from "./hooks/useEmployees";
import { Employee } from "./types";
import { EmployeeGrid } from "./components/EmployeeGrid";
import { AddEditEmployeeModal } from "./components/AddEditEmployeeModal";

export default function EmployeesPage() {
  const [salonId] = useState<string>(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.salon_id || "";
    }
    return "";
  });
  const { employees, loadingEmployees, addEmployee, editEmployee, removeEmployee } =
    useEmployees(salonId);

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const openAdd = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (empId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;
    try {
      await removeEmployee(empId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "فشل في حذف الموظف";
      alert(message);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">إدارة الموظفين</h1>
          <p className="text-default-500 text-sm mt-1">إضافة وإدارة موظفي الصالون</p>
        </div>
        <Button color="primary" onPress={openAdd}>+ إضافة موظف</Button>
      </div>

      {/* Summary */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">إجمالي الموظفين</p>
            <p className="text-2xl font-bold text-primary">{employees.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
        </div>
      </Card>

      {/* Grid */}
      <EmployeeGrid
        employees={employees}
        loading={loadingEmployees}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      {showModal && (
        <AddEditEmployeeModal
          editingEmployee={editingEmployee}
          onClose={() => { setShowModal(false); setEditingEmployee(null); }}
          onAdd={addEmployee}
          onEdit={editEmployee}
        />
      )}
    </div>
  );
}
