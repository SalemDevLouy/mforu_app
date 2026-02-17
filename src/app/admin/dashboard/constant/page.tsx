"use client";

import React, { useState } from "react";
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

interface Constant {
  id: number;
  salonId: string;
  salonName: string;
  type: string;
  name: string;
  amount: number;
  frequency: "شهري" | "سنوي" | "مرة واحدة";
  startDate: string;
  endDate?: string;
  notes: string;
  status: "نشط" | "معطل";
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list");
  const [editingConstant, setEditingConstant] = useState<Constant | null>(null);
  const [filterSalon, setFilterSalon] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  
  // Constant form state
  const [formData, setFormData] = useState({
    salonId: "",
    type: "",
    name: "",
    amount: "",
    frequency: "شهري" as "شهري" | "سنوي" | "مرة واحدة",
    startDate: "",
    endDate: "",
    notes: "",
    status: "نشط" as "نشط" | "معطل",
  });

  // Mock salons data
  const salons = [
    { id: "salon-001", name: "صالون الجمال الراقي" },
    { id: "salon-002", name: "صالون النجوم" },
    { id: "salon-003", name: "صالون الأناقة" },
    { id: "salon-004", name: "صالون الفخامة" },
  ];

  // Constant types
  const constantTypes = [
    { value: "rent", label: "إيجار", icon: "🏢" },
    { value: "electricity", label: "كهرباء", icon: "💡" },
    { value: "water", label: "مياه", icon: "💧" },
    { value: "internet", label: "إنترنت", icon: "🌐" },
    { value: "phone", label: "هاتف", icon: "📞" },
    { value: "insurance", label: "تأمين", icon: "🛡️" },
    { value: "license", label: "تراخيص", icon: "📋" },
    { value: "cleaning", label: "نظافة", icon: "🧹" },
    { value: "maintenance", label: "صيانة", icon: "🔧" },
    { value: "subscription", label: "اشتراكات", icon: "📱" },
    { value: "other", label: "أخرى", icon: "📦" },
  ];

  // Mock data for constants
  const [constants, setConstants] = useState<Constant[]>([
    {
      id: 1,
      salonId: "salon-001",
      salonName: "صالون الجمال الراقي",
      type: "rent",
      name: "إيجار المحل",
      amount: 5000,
      frequency: "شهري",
      startDate: "2026-01-01",
      notes: "يدفع في بداية كل شهر",
      status: "نشط",
    },
    {
      id: 2,
      salonId: "salon-001",
      salonName: "صالون الجمال الراقي",
      type: "electricity",
      name: "فاتورة الكهرباء",
      amount: 800,
      frequency: "شهري",
      startDate: "2026-01-01",
      notes: "متوسط الاستهلاك الشهري",
      status: "نشط",
    },
    {
      id: 3,
      salonId: "salon-001",
      salonName: "صالون الجمال الراقي",
      type: "water",
      name: "فاتورة المياه",
      amount: 150,
      frequency: "شهري",
      startDate: "2026-01-01",
      notes: "",
      status: "نشط",
    },
    {
      id: 4,
      salonId: "salon-002",
      salonName: "صالون النجوم",
      type: "rent",
      name: "إيجار المحل",
      amount: 7000,
      frequency: "شهري",
      startDate: "2026-01-01",
      notes: "",
      status: "نشط",
    },
    {
      id: 5,
      salonId: "salon-002",
      salonName: "صالون النجوم",
      type: "internet",
      name: "اشتراك الإنترنت",
      amount: 300,
      frequency: "شهري",
      startDate: "2026-01-01",
      notes: "باقة 100 ميجا",
      status: "نشط",
    },
    {
      id: 6,
      salonId: "salon-003",
      salonName: "صالون الأناقة",
      type: "insurance",
      name: "تأمين المحل",
      amount: 3000,
      frequency: "سنوي",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      notes: "تأمين شامل",
      status: "نشط",
    },
    {
      id: 7,
      salonId: "salon-003",
      salonName: "صالون الأناقة",
      type: "cleaning",
      name: "خدمة النظافة",
      amount: 500,
      frequency: "شهري",
      startDate: "2026-01-01",
      notes: "تنظيف يومي",
      status: "نشط",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedSalon = salons.find((s) => s.id === formData.salonId);
    
    if (activeTab === "edit" && editingConstant) {
      // Update existing constant
      setConstants(
        constants.map((constant) =>
          constant.id === editingConstant.id
            ? {
                ...constant,
                salonId: formData.salonId,
                salonName: selectedSalon?.name || "",
                type: formData.type,
                name: formData.name,
                amount: Number.parseFloat(formData.amount),
                frequency: formData.frequency,
                startDate: formData.startDate,
                endDate: formData.endDate,
                notes: formData.notes,
                status: formData.status,
              }
            : constant
        )
      );
      alert("تم تحديث الثابت بنجاح!");
    } else {
      // Add new constant
      const newConstant: Constant = {
        id: constants.length + 1,
        salonId: formData.salonId,
        salonName: selectedSalon?.name || "",
        type: formData.type,
        name: formData.name,
        amount: Number.parseFloat(formData.amount),
        frequency: formData.frequency,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
        status: formData.status,
      };
      setConstants([...constants, newConstant]);
      alert("تم إضافة الثابت بنجاح!");
    }
    
    // Reset form and go back to list
    handleReset();
    setActiveTab("list");
  };

  const handleReset = () => {
    setFormData({
      salonId: "",
      type: "",
      name: "",
      amount: "",
      frequency: "شهري",
      startDate: "",
      endDate: "",
      notes: "",
      status: "نشط",
    });
    setEditingConstant(null);
  };

  const handleEdit = (constant: Constant) => {
    setEditingConstant(constant);
    setFormData({
      salonId: constant.salonId,
      type: constant.type,
      name: constant.name,
      amount: constant.amount.toString(),
      frequency: constant.frequency,
      startDate: constant.startDate,
      endDate: constant.endDate || "",
      notes: constant.notes,
      status: constant.status,
    });
    setActiveTab("edit");
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الثابت؟")) {
      setConstants(constants.filter((constant) => constant.id !== id));
      alert("تم حذف الثابت بنجاح!");
    }
  };

  const handleToggleStatus = (id: number) => {
    setConstants(
      constants.map((constant) =>
        constant.id === id
          ? { ...constant, status: constant.status === "نشط" ? "معطل" : "نشط" }
          : constant
      )
    );
  };

  const getTypeLabel = (type: string) => {
    const typeObj = constantTypes.find((t) => t.value === type);
    return typeObj?.label || type;
  };

  const getTypeIcon = (type: string) => {
    const typeObj = constantTypes.find((t) => t.value === type);
    return typeObj?.icon || "📦";
  };

  const getFrequencyBadgeColor = (frequency: string) => {
    if (frequency === "شهري") return "bg-primary/20 text-primary";
    if (frequency === "سنوي") return "bg-warning/20 text-warning";
    return "bg-default/20 text-default";
  };

  // Filter constants
  const filteredConstants = constants.filter((constant) => {
    const matchSalon = filterSalon === "all" || constant.salonId === filterSalon;
    const matchType = filterType === "all" || constant.type === filterType;
    return matchSalon && matchType;
  });

  // Calculate totals by salon
  const salonTotals = salons.map((salon) => {
    const salonConstants = constants.filter((c) => c.salonId === salon.id && c.status === "نشط");
    const monthlyTotal = salonConstants
      .filter((c) => c.frequency === "شهري")
      .reduce((sum, c) => sum + c.amount, 0);
    const yearlyTotal = salonConstants
      .filter((c) => c.frequency === "سنوي")
      .reduce((sum, c) => sum + c.amount, 0);
    return {
      salonId: salon.id,
      salonName: salon.name,
      monthlyTotal,
      yearlyTotal,
      totalAnnual: monthlyTotal * 12 + yearlyTotal,
    };
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">إدارة الثوابت</h1>
        <p className="text-default-500">إدارة المصروفات الثابتة لكل صالون</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي الثوابت</p>
              <p className="text-2xl font-bold text-primary">{constants.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">الثوابت النشطة</p>
              <p className="text-2xl font-bold text-success">
                {constants.filter((c) => c.status === "نشط").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">الصالونات المسجلة</p>
              <p className="text-2xl font-bold text-warning">
                {new Set(constants.map((c) => c.salonId)).size}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي شهري</p>
              <p className="text-2xl font-bold text-danger">
                {constants
                  .filter((c) => c.frequency === "شهري" && c.status === "نشط")
                  .reduce((sum, c) => sum + c.amount, 0)
                  .toLocaleString()}{" "}
                ج.م
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-default-200 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "list"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => {
            setActiveTab("list");
            handleReset();
          }}
        >
          جميع الثوابت
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "add"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => {
            setActiveTab("add");
            handleReset();
          }}
        >
          إضافة ثابت
        </button>
        {activeTab === "edit" && (
          <button className="px-4 py-2 font-medium border-b-2 border-primary text-primary whitespace-nowrap">
            تعديل ثابت
          </button>
        )}
      </div>

      {/* List Constants Tab */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="filterSalon" className="block text-sm font-medium mb-2">
                  تصفية حسب الصالون
                </label>
                <select
                  id="filterSalon"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filterSalon}
                  onChange={(e) => setFilterSalon(e.target.value)}
                >
                  <option value="all">جميع الصالونات</option>
                  {salons.map((salon) => (
                    <option key={salon.id} value={salon.id}>
                      {salon.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="filterType" className="block text-sm font-medium mb-2">
                  تصفية حسب النوع
                </label>
                <select
                  id="filterType"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">جميع الأنواع</option>
                  {constantTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Salon Totals Summary */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">ملخص الثوابت حسب الصالون</h2>
            <div className="overflow-x-auto">
              <Table aria-label="جدول ملخص الصالونات">
                <TableHeader>
                  <TableColumn>الصالون</TableColumn>
                  <TableColumn>الثوابت الشهرية</TableColumn>
                  <TableColumn>الثوابت السنوية</TableColumn>
                  <TableColumn>التكلفة السنوية الإجمالية</TableColumn>
                </TableHeader>
                <TableBody>
                  {salonTotals.map((salon) => (
                    <TableRow key={salon.salonId}>
                      <TableCell className="font-medium">{salon.salonName}</TableCell>
                      <TableCell>{salon.monthlyTotal.toLocaleString()} ج.م</TableCell>
                      <TableCell>{salon.yearlyTotal.toLocaleString()} ج.م</TableCell>
                      <TableCell className="font-bold text-primary">
                        {salon.totalAnnual.toLocaleString()} ج.م
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Constants Table */}
          <Card className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                جميع الثوابت ({filteredConstants.length})
              </h2>
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                onClick={() => setActiveTab("add")}
              >
                + إضافة ثابت جديد
              </button>
            </div>
            <div className="overflow-x-auto">
              <Table aria-label="جدول الثوابت">
                <TableHeader>
                  <TableColumn>النوع</TableColumn>
                  <TableColumn>الصالون</TableColumn>
                  <TableColumn>الاسم</TableColumn>
                  <TableColumn>المبلغ</TableColumn>
                  <TableColumn>التكرار</TableColumn>
                  <TableColumn>تاريخ البدء</TableColumn>
                  <TableColumn>الحالة</TableColumn>
                  <TableColumn>الإجراءات</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredConstants.map((constant) => (
                    <TableRow key={constant.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getTypeIcon(constant.type)}</span>
                          <span>{getTypeLabel(constant.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{constant.salonName}</TableCell>
                      <TableCell className="font-medium">{constant.name}</TableCell>
                      <TableCell>{constant.amount.toLocaleString()} ج.م</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getFrequencyBadgeColor(
                            constant.frequency
                          )}`}
                        >
                          {constant.frequency}
                        </span>
                      </TableCell>
                      <TableCell>{constant.startDate}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleStatus(constant.id)}
                          className={`px-2 py-1 rounded-full text-xs ${
                            constant.status === "نشط"
                              ? "bg-success/20 text-success hover:bg-success/30"
                              : "bg-danger/20 text-danger hover:bg-danger/30"
                          }`}
                        >
                          {constant.status}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            className="text-primary hover:text-primary-600 text-sm"
                            onClick={() => handleEdit(constant)}
                          >
                            تعديل
                          </button>
                          <button
                            className="text-danger hover:text-danger-600 text-sm"
                            onClick={() => handleDelete(constant.id)}
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
          </Card>
        </div>
      )}

      {/* Add/Edit Constant Tab */}
      {(activeTab === "add" || activeTab === "edit") && (
        <Card className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === "add" ? "إضافة ثابت جديد" : "تعديل الثابت"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-default-700 border-b pb-2">
                المعلومات الأساسية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="salonId" className="block text-sm font-medium mb-2">
                    الصالون <span className="text-danger">*</span>
                  </label>
                  <select
                    id="salonId"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.salonId}
                    onChange={(e) =>
                      setFormData({ ...formData, salonId: e.target.value })
                    }
                    required
                  >
                    <option value="">اختر الصالون</option>
                    {salons.map((salon) => (
                      <option key={salon.id} value={salon.id}>
                        {salon.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-2">
                    النوع <span className="text-danger">*</span>
                  </label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                  >
                    <option value="">اختر النوع</option>
                    {constantTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  اسم الثابت <span className="text-danger">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="مثال: إيجار المحل، فاتورة الكهرباء"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-default-700 border-b pb-2">
                المعلومات المالية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium mb-2">
                    المبلغ (ج.م) <span className="text-danger">*</span>
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium mb-2">
                    التكرار <span className="text-danger">*</span>
                  </label>
                  <select
                    id="frequency"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value as typeof formData.frequency,
                      })
                    }
                    required
                  >
                    <option value="شهري">شهري</option>
                    <option value="سنوي">سنوي</option>
                    <option value="مرة واحدة">مرة واحدة</option>
                  </select>
                </div>
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
              <Button type="submit" color="primary" className="px-8">
                {activeTab === "add" ? "إضافة الثابت" : "حفظ التعديلات"}
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
              <h3 className="font-semibold mb-2">نصائح لإدارة الثوابت</h3>
              <ul className="text-sm text-default-600 space-y-1 list-disc list-inside">
                <li>سجل جميع المصروفات الثابتة لكل صالون لتتبع دقيق للتكاليف</li>
                <li>استخدم التكرار المناسب (شهري/سنوي/مرة واحدة) لحساب التكاليف بدقة</li>
                <li>راجع الثوابت بشكل دوري لتحديث المبالغ حسب التغيرات</li>
                <li>يمكنك تعطيل الثابت بدلاً من حذفه للحفاظ على السجلات التاريخية</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
