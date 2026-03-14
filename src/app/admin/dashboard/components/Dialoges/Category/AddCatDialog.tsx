"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { HiXMark } from "react-icons/hi2";

interface AddCatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCatDialog({ isOpen, onClose, onSuccess }: Readonly<AddCatDialogProps>) {
  const [catName, setCatName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setCatName("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: catName.trim() }),
      });
      const data = await res.json();
      if (data.status === 400) { alert(data.message); return; }
      setCatName("");
      onSuccess();
      onClose();
    } catch {
      alert("فشل في إضافة الفئة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-black/50 cursor-default"
        onClick={handleClose}
        tabIndex={-1}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-default-100 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-default-200">
          <div>
            <h2 className="text-lg font-bold">إضافة فئة جديدة</h2>
            <p className="text-xs text-default-500 mt-0.5">أدخل اسم الفئة الجديدة</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-default-200 transition-colors text-default-500 text-lg"
          >
            <HiXMark />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="d-cat-name" className="block text-sm font-medium mb-1">
              اسم الفئة <span className="text-danger">*</span>
            </label>
            <input
              id="d-cat-name"
              autoFocus
              type="text"
              className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="مثال: قص شعر، صبغة..."
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="px-4 py-2 text-sm border border-default-300 rounded-lg hover:bg-default-100 transition-colors"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <Button type="submit" color="primary" size="sm" isLoading={isSubmitting} className="px-6">
              إضافة
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
