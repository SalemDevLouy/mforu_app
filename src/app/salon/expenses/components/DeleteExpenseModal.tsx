"use client";
import { Button } from "@heroui/button";

interface DeleteExpenseModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export function DeleteExpenseModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteExpenseModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-hidden="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">
            🗑
          </div>
          <div>
            <h2 className="font-bold text-gray-800">حذف المصروف</h2>
            <p className="text-xs text-gray-500">هذا الإجراء لا يمكن التراجع عنه</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-5">هل أنت متأكد من حذف هذا المصروف؟</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
              onClick={onClose}
            >
              إلغاء
            </button>
            <Button color="danger" className="px-6 rounded-xl" onPress={onConfirm}>
              حذف
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
