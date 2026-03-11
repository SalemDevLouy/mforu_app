"use client";
import React from "react";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { toFixed2 } from "@/lib/math";
import { ClientData, ServiceFormData } from "../types";

interface ClientInfoCardProps {
  formData: ServiceFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchingClient: boolean;
  clientData: ClientData | null;
}

export default function ClientInfoCard({
  formData,
  handleChange,
  handlePhoneChange,
  searchingClient,
  clientData,
}: Readonly<ClientInfoCardProps>) {
  let phoneEndContent: React.ReactNode = null;
  if (searchingClient) {
    phoneEndContent = <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />;
  } else if (clientData?.found) {
    phoneEndContent = <span className="text-success text-base">✓</span>;
  }
  return (
    <Card className="shadow-none border border-default-200">
      <div className="p-3 sm:p-4 space-y-3">
        {/* Section label */}
        <div className="flex items-center gap-2">
          <span className="text-base">👤</span>
          <h2 className="text-sm font-semibold text-default-700">معلومات العميل</h2>
        </div>

        {/* Name + Phone row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="اسم العميل"
            name="clientName"
            size="sm"
            variant="bordered"
            isRequired
            value={formData.clientName}
            onChange={handleChange}
            placeholder="أدخل اسم العميل"
          />
          <Input
            label="رقم الهاتف"
            name="clientPhone"
            type="tel"
            size="sm"
            variant="bordered"
            value={formData.clientPhone}
            onChange={handlePhoneChange}
            placeholder="0551234567"
            maxLength={10}
            endContent={phoneEndContent}
          />
        </div>

        {/* Client info banner */}
        {clientData?.found && clientData.client && (
          <div className="rounded-xl border border-default-200 bg-default-50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-success">
                ✓ عميل موجود — {clientData.client.name}
              </span>
              {clientData.totalDebt > 0 ? (
                <Chip size="sm" color="danger" variant="flat">
                  دين: {toFixed2(clientData.totalDebt)} دج
                </Chip>
              ) : (
                <Chip size="sm" color="success" variant="flat">لا ديون</Chip>
              )}
            </div>

            {/* Debt detail */}
            {clientData.totalDebt > 0 && clientData.debts.length > 0 && (
              <div className="text-xs text-danger space-y-0.5">
                {clientData.debts.map((debt, i) => (
                  <div key={debt.debt_id} className="flex justify-between">
                    <span>دين {i + 1} · {new Date(debt.date_reg).toLocaleDateString("ar-DZ")}</span>
                    <span className="font-semibold">{toFixed2(debt.amount)} دج</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reservations */}
            {clientData.hasReservation && clientData.reservations.length > 0 && (
              <div className="text-xs text-primary space-y-0.5">
                <span className="font-semibold">📅 حجوزات نشطة:</span>
                {clientData.reservations.map((r) => (
                  <div key={r.reservation_id} className="flex justify-between">
                    <span>{new Date(r.date).toLocaleDateString("ar-DZ")}</span>
                    <div className="flex gap-2">
                      {r.deposit > 0 && <span>عربون: {toFixed2(r.deposit)} دج</span>}
                      <span>{r.status === "confirmed" ? "مؤكد" : "انتظار"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {clientData.totalDebt > 0 && (
              <p className="text-xs text-warning-700 bg-warning-50 rounded-lg px-2 py-1">
                💡 الفائض عن السعر سيُطبَّق تلقائياً على الديون السابقة
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
