"use client";

import React, { useState } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    // Salon Information
    name: "",
    site: "",
    ownerName: "",
    ownerPhone: "",
    ownerPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/salons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          site: formData.site,
          ownerName: formData.ownerName,
          ownerPhone: formData.ownerPhone,
          ownerPassword: formData.ownerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create salon");
      }

      alert("تم إضافة الصالون وحساب المالك بنجاح!");
      router.push("/admin/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ أثناء إضافة الصالون";
      setError(errorMessage);
      console.error("Error creating salon:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      site: "",
      ownerName: "",
      ownerPhone: "",
      ownerPassword: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="text-default-500 hover:text-default-900"
          >
            ← العودة
          </button>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">إضافة صالون جديد</h1>
        <p className="text-default-500">قم بتسجيل صالون جديد في النظام</p>
      </div>

      {/* Form */}
      <Card className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Salon Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-default-700 border-b pb-2">
              معلومات الصالون
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  اسم الصالون <span className="text-danger">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="site" className="block text-sm font-medium mb-2">
                  الموقع <span className="text-danger">*</span>
                </label>
                <input
                  id="site"
                  type="text"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.site}
                  onChange={(e) =>
                    setFormData({ ...formData, site: e.target.value })
                  }
                  required
                  placeholder="مثال: القاهرة - مدينة نصر"
                />
              </div>
            </div>
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium mb-2">
                اسم المالك <span className="text-danger">*</span>
              </label>
              <input
                id="ownerName"
                type="text"
                className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerName: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ownerPhone" className="block text-sm font-medium mb-2">
                  رقم هاتف المالك <span className="text-danger">*</span>
                </label>
                <input
                  id="ownerPhone"
                  type="tel"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPhone: e.target.value })
                  }
                  required
                  placeholder="05xxxxxxxx"
                  pattern="[0-9]{10}"
                />
              </div>
              <div>
                <label htmlFor="ownerPassword" className="block text-sm font-medium mb-2">
                  كلمة مرور المالك <span className="text-danger">*</span>
                </label>
                <input
                  id="ownerPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.ownerPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  placeholder="الحد الأدنى 6 أحرف"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              className="px-6 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors"
              onClick={handleReset}
            >
              إعادة تعيين
            </button>
            <button
              type="button"
              className="px-6 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors"
              onClick={() => router.push("/admin/dashboard/salons")}
              disabled={loading}
            >
              إلغاء
            </button>
            <Button 
              type="submit" 
              color="primary" 
              className="px-8"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? "جاري الإضافة..." : "إضافة الصالون"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Info Card */}
      <Card className="p-4 md:p-6 bg-primary/5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="font-semibold mb-2">ملاحظة هامة</h3>
            <ul className="text-sm text-default-600 space-y-1 list-disc list-inside">
              <li>جميع الحقول المميزة بـ <span className="text-danger">*</span> مطلوبة</li>
              <li>تأكد من صحة البيانات المدخلة قبل الحفظ</li>
              <li>سيتم إنشاء حساب مالك الصالون تلقائياً برقم الهاتف وكلمة المرور</li>
              <li>كلمة المرور يجب أن تكون 6 أحرف على الأقل</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
