"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Employee, WithdrawalFormData } from "../types";

interface AddWithdrawalModalProps {
  readonly employees: Employee[];
  readonly loadingEmployees: boolean;
  readonly salonId: string;
  readonly onClose: () => void;
  readonly onSubmit: (data: WithdrawalFormData) => Promise<void>;
}

const defaultForm = (): WithdrawalFormData => ({
  emp_id: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  notes: "",
});

export function AddWithdrawalModal({
  employees,
  loadingEmployees,
  salonId,
  onClose,
  onSubmit,
}: AddWithdrawalModalProps) {
  const [formData, setFormData] = useState<WithdrawalFormData>(defaultForm());
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.emp_id) {
      alert("يرجى اختيار الموظف");
      return;
    }
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      alert("يرجى إدخال مبلغ صحيح");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      alert("تم إضافة السحب بنجاح");
      setFormData(defaultForm());
      onClose();
    } catch (err) {
      console.error("Error saving withdrawal:", err);
      alert("فشل حفظ البيانات");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(defaultForm());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-hidden="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative">
        <button
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
          type="button"
          onClick={handleClose}
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">إضافة سحب جديد</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee */}
            <div>
              <label htmlFor="emp-select" className="block text-sm font-medium mb-2">
                الموظف / المالك <span className="text-danger">*</span>
              </label>
              <select
                id="emp-select"
                className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                value={formData.emp_id}
                onChange={(e) => setFormData({ ...formData, emp_id: e.target.value })}
                required
              >
                <option value="">اختر موظف أو مالك</option>
                {loadingEmployees && <option disabled>جاري التحميل...</option>}
                {!loadingEmployees && employees.length === 0 && (
                  <option disabled>لا يوجد موظفين</option>
                )}
                {!loadingEmployees &&
                  employees.map((emp) => (
                    <option key={emp.emp_id} value={emp.emp_id}>
                      {emp.emp_name} - {emp.field}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-default-500 mt-1">
                اختر الموظف أو المالك الذي سيحصل على السحب
              </p>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount-input" className="block text-sm font-medium mb-2">
                المبلغ (دج) <span className="text-danger">*</span>
              </label>
              <input
                id="amount-input"
                type="number"
                step="0.01"
                min="0.01"
                className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date-input" className="block text-sm font-medium mb-2">
                التاريخ <span className="text-danger">*</span>
              </label>
              <input
                id="date-input"
                type="date"
                className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes-input" className="block text-sm font-medium mb-2">
                ملاحظات (اختياري)
              </label>
              <input
                id="notes-input"
                type="text"
                className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="ملاحظات إضافية..."
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" color="default" onPress={handleClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={submitting}
              isDisabled={submitting || !salonId}
            >
              {submitting ? "جاري الحفظ..." : "حفظ السحب"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
