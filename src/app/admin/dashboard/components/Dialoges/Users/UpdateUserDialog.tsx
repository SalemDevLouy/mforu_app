"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Role, Salon } from "../../../users/types";
import { FormData } from "./AddUsersDialog";

interface UpdateUserDialogProps {
  readonly isOpen: boolean;
  readonly isSubmitting: boolean;
  readonly error: string | null;
  readonly formData: FormData;
  readonly roles: Role[];
  readonly salons: Salon[];
  readonly isAdminRole: (roleId: string) => boolean;
  readonly onFormChange: (formData: FormData) => void;
  readonly onSubmit: (e: React.FormEvent) => void;
  readonly onClose: () => void;
  readonly onReset: () => void;
}

export default function UpdateUserDialog({
  isOpen,
  isSubmitting,
  error,
  formData,
  roles,
  salons,
  isAdminRole,
  onFormChange,
  onSubmit,
  onClose,
  onReset,
}: UpdateUserDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-black/50 cursor-default"
        onClick={() => { if (!isSubmitting) onClose(); }}
        tabIndex={-1}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-default-100 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Dialog Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-default-200">
          <div>
            <h2 className="text-xl font-bold">تعديل المستخدم</h2>
            <p className="text-sm text-default-500 mt-0.5">تعديل بيانات المستخدم</p>
          </div>
          <button
            onClick={() => { if (!isSubmitting) onClose(); }}
            disabled={isSubmitting}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-default-200 transition-colors text-default-500 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">
            {error && (
              <div className="p-3 bg-danger/10 border border-danger rounded-lg text-danger text-sm">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-default-600 uppercase tracking-wide border-b pb-2">
                المعلومات الشخصية
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="u-name" className="block text-sm font-medium mb-1">
                    الاسم الكامل <span className="text-danger">*</span>
                  </label>
                  <input
                    id="u-name"
                    type="text"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.name}
                    onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="u-phone" className="block text-sm font-medium mb-1">
                    رقم الهاتف <span className="text-danger">*</span>
                  </label>
                  <input
                    id="u-phone"
                    type="tel"
                    pattern="\d{10}"
                    placeholder="05XXXXXXXX"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.phone}
                    onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-default-600 uppercase tracking-wide border-b pb-2">
                معلومات الحساب
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="u-password" className="block text-sm font-medium mb-1">
                    كلمة المرور{" "}
                    <span className="text-xs text-default-500">(اتركه فارغاً لعدم التغيير)</span>
                  </label>
                  <input
                    id="u-password"
                    type="password"
                    minLength={6}
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.password}
                    onChange={(e) => onFormChange({ ...formData, password: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="u-status" className="block text-sm font-medium mb-1">
                    الحالة <span className="text-danger">*</span>
                  </label>
                  <select
                    id="u-status"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.status}
                    onChange={(e) => onFormChange({ ...formData, status: e.target.value })}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="ACTIVE">نشط</option>
                    <option value="INACTIVE">معطل</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Role & Salon */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-default-600 uppercase tracking-wide border-b pb-2">
                معلومات الدور والصالون
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="u-role" className="block text-sm font-medium mb-1">
                    الدور <span className="text-danger">*</span>
                  </label>
                  <select
                    id="u-role"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.role_id}
                    onChange={(e) =>
                      onFormChange({
                        ...formData,
                        role_id: e.target.value,
                        salon_id: isAdminRole(e.target.value) ? "" : formData.salon_id,
                      })
                    }
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">اختر الدور</option>
                    {roles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="u-salon" className="block text-sm font-medium mb-1">
                    الصالون {!isAdminRole(formData.role_id) && <span className="text-danger">*</span>}
                  </label>
                  <select
                    id="u-salon"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    value={formData.salon_id}
                    onChange={(e) => onFormChange({ ...formData, salon_id: e.target.value })}
                    required={!isAdminRole(formData.role_id)}
                    disabled={isAdminRole(formData.role_id) || isSubmitting}
                  >
                    <option value="">
                      {isAdminRole(formData.role_id) ? "لا يوجد" : "اختر الصالون"}
                    </option>
                    {salons.map((salon) => (
                      <option key={salon.salon_id} value={salon.salon_id}>
                        {salon.site}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-default-200">
            <button
              type="button"
              className="px-5 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors text-sm"
              onClick={onReset}
              disabled={isSubmitting}
            >
              إعادة تعيين
            </button>
            <button
              type="button"
              className="px-5 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors text-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <Button type="submit" color="primary" className="px-7" isLoading={isSubmitting}>
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
