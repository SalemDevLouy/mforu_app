"use client";
import React from "react";
import { Card } from "@heroui/card";
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
}: ClientInfoCardProps) {
  return (
    <Card>
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-medium">معلومات العميل</h2>

        <div className="flex gap-2">
          <label className="flex flex-col">
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل اسم العميل"
              required
            />
          </label>
          <label className="flex flex-col">
            <div className="relative">
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handlePhoneChange}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="0551234567"
                maxLength={10}
              />
              {searchingClient && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* عرض معلومات العميل إذا تم العثور عليه */}
        {clientData?.found && clientData.client && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="font-medium text-blue-900">تم العثور على العميل</span>
            </div>

            {/* عرض الديون السابقة */}
            {clientData.totalDebt > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-red-900 font-medium">⚠️ ديون سابقة:</span>
                  <span className="text-red-700 font-bold">
                    {clientData.totalDebt.toFixed(2)} دج
                  </span>
                </div>
                {clientData.debts.length > 0 && (
                  <div className="mt-2 text-sm text-red-800">
                    <div className="font-medium mb-1">تفاصيل الديون:</div>
                    {clientData.debts.map((debt, index) => (
                      <div key={debt.debt_id} className="flex justify-between">
                        <span>
                          دين {index + 1}:{" "}
                          {new Date(debt.date_reg).toLocaleDateString("ar-DZ")}
                        </span>
                        <span>{debt.amount.toFixed(2)} دج</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* عرض الحجوزات */}
            {clientData.hasReservation &&
              clientData.reservations.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-green-900 font-medium">📅 لديه حجز:</span>
                  </div>
                  <div className="mt-2 text-sm text-green-800">
                    {clientData.reservations.map((reservation) => (
                      <div
                        key={reservation.reservation_id}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {new Date(reservation.date).toLocaleDateString(
                            "ar-DZ",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        <div className="flex gap-3 font-medium">
                          {reservation.deposit > 0 && (
                            <span className="text-blue-700">
                              عربون: {reservation.deposit.toFixed(2)} دج
                            </span>
                          )}
                          <span>
                            {reservation.status === "confirmed"
                              ? "مؤكد"
                              : "قيد الانتظار"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* رسالة إذا لم يكن هناك ديون أو حجوزات */}
            {clientData.totalDebt === 0 && !clientData.hasReservation && (
              <div className="text-sm text-green-700">
                ✓ لا توجد ديون سابقة أو حجوزات
              </div>
            )}

            {/* نصيحة حول الدفع إذا كان هناك دين */}
            {clientData.totalDebt > 0 && (
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>💡 نصيحة:</strong> إذا دفع العميل أكثر من سعر الخدمة
                الحالية، سيتم خصم الفائض من الديون السابقة تلقائياً.
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
