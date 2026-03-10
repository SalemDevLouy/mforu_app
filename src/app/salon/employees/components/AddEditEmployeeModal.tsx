"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Employee, EmployeeFormData } from "../types";

interface AddEditEmployeeModalProps {
  readonly editingEmployee: Employee | null;
  readonly onClose: () => void;
  readonly onAdd: (data: EmployeeFormData) => Promise<void>;
  readonly onEdit: (empId: string, data: EmployeeFormData) => Promise<void>;
}

const BLANK = (): EmployeeFormData => ({ emp_name: "", emp_phone: "" });

export function AddEditEmployeeModal({
  editingEmployee,
  onClose,
  onAdd,
  onEdit,
}: AddEditEmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(BLANK());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(
      editingEmployee
        ? { emp_name: editingEmployee.emp_name, emp_phone: editingEmployee.emp_phone || "" }
        : BLANK()
    );
  }, [editingEmployee]);

  const handleClose = () => {
    setFormData(BLANK());
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingEmployee) {
        await onEdit(editingEmployee.emp_id, formData);
      } else {
        await onAdd(formData);
      }
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "فشل في حفظ البيانات";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      aria-hidden="true"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") handleClose(); }}
    >
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">
            {editingEmployee ? "تعديل موظف" : "إضافة موظف جديد"}
          </h2>
          <button
            onClick={handleClose}
            className="text-default-400 hover:text-default-700 text-2xl leading-none"
          >×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="emp_name" className="block text-sm font-medium mb-2">
              اسم الموظف <span className="text-danger">*</span>
            </label>
            <input
              id="emp_name"
              type="text"
              autoFocus
              className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.emp_name}
              onChange={(e) => setFormData({ ...formData, emp_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="emp_phone" className="block text-sm font-medium mb-2">
              رقم الهاتف
            </label>
            <input
              id="emp_phone"
              type="tel"
              className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.emp_phone}
              onChange={(e) => setFormData({ ...formData, emp_phone: e.target.value })}
              placeholder="اختياري"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="px-5 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors"
              onClick={handleClose}
            >إلغاء</button>
            <Button type="submit" color="primary" className="px-8" isLoading={submitting}>
              {editingEmployee ? "تحديث" : "إضافة موظف"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
