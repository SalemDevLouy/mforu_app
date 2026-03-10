"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Expense, ExpenseFormData } from "../types";
import { EXPENSE_CATEGORIES, CATEGORY_ACTIVE, BLANK_FORM } from "../constants";

interface AddEditExpenseModalProps {
  readonly editingExpense: Expense | null;
  readonly salonId: string;
  readonly onClose: () => void;
  readonly onAdd: (data: ExpenseFormData) => Promise<void>;
  readonly onEdit: (data: ExpenseFormData, expId: string) => Promise<void>;
}

export function AddEditExpenseModal({
  editingExpense,
  salonId,
  onClose,
  onAdd,
  onEdit,
}: AddEditExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(BLANK_FORM());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        exp_type: editingExpense.exp_type,
        exp_val: editingExpense.exp_val.toString(),
        date: new Date(editingExpense.date).toISOString().split("T")[0],
        status: editingExpense.status,
        description: editingExpense.description || "",
      });
    } else {
      setFormData(BLANK_FORM());
    }
  }, [editingExpense]);

  const handleClose = () => {
    setFormData(BLANK_FORM());
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonId) { alert("لم يتم تحديد الصالون."); return; }
    try {
      setSubmitting(true);
      if (editingExpense) {
        await onEdit(formData, editingExpense.exp_id);
      } else {
        await onAdd(formData);
      }
      handleClose();
    } catch {
      alert("فشل حفظ البيانات");
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = !!editingExpense;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-hidden="true"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") handleClose(); }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b border-gray-100 ${isEdit ? "bg-amber-50" : "bg-red-50"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${isEdit ? "bg-amber-100" : "bg-red-100"}`}>
              {isEdit ? "✏️" : "💸"}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                {isEdit ? "تعديل المصروف" : "تسجيل مصروف جديد"}
              </h2>
              <p className="text-xs text-gray-500">
                {isEdit ? "تعديل بيانات المصروف" : "منتج، مادة، فاتورة، ..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-white/60 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category grid */}
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-2">
              🏷 نوع المصروف <span className="text-red-500">*</span>
            </span>
            <div className="grid grid-cols-5 gap-2">
              {EXPENSE_CATEGORIES.map((cat) => {
                const isActive = formData.exp_type === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, exp_type: cat.value })}
                    title={cat.value}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border-2 transition-all text-center ${
                      isActive
                        ? CATEGORY_ACTIVE[cat.color]
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs leading-tight">{cat.value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="exp-desc" className="block text-sm font-semibold text-gray-700 mb-1.5">
              📝 الوصف / البيان
            </label>
            <input
              id="exp-desc"
              type="text"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="مثال: زيت أرغان 500مل، صبغة شعر، أدوات قص..."
            />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="exp-val" className="block text-sm font-semibold text-gray-700 mb-1.5">
                💰 المبلغ (دج) <span className="text-red-500">*</span>
              </label>
              <input
                id="exp-val"
                type="number"
                step="0.01"
                min="0.01"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition"
                value={formData.exp_val}
                onChange={(e) => setFormData({ ...formData, exp_val: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label htmlFor="exp-date" className="block text-sm font-semibold text-gray-700 mb-1.5">
                📅 التاريخ <span className="text-red-500">*</span>
              </label>
              <input
                id="exp-date"
                type="date"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Status toggle */}
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-1.5">💳 حالة الدفع</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "paid",
                  label: "✅ مدفوع",
                  active: "border-green-400 bg-green-50 text-green-700 ring-2 ring-green-300 ring-offset-1",
                  inactive: "border-gray-200 bg-white hover:bg-green-50 hover:border-green-200 text-gray-500",
                },
                {
                  value: "pending",
                  label: "⏳ معلّق",
                  active: "border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-300 ring-offset-1",
                  inactive: "border-gray-200 bg-white hover:bg-amber-50 hover:border-amber-200 text-gray-500",
                },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s.value })}
                  className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.status === s.value ? s.active : s.inactive
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors mt-3"
              onClick={handleClose}
            >
              إلغاء
            </button>
            <Button
              type="submit"
              color="primary"
              isLoading={submitting}
              className="px-8 rounded-xl font-semibold mt-3"
              isDisabled={!formData.exp_type || !formData.exp_val}
            >
              {isEdit ? "💾 حفظ التعديلات" : "✅ تسجيل المصروف"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
