"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { useSalonId } from "@/hooks/useSalonId";
import { useAppDialog } from "@/components/dialogs/AppDialogProvider";
import { DashCard } from "@/components/common/DashCard";
import { useEmployees } from "./hooks/useEmployees";
import { Employee } from "./types";
import { EmployeeGrid } from "./components/EmployeeGrid";
import { AddEditEmployeeModal } from "./components/AddEditEmployeeModal";
import { HiUsers } from "react-icons/hi2";

export default function EmployeesPage() {
  const salonId = useSalonId();
  const { showConfirm } = useAppDialog();
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
    const confirmed = await showConfirm("هل أنت متأكد من حذف هذا الموظف؟", {
      title: "تأكيد الحذف",
      confirmText: "حذف",
    });
    if (!confirmed) return;

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
      <DashCard
        title="إجمالي الموظفين"
        value={employees.length}
        icon={<HiUsers className="text-blue-500" />}
      />

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
