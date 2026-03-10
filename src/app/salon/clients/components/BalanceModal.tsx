import React from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Client, BalanceFormData } from "../types";

interface BalanceModalProps {
  isOpen: boolean;
  client: Client;
  formData: BalanceFormData;
  onChange: (data: BalanceFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function BalanceModal({
  isOpen,
  client,
  formData,
  onChange,
  onSubmit,
  onClose,
}: Readonly<BalanceModalProps>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" dir="rtl">
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            ضبط رصيد - {client.name}
          </ModalHeader>
          <ModalBody>
            <div className="mb-4 p-4 bg-default-100 rounded-lg">
              <p className="text-sm">
                <strong>إجمالي الديون الحالية:</strong>{" "}
                {client.totalDebt?.toLocaleString() || 0} دينار
              </p>
              <p className="text-sm">
                <strong>عدد الديون:</strong> {client.debtCount || 0}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="balance-type" className="block text-sm font-medium mb-2">
                  نوع العملية *
                </label>
                <select
                  id="balance-type"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.type}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      type: e.target.value as "debit" | "credit",
                    })
                  }
                  required
                >
                  <option value="credit">دفعة (تقليل الدين)</option>
                  <option value="debit">دين جديد (زيادة الدين)</option>
                </select>
                <p className="text-xs text-default-500 mt-1">
                  {formData.type === "credit"
                    ? "سيتم استخدام المبلغ لسداد أقدم الديون تلقائياً"
                    : "سيتم إضافة دين جديد بالمبلغ المحدد"}
                </p>
              </div>

              <div>
                <label htmlFor="balance-amount" className="block text-sm font-medium mb-2">
                  المبلغ *
                </label>
                <input
                  id="balance-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.amount}
                  onChange={(e) => onChange({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              {formData.type === "debit" && (
                <div>
                  <label htmlFor="balance-exp-date" className="block text-sm font-medium mb-2">
                    تاريخ الاستحقاق (اختياري)
                  </label>
                  <input
                    id="balance-exp-date"
                    type="date"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.date_exp}
                    onChange={(e) =>
                      onChange({ ...formData, date_exp: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={onClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              color={formData.type === "credit" ? "success" : "warning"}
            >
              {formData.type === "credit" ? "تسجيل الدفعة" : "إضافة الدين"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
