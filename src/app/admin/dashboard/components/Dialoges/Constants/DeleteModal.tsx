"use client";

import React from "react";
import { Button } from "@heroui/button";

interface DeleteModalProps {
  isOpen:    boolean;
  onClose:   () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: Readonly<DeleteModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">🗑</div>
          <div>
            <h2 className="font-bold text-gray-800">حذف الثابت</h2>
            <p className="text-xs text-gray-500">هذا الإجراء لا يمكن التراجع عنه</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-5">هل أنت متأكد من حذف هذا الثابت؟</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
              onClick={onClose}
            >إلغاء</button>
            <Button color="danger" className="px-6 rounded-xl" onPress={onConfirm}>حذف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
