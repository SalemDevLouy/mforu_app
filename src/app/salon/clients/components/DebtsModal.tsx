import React from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Client, Debt } from "../types";
import { sum, toFixed2 } from "@/lib/math";

interface DebtsModalProps {
  isOpen: boolean;
  client: Client;
  debts: Debt[];
  onClose: () => void;
  onOpenAddDebt: () => void;
  onMarkPaid: (debtId: string) => void;
  onMarkCreditReturned: (debtId: string) => void;
}

export default function DebtsModal({
  isOpen,
  client,
  debts,
  onClose,
  onOpenAddDebt,
  onMarkPaid,
  onMarkCreditReturned,
}: Readonly<DebtsModalProps>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold">ديون العميل: {client.name}</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Summary + Add debt button */}
            <div className="flex justify-between items-center p-4 bg-default-100 rounded-lg">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-default-500">ديون على العميل</p>
                  <p className="text-xl font-bold text-danger">
                    {toFixed2(sum(debts.filter((d) => d.status === "pending").map((d) => d.amount)))}{" "}
                    دج
                  </p>
                </div>
                <div>
                  <p className="text-xs text-default-500">فكة مستحقة للعميل</p>
                  <p className="text-xl font-bold text-amber-600">
                    {toFixed2(sum(debts.filter((d) => d.status === "credit").map((d) => d.amount)))}{" "}
                    دج
                  </p>
                </div>
              </div>
              <Button color="primary" size="sm" onPress={onOpenAddDebt}>
                إضافة دين يدوي
              </Button>
            </div>

            {/* Pending debts */}
            {debts.some((d) => d.status === "pending") && (
              <div>
                <h4 className="text-sm font-semibold text-danger mb-2">ديون على العميل</h4>
                <div className="space-y-2">
                  {debts
                    .filter((d) => d.status === "pending")
                    .map((debt) => (
                      <div
                        key={debt.debt_id}
                        className="flex justify-between items-center p-3 border border-red-200 bg-red-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-danger">
                            {debt.amount.toFixed(2)} دج
                          </p>
                          <p className="text-xs text-default-500">
                            تسجيل:{" "}
                            {new Date(debt.date_reg).toLocaleDateString("ar-DZ")}
                          </p>
                          {debt.date_exp && (
                            <p className="text-xs text-default-500">
                              استحقاق:{" "}
                              {new Date(debt.date_exp).toLocaleDateString("ar-DZ")}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          color="success"
                          onPress={() => onMarkPaid(debt.debt_id)}
                        >
                          تحديد كمدفوع
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Credit debts */}
            {debts.some((d) => d.status === "credit") && (
              <div>
                <h4 className="text-sm font-semibold text-amber-600 mb-2">
                  فكة مستحقة للعميل (مستحقة على الصالون)
                </h4>
                <div className="space-y-2">
                  {debts
                    .filter((d) => d.status === "credit")
                    .map((debt) => (
                      <div
                        key={debt.debt_id}
                        className="flex justify-between items-center p-3 border border-amber-200 bg-amber-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-amber-700">
                            {debt.amount.toFixed(2)} دج
                          </p>
                          <p className="text-xs text-default-500">
                            تسجيل:{" "}
                            {new Date(debt.date_reg).toLocaleDateString("ar-DZ")}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          color="warning"
                          onPress={() => onMarkCreditReturned(debt.debt_id)}
                        >
                          تأكيد إرجاع الفكة
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Historical */}
            {debts.some(
              (d) => d.status === "paid" || d.status === "credit_returned"
            ) && (
              <div>
                <h4 className="text-sm font-semibold text-default-500 mb-2">
                  مسددة / مرتجعة
                </h4>
                <div className="space-y-2">
                  {debts
                    .filter(
                      (d) => d.status === "paid" || d.status === "credit_returned"
                    )
                    .map((debt) => (
                      <div
                        key={debt.debt_id}
                        className="flex justify-between items-center p-3 border border-default-200 rounded-lg opacity-60"
                      >
                        <div>
                          <p className="font-semibold">{debt.amount.toFixed(2)} دج</p>
                          <p className="text-xs text-default-500">
                            {new Date(debt.date_reg).toLocaleDateString("ar-DZ")}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs bg-success/10 text-success">
                          {debt.status === "paid" ? "مدفوع" : "مرجعت الفكة"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {debts.length === 0 && (
              <p className="text-center text-default-500 py-8">لا توجد سجلات</p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            إغلاق
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
