"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Reservation, ReservationFormData, Client } from "../types";
import {
  RESERVATION_STATUSES,
  STATUS_ACTIVE,
  STATUS_INACTIVE,
  BLANK_RESERVATION_FORM,
} from "../constants";

interface AddEditReservationModalProps {
  readonly editingReservation: Reservation | null;
  readonly salonId: string;
  readonly clients: Client[];
  readonly onClose: () => void;
  readonly onAdd: (data: ReservationFormData) => Promise<void>;
  readonly onEdit: (data: ReservationFormData, reservationId: string) => Promise<void>;
  readonly onOpenAddClient: () => void;
}

export function AddEditReservationModal({
  editingReservation,
  salonId,
  clients,
  onClose,
  onAdd,
  onEdit,
  onOpenAddClient,
}: AddEditReservationModalProps) {
  const [formData, setFormData] = useState<ReservationFormData>(BLANK_RESERVATION_FORM());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingReservation) {
      setFormData({
        client_id: editingReservation.client_id,
        date_exploit: new Date(editingReservation.date_exploit).toISOString().slice(0, 16),
        deposit: String(editingReservation.deposit ?? 0),
        status: editingReservation.status,
      });
    } else {
      setFormData(BLANK_RESERVATION_FORM());
    }
  }, [editingReservation]);

  const handleClose = () => {
    setFormData(BLANK_RESERVATION_FORM());
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonId) { alert("لم يتم تحديد الصالون."); return; }
    try {
      setSubmitting(true);
      if (editingReservation) {
        await onEdit(formData, editingReservation.reservation_id);
        alert("تم تحديث الحجز بنجاح");
      } else {
        await onAdd(formData);
        alert("تم إضافة الحجز بنجاح");
      }
      handleClose();
    } catch {
      alert("فشل حفظ البيانات");
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = !!editingReservation;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-hidden="true"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") handleClose(); }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 ${isEdit ? "bg-amber-50 dark:bg-amber-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${isEdit ? "bg-amber-100" : "bg-blue-100"}`}>
              {isEdit ? "✏️" : "📅"}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-white">
                {isEdit ? "تعديل الحجز" : "حجز جديد"}
              </h2>
              <p className="text-xs text-gray-500">
                {isEdit ? "تعديل بيانات الحجز" : "تسجيل موعد لعميل"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-white/60 transition-colors text-xl leading-none"
          >×</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Client */}
          <div>
            <label htmlFor="client-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              👤 العميل <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                id="client-select"
                className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition"
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                required
              >
                <option value="">— اختر عميل —</option>
                {clients.map((c) => (
                  <option key={c.client_id} value={c.client_id}>
                    {c.name}{c.phone ? ` · ${c.phone}` : ""}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onOpenAddClient}
                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl transition-colors text-sm whitespace-nowrap border border-blue-200"
              >+ جديد</button>
            </div>
          </div>

          {/* Date + Deposit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="res-date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                🗓 موعد الحجز <span className="text-red-500">*</span>
              </label>
              <input
                id="res-date"
                type="datetime-local"
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition"
                value={formData.date_exploit}
                onChange={(e) => setFormData({ ...formData, date_exploit: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="res-deposit" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                💵 العربون (دج)
              </label>
              <input
                id="res-deposit"
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">🏷 الحالة</span>
            <div className="grid grid-cols-2 gap-2">
              {RESERVATION_STATUSES.map((s) => {
                const isActive = formData.status === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s.value })}
                    className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all text-center ${isActive ? STATUS_ACTIVE[s.color] : STATUS_INACTIVE[s.color]}`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-1 border-t border-gray-100 dark:border-zinc-800 mt-2">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors mt-4"
              onClick={handleClose}
            >إلغاء</button>
            <Button
              type="submit"
              color="primary"
              className="px-8 rounded-xl font-semibold mt-4"
              isLoading={submitting}
            >
              {isEdit ? "💾 حفظ التعديلات" : "✅ تأكيد الحجز"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
