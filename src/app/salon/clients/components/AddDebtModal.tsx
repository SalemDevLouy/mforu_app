import React from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { DebtFormData } from "../types";

interface AddDebtModalProps {
  isOpen: boolean;
  formData: DebtFormData;
  onChange: (data: DebtFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function AddDebtModal({
  isOpen,
  formData,
  onChange,
  onSubmit,
  onClose,
}: Readonly<AddDebtModalProps>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold">إضافة دين جديد</h3>
        </ModalHeader>
        <form onSubmit={onSubmit}>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="debt-amount" className="block text-sm font-medium mb-2">
                  المبلغ <span className="text-danger">*</span>
                </label>
                <input
                  id="debt-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.debt_val}
                  onChange={(e) =>
                    onChange({ ...formData, debt_val: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="debt-exp-date" className="block text-sm font-medium mb-2">
                  تاريخ الاستحقاق (اختياري)
                </label>
                <input
                  id="debt-exp-date"
                  type="date"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.date_exp}
                  onChange={(e) =>
                    onChange({ ...formData, date_exp: e.target.value })
                  }
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={onClose}>
              إلغاء
            </Button>
            <Button type="submit" color="primary">
              إضافة
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
