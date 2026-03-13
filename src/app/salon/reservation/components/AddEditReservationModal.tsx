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
  readonly onCreateClient: (data: { name: string; phone: string }) => Promise<Client>;
}

const normalizePhone = (value?: string) => (value || "").replaceAll(" ", "").trim();
const normalizeName = (value?: string) => (value || "").trim().toLowerCase();

function findClientBySearch(clients: Client[], nameValue: string, phoneValue: string) {
  const normalizedName = normalizeName(nameValue);
  const normalizedPhone = normalizePhone(phoneValue);

  const filtered = clients.filter((client) => {
    const phoneMatches = normalizedPhone
      ? normalizePhone(client.phone) === normalizedPhone
      : true;
    const nameMatches = normalizedName
      ? normalizeName(client.name).includes(normalizedName)
      : true;
    return phoneMatches && nameMatches;
  });

  if (filtered.length === 1) return filtered[0];
  return (
    filtered.find((client) => normalizeName(client.name) === normalizedName) ||
    null
  );
}

export function AddEditReservationModal({
  editingReservation,
  salonId,
  clients,
  onClose,
  onAdd,
  onEdit,
  onCreateClient,
}: AddEditReservationModalProps) {
  const [formData, setFormData] = useState<ReservationFormData>(BLANK_RESERVATION_FORM());
  const [clientNameQuery, setClientNameQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const matchedClient = findClientBySearch(clients, clientNameQuery, formData.client_phone);
  const clientExists = Boolean(matchedClient);
  const shouldShowClientStatus =
    Boolean(normalizeName(clientNameQuery)) || Boolean(normalizePhone(formData.client_phone));
  const clientPhoneSuffix = matchedClient?.phone ? " · " + matchedClient.phone : "";
  const clientStatusText = clientExists
    ? `✅ العميل موجود: ${matchedClient?.name || ""}${clientPhoneSuffix}`
    : "❌ العميل غير موجود";

  useEffect(() => {
    if (editingReservation) {
      setFormData({
        client_id: editingReservation.client_id,
        client_phone: editingReservation.client_phone || "",
        date_exploit: new Date(editingReservation.date_exploit).toISOString().slice(0, 10),
        deposit: String(editingReservation.deposit ?? 0),
        status: editingReservation.status,
      });
      setClientNameQuery(editingReservation.client_name || "");
    } else {
      setFormData(BLANK_RESERVATION_FORM());
      setClientNameQuery("");
    }
  }, [editingReservation]);

  const handleClose = () => {
    setFormData(BLANK_RESERVATION_FORM());
    setClientNameQuery("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonId) { alert("لم يتم تحديد الصالون."); return; }
    if (!editingReservation && !normalizeName(clientNameQuery)) {
      alert("اسم العميل مطلوب.");
      return;
    }
    if (!editingReservation && !normalizePhone(formData.client_phone)) {
      alert("رقم هاتف العميل مطلوب.");
      return;
    }

    let resolvedClient = matchedClient;

    if (!editingReservation && !resolvedClient) {
      resolvedClient = await onCreateClient({
        name: clientNameQuery.trim(),
        phone: formData.client_phone.trim(),
      });
    }

    const payload: ReservationFormData = {
      ...formData,
      client_id: resolvedClient?.client_id || formData.client_id,
    };

    try {
      setSubmitting(true);
      if (editingReservation) {
        await onEdit(payload, editingReservation.reservation_id);
        alert("تم تحديث الحجز بنجاح");
      } else {
        await onAdd(payload);
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

  const handleClientNameChange = (value: string) => {
    const foundClient = findClientBySearch(clients, value, formData.client_phone);
    setClientNameQuery(value);
    setFormData((prev) => ({
      ...prev,
      client_id: foundClient?.client_id || "",
      client_phone: foundClient?.phone || prev.client_phone,
    }));
  };

  const handleClientPhoneChange = (value: string) => {
    const foundClient = findClientBySearch(clients, clientNameQuery, value);
    if (foundClient?.name) {
      setClientNameQuery(foundClient.name);
    }
    setFormData((prev) => ({
      ...prev,
      client_phone: value,
      client_id: foundClient?.client_id || "",
    }));
  };

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
          

          {/* Client Phone */}
          <div>
            <label htmlFor="client-phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              📞 رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <input
              id="client-phone"
              type="tel"
              className="w-full px-3 py-2.5 border text-right border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition"
              value={formData.client_phone}
              onChange={(e) => handleClientPhoneChange(e.target.value)}
              placeholder="مثال: 0550123456"
              required={!isEdit}
            />
            {shouldShowClientStatus ? (
              <p className={`mt-1.5 text-xs ${clientExists ? "text-green-600" : "text-red-500"}`}>
                {clientStatusText}
              </p>
            ) : null}
            {!clientExists && !isEdit ? <p className="mt-1 text-xs text-amber-600">سيتم إنشاء العميل تلقائيًا عند تأكيد الحجز</p> : null}
          </div>

          {/* Client Name Search */}
                    <div>
                      <label htmlFor="client-name-search" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        👤 اسم العميل <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="client-name-search"
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition"
                        value={clientNameQuery}
                        onChange={(e) => handleClientNameChange(e.target.value)}
                        placeholder="ابحث بالاسم"
                        required={!isEdit}
                      />
                    </div>
          {/* Date + Deposit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="res-date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                🗓 موعد الحجز <span className="text-red-500">*</span>
              </label>
              <input
                id="res-date"
                type="date"
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
