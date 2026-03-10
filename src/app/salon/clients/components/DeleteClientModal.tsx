import React from "react";
import { Button } from "@heroui/button";

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteClientModal({
  isOpen,
  onClose,
  onConfirm,
}: Readonly<DeleteClientModalProps>) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-xl font-semibold mb-2">تأكيد الحذف</h2>
        <p className="text-default-500 mb-6">
          هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-5 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors"
            onClick={onClose}
          >
            إلغاء
          </button>
          <Button color="danger" onPress={onConfirm}>
            حذف
          </Button>
        </div>
      </div>
    </div>
  );
}
