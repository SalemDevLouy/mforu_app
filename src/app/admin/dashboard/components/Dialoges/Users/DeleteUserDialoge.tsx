"use client";

import React from "react";
import { Button } from "@heroui/button";

interface DeleteUserDialogeProps {
  readonly isOpen: boolean;
  readonly userName: string;
  readonly isDeleting: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export default function DeleteUserDialoge({
  isOpen,
  userName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteUserDialogeProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-black/50 cursor-default"
        onClick={() => { if (!isDeleting) onCancel(); }}
        tabIndex={-1}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-default-100 rounded-2xl shadow-2xl p-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-danger/10 mx-auto mb-4">
          <span className="text-2xl text-danger">🗑️</span>
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-center mb-2">تأكيد الحذف</h2>
        <p className="text-center text-default-500 mb-6">
          هل أنت متأكد من حذف المستخدم{" "}
          <span className="font-semibold text-default-800">&quot;{userName}&quot;</span>؟
          <br />
          <span className="text-sm text-danger">لا يمكن التراجع عن هذا الإجراء.</span>
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            className="px-6 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors"
            onClick={onCancel}
            disabled={isDeleting}
          >
            إلغاء
          </button>
          <Button
            color="danger"
            className="px-6"
            isLoading={isDeleting}
            onPress={onConfirm}
          >
            حذف المستخدم
          </Button>
        </div>
      </div>
    </div>
  );
}
