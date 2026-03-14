"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Constant, Salon } from "../../../constants/types";
import {
  CONSTANT_TYPES,
  REPETATION_OPTIONS,
  COLOR_ACTIVE,
  REP_ACTIVE,
  ConstantFormData,
} from "../../../constants/data";
import { HiArrowPath, HiBanknotes, HiCalendarDays, HiCheckCircle, HiClipboardDocumentList, HiCog6Tooth, HiPencilSquare, HiTag, HiBuildingStorefront } from "react-icons/hi2";

interface AddConstantModalProps {
  isOpen:          boolean;
  onClose:         () => void;
  onSubmit:        (e: React.FormEvent) => void;
  salons:          Salon[];
  editingConstant: Constant | null;
  formData:        ConstantFormData;
  setFormData:     (data: ConstantFormData) => void;
  submitting:      boolean;
}

export default function AddConstantModal({
  isOpen,
  onClose,
  onSubmit,
  salons,
  editingConstant,
  formData,
  setFormData,
  submitting,
}: Readonly<AddConstantModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="relative z-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg my-4 overflow-hidden">

        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b border-gray-100 ${editingConstant ? "bg-amber-50" : "bg-blue-50"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${editingConstant ? "bg-amber-100" : "bg-blue-100"}`}>
              {editingConstant ? <HiPencilSquare className="text-amber-700" /> : <HiClipboardDocumentList className="text-blue-700" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                {editingConstant ? "تعديل الثابت" : "إضافة ثابت جديد"}
              </h2>
              <p className="text-xs text-gray-500">
                {editingConstant ? "تعديل بيانات الثابت" : "إيجار، راتب، فاتورة دورية…"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-white/60 transition-colors text-xl leading-none"
          >×</button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">

          {/* Salon */}
          <div>
            <label htmlFor="modal-salon" className="block text-sm font-semibold text-gray-700 mb-1.5">
              <span className="inline-flex items-center gap-1"><HiBuildingStorefront className="text-gray-500" /> الصالون <span className="text-red-500">*</span></span>
            </label>
            <select
              id="modal-salon"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              value={formData.salon_id}
              onChange={(e) => setFormData({ ...formData, salon_id: e.target.value })}
              required
            >
              <option value="">— اختر الصالون —</option>
              {salons.map((s) => (
                <option key={s.salon_id} value={s.salon_id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Type grid */}
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="inline-flex items-center gap-1"><HiTag className="text-gray-500" /> نوع الثابت <span className="text-red-500">*</span></span>
            </span>
            <div className="grid grid-cols-5 gap-2">
              {CONSTANT_TYPES.map((t) => {
                const isActive = formData.const_name === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, const_name: t.value })}
                    title={t.value}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border-2 transition-all text-center ${
                      isActive
                        ? COLOR_ACTIVE[t.color]
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    <t.icon className="text-xl" />
                    <span className="text-[10px] leading-tight">{t.value}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="أو اكتب اسماً مخصصاً…"
              value={CONSTANT_TYPES.some((t) => t.value === formData.const_name) ? "" : formData.const_name}
              onChange={(e) => { if (e.target.value) setFormData({ ...formData, const_name: e.target.value }); }}
            />
          </div>

          {/* Value + Start date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="c-val" className="block text-sm font-semibold text-gray-700 mb-1.5">
                <span className="inline-flex items-center gap-1"><HiBanknotes className="text-gray-500" /> القيمة (دج) <span className="text-red-500">*</span></span>
              </label>
              <input
                id="c-val"
                type="number"
                step="0.01"
                min="0.01"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={formData.const_value}
                onChange={(e) => setFormData({ ...formData, const_value: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label htmlFor="c-date" className="block text-sm font-semibold text-gray-700 mb-1.5">
                <span className="inline-flex items-center gap-1"><HiCalendarDays className="text-gray-500" /> تاريخ البدء <span className="text-red-500">*</span></span>
              </label>
              <input
                id="c-date"
                type="date"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={formData.started_at}
                onChange={(e) => setFormData({ ...formData, started_at: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Repetation */}
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-1.5">
              <span className="inline-flex items-center gap-1"><HiArrowPath className="text-gray-500" /> التكرار <span className="text-red-500">*</span></span>
            </span>
            <div className="grid grid-cols-5 gap-2">
              {REPETATION_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, repetation: r.value })}
                  className={`py-2 rounded-xl border-2 text-xs font-medium transition-all text-center ${
                    formData.repetation === r.value
                      ? REP_ACTIVE[r.value]
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-500"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-1.5"><span className="inline-flex items-center gap-1"><HiCog6Tooth className="text-gray-500" /> الحالة</span></span>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value:    "active",
                  label:    "نشط",
                  icon: HiCheckCircle,
                  active:   "border-green-400 bg-green-50 text-green-700 ring-2 ring-green-300 ring-offset-1",
                  inactive: "border-gray-200 bg-white hover:bg-green-50 text-gray-500",
                },
                {
                  value:    "inactive",
                  label:    "غير نشط",
                  icon: undefined,
                  active:   "border-gray-400 bg-gray-100 text-gray-700 ring-2 ring-gray-300 ring-offset-1",
                  inactive: "border-gray-200 bg-white hover:bg-gray-50 text-gray-500",
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
                  <span className="inline-flex items-center gap-1">{s.icon ? <s.icon /> : null}{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors mt-3"
              onClick={onClose}
            >إلغاء</button>
            <Button
              type="submit"
              color="primary"
              isLoading={submitting}
              className="px-8 rounded-xl font-semibold mt-3"
              isDisabled={!formData.salon_id || !formData.const_name || !formData.const_value}
            >
              {editingConstant ? "حفظ التعديلات" : "إضافة الثابت"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
