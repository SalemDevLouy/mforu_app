"use client";

import React from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

interface DeleteWithdrawalModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export function DeleteWithdrawalModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteWithdrawalModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} dir="rtl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">تأكيد الحذف</ModalHeader>
        <ModalBody>
          <p>هل أنت متأكد من حذف هذا السحب؟</p>
          <p className="text-sm text-default-500">
            لا يمكن التراجع عن هذا الإجراء
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onClose}>
            إلغاء
          </Button>
          <Button color="danger" onPress={onConfirm}>
            حذف
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
