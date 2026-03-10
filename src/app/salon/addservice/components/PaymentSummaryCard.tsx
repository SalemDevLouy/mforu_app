"use client";
import React from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { ServiceFormData } from "../types";

interface PaymentSummaryCardProps {
  formData: ServiceFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  getTotalPrice: () => number;
  getRemainingAmount: () => number;
  onReset: () => void;
  submitting: boolean;
}

export default function PaymentSummaryCard({
  formData,
  handleChange,
  getTotalPrice,
  getRemainingAmount,
  onReset,
  submitting,
}: PaymentSummaryCardProps) {
  const remaining = getRemainingAmount();

  const remainingLabel =
    remaining > 0
      ? `${remaining.toFixed(2)} دج (دين على العميل)`
      : remaining < 0
      ? `${Math.abs(remaining).toFixed(2)} دج (الصالون مدين بالفكة)`
      : `0.00 دج (دفع كامل)`;

  const remainingClass =
    remaining > 0
      ? "bg-red-50 border-red-300 text-red-700"
      : remaining < 0
      ? "bg-amber-50 border-amber-300 text-amber-700"
      : "bg-green-50 border-green-300 text-green-700";

  return (
    <Card>
      {/* Payment Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
        <label className="flex flex-col">
          <span className="text-sm mb-1">الإجمالي</span>
          <input
            type="text"
            value={`${getTotalPrice().toFixed(2)} دج`}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 font-bold"
            readOnly
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm mb-1">المبلغ المدفوع *</span>
          <input
            type="number"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handleChange}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="5"
            min="0"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm mb-1">الباقي</span>
          <input
            type="text"
            value={remainingLabel}
            className={`px-3 py-2 rounded-lg border font-bold ${remainingClass}`}
            readOnly
          />
        </label>
      </div>

      <div className="p-4 space-y-4">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          >
            إعادة تعيين
          </button>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? "جاري التسجيل..." : "تسجيل الخدمة"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
