"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";

interface AddSalonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM = {
  name: "",
  site: "",
  ownerName: "",
  ownerPhone: "",
  ownerPassword: "",
};

export default function AddSalonDialog({ isOpen, onClose, onSuccess }: Readonly<AddSalonDialogProps>) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/salons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create salon");
      }

      setFormData(EMPTY_FORM);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء إضافة الصالون");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setFormData(EMPTY_FORM);
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-default-100 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-default-200">
          <div>
            <h2 className="text-xl font-bold">إضافة صالون جديد</h2>
            <p className="text-sm text-default-500 mt-0.5">أدخل بيانات الصالون والمالك</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-default-200 transition-colors text-default-500 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">
            {/* Salon Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-default-600 uppercase tracking-wide border-b pb-2">
                معلومات الصالون
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="d-name" className="block text-sm font-medium mb-1">
                    اسم الصالون <span className="text-danger">*</span>
                  </label>
                  <input
                    id="d-name"
                    type="text"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="d-site" className="block text-sm font-medium mb-1">
                    الموقع <span className="text-danger">*</span>
                  </label>
                  <input
                    id="d-site"
                    type="text"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    value={formData.site}
                    onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="مثال: الجزائر - باب الوادي"
                  />
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-default-600 uppercase tracking-wide border-b pb-2">
                بيانات المالك
              </h3>
              <div>
                <label htmlFor="d-ownerName" className="block text-sm font-medium mb-1">
                  اسم المالك <span className="text-danger">*</span>
                </label>
                <input
                  id="d-ownerName"
                  type="text"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="d-ownerPhone" className="block text-sm font-medium mb-1">
                    رقم الهاتف <span className="text-danger">*</span>
                  </label>
                  <input
                    id="d-ownerPhone"
                    type="tel"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="05xxxxxxxx"
                    pattern="[0-9]{10}"
                  />
                </div>
                <div>
                  <label htmlFor="d-ownerPassword" className="block text-sm font-medium mb-1">
                    كلمة المرور <span className="text-danger">*</span>
                  </label>
                  <input
                    id="d-ownerPassword"
                    type="password"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    value={formData.ownerPassword}
                    onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                    required
                    disabled={loading}
                    minLength={6}
                    placeholder="الحد الأدنى 6 أحرف"
                  />
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-default-600 space-y-1">
              <p className="font-semibold text-primary mb-1">ملاحظة</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>سيتم إنشاء حساب المالك تلقائياً برقم الهاتف وكلمة المرور</li>
                <li>كلمة المرور 6 أحرف على الأقل</li>
                <li>رقم الهاتف يجب أن يكون 10 أرقام</li>
              </ul>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-default-200 bg-default-50 dark:bg-default-100 rounded-b-2xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2 text-sm border border-default-300 rounded-lg hover:bg-default-100 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <Button
              type="submit"
              color="primary"
              className="px-6 text-sm"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? "جاري الإضافة..." : "إضافة الصالون"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
