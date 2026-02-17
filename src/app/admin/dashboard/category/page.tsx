"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "@heroui/table";

interface Category {
  cat_id: string;
  cat_name: string;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Category form state
  const [formData, setFormData] = useState({
    name: "",
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("فشل في تحميل الفئات");
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (activeTab === "edit" && editingCategory) {
        // Update existing category
        const response = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCategory.cat_id,
            category_name: formData.name,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to update category");
        }

        alert("تم تحديث الفئة بنجاح!");
      } else {
        // Add new category
        const response = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category_name: formData.name,
          }),
        });

        const data = await response.json();
        
        if (data.status === 400) {
          throw new Error(data.message || "Category already exists");
        }

        if (!response.ok) {
          throw new Error("Failed to add category");
        }

        alert("تم إضافة الفئة بنجاح!");
      }
      
      // Refresh categories list
      await fetchCategories();
      
      // Reset form and go back to list
      handleReset();
      setActiveTab("list");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.cat_name,
    });
    setActiveTab("edit");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete category");
      }

      alert("تم حذف الفئة بنجاح!");
      
      // Refresh categories list
      await fetchCategories();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">إدارة الفئات</h1>
        <p className="text-default-500">إضافة وتعديل وحذف فئات الخدمات</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي الفئات</p>
              <p className="text-2xl font-bold text-primary">{categories.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">📂</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">آخر تحديث</p>
              <p className="text-sm font-medium text-default-700">
                {new Date().toLocaleDateString("ar-EG")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-2xl">�</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-default-200">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "list"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => {
            setActiveTab("list");
            handleReset();
          }}
        >
          جميع الفئات
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "add"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => {
            setActiveTab("add");
            handleReset();
          }}
        >
          إضافة فئة
        </button>
        {activeTab === "edit" && (
          <button
            className="px-4 py-2 font-medium border-b-2 border-primary text-primary"
          >
            تعديل فئة
          </button>
        )}
      </div>

      {/* List Categories Tab */}
      {activeTab === "list" && (
        <Card className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">جميع الفئات ({categories.length})</h2>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              onClick={() => setActiveTab("add")}
              disabled={isLoading}
            >
              + إضافة فئة جديدة
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}

          {!isLoading && categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد فئات. قم بإضافة فئة جديدة للبدء.
            </div>
          )}

          {!isLoading && categories.length > 0 && (
            <div className="overflow-x-auto">
              <Table aria-label="جدول الفئات">
                <TableHeader>
                  <TableColumn>اسم الفئة</TableColumn>
                  <TableColumn>الإجراءات</TableColumn>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.cat_id}>
                      <TableCell className="font-medium">{category.cat_name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            className="text-primary hover:text-primary-600 text-sm disabled:opacity-50"
                            onClick={() => handleEdit(category)}
                            disabled={isLoading}
                          >
                            تعديل
                          </button>
                          <button
                            className="text-danger hover:text-danger-600 text-sm disabled:opacity-50"
                            onClick={() => handleDelete(category.cat_id)}
                            disabled={isLoading}
                          >
                            حذف
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      )}

      {/* Add/Edit Category Tab */}
      {(activeTab === "add" || activeTab === "edit") && (
        <Card className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === "add" ? "إضافة فئة جديدة" : "تعديل الفئة"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  اسم الفئة <span className="text-danger">*</span>
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
                  placeholder="مثال: قص الشعر"
                />
              </div>
            </div>

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
                onClick={() => {
                  setActiveTab("list");
                  handleReset();
                }}
              >
                إلغاء
              </button>
              <Button type="submit" color="primary" className="px-8" disabled={isLoading}>
                {isLoading && "جاري الحفظ..."}
                {!isLoading && activeTab === "add" && "إضافة الفئة"}
                {!isLoading && activeTab === "edit" && "حفظ التعديلات"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Info Card */}
      {activeTab === "list" && (
        <Card className="p-4 md:p-6 bg-primary/5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold mb-2">نصائح لإدارة الفئات</h3>
              <ul className="text-sm text-default-600 space-y-1 list-disc list-inside">
                <li>استخدم أسماء واضحة ومختصرة للفئات</li>
                <li>اختر أيقونات مناسبة تعبر عن كل فئة</li>
                <li>يمكنك تعطيل الفئة بدلاً من حذفها للحفاظ على البيانات</li>
                <li>عند حذف فئة، تأكد من نقل الخدمات المرتبطة بها إلى فئة أخرى</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
