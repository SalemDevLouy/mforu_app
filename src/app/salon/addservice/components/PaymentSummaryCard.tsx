"use client";
import React from "react";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { toFixed2 } from "@/lib/math";
import { ServiceFormData } from "../types";
import { HiBanknotes } from "react-icons/hi2";

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
}: Readonly<PaymentSummaryCardProps>) {
  const total = getTotalPrice();
  const remaining = getRemainingAmount();

  let remainingColor: "success" | "danger" | "warning";
  if (remaining > 0) remainingColor = "danger";
  else if (remaining < 0) remainingColor = "warning";
  else remainingColor = "success";

  let remainingLabel: string;
  if (remaining > 0) remainingLabel = `${toFixed2(remaining)} دج — دين على العميل`;
  else if (remaining < 0) remainingLabel = `${toFixed2(Math.abs(remaining))} دج — الصالون مدين بالفكة`;
  else remainingLabel = "دفع كامل ✓";

  return (
    <Card className="shadow-none border border-default-200">
      <div className="p-3 sm:p-4 space-y-3">
        {/* Section label */}
        <div className="flex items-center gap-2">
          <HiBanknotes className="text-base text-default-500" />
          <h2 className="text-sm font-semibold text-default-700">الدفع</h2>
        </div>

        {/* Summary row */}
        <div className="flex items-center justify-between px-3 py-2 bg-default-50 rounded-xl border border-default-200">
          <span className="text-xs text-default-500">الإجمالي</span>
          <span className="text-lg font-bold text-default-800">{toFixed2(total)} دج</span>
        </div>

        {/* Paid amount input */}
        <Input
          label="المبلغ المدفوع"
          name="paidAmount"
          type="number"
          size="sm"
          variant="bordered"
          isRequired
          value={formData.paidAmount}
          onChange={handleChange}
          placeholder="0.00"
          step="5"
          min="0"
          endContent={<span className="text-default-400 text-xs">دج</span>}
        />

        {/* Remaining status */}
        {formData.paidAmount !== "" && (
          <Chip
            color={remainingColor}
            variant="flat"
            className="w-full justify-start h-auto py-1.5 px-3 text-xs"
          >
            {remainingLabel}
          </Chip>
        )}

        <Divider />

        {/* Notes */}
        <Input
          label="ملاحظات (اختياري)"
          name="notes"
          size="sm"
          variant="bordered"
          value={formData.notes}
          onChange={handleChange}
          placeholder="أي ملاحظات..."
        />

      
      </div>
    </Card>
  );
}
