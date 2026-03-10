import React from "react";
import { Button } from "@heroui/button";
import { Client, ClientFormData } from "../types";

interface ClientFormModalProps {
  isOpen: boolean;
  editingClient: Client | null;
  formData: ClientFormData;
  onChange: (data: ClientFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function ClientFormModal({
  isOpen,
  editingClient,
  formData,
  onChange,
  onSubmit,
  onClose,
}: Readonly<ClientFormModalProps>) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">
              {editingClient ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
            </h2>
            <button
              onClick={onClose}
              className="text-default-400 hover:text-default-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  الاسم <span className="text-danger">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  autoFocus
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.name}
                  onChange={(e) => onChange({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.phone ?? ""}
                  onChange={(e) => onChange({ ...formData, phone: e.target.value })}
                  placeholder="05xxxxxxxx"
                />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                الملاحظات
              </label>
              <textarea
                id="notes"
                className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                value={formData.notes ?? ""}
                onChange={(e) => onChange({ ...formData, notes: e.target.value })}
                placeholder="أي ملاحظات خاصة بالعميل..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-6 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors"
                onClick={onClose}
              >
                إلغاء
              </button>
              <Button type="submit" color="primary" className="px-8">
                {editingClient ? "حفظ التعديلات" : "إضافة عميل"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
