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

interface User {
  id: number;
  fullName: string;
  phone: string;
  role: "admin" | "salon_owner" | "employee" | "reception";
  salonId: string | null;
  salonName: string | null;
  status: "نشط" | "معطل";
  createdAt: string;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterSalon, setFilterSalon] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  
  // User form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    role: "employee" as "admin" | "salon_owner" | "employee" | "reception",
    salonId: "",
    status: "نشط" as "نشط" | "معطل",
  });

  // Mock salons data
  const salons = [
    { id: "salon-001", name: "صالون الجمال الراقي" },
    { id: "salon-002", name: "صالون النجوم" },
    { id: "salon-003", name: "صالون الأناقة" },
    { id: "salon-004", name: "صالون الفخامة" },
  ];

  // Mock data for users
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      fullName: "أحمد محمد",
      phone: "0123456789",
      role: "admin",
      salonId: null,
      salonName: null,
      status: "نشط",
      createdAt: "2026-01-15",
    },
    {
      id: 2,
      fullName: "فاطمة حسن",
      phone: "0198765432",
      role: "salon_owner",
      salonId: "salon-001",
      salonName: "صالون الجمال الراقي",
      status: "نشط",
      createdAt: "2026-01-16",
    },
    {
      id: 3,
      fullName: "محمد علي",
      phone: "0111222333",
      role: "employee",
      salonId: "salon-001",
      salonName: "صالون الجمال الراقي",
      status: "نشط",
      createdAt: "2026-01-17",
    },
    {
      id: 4,
      fullName: "سارة أحمد",
      phone: "0122334455",
      role: "reception",
      salonId: "salon-002",
      salonName: "صالون النجوم",
      status: "نشط",
      createdAt: "2026-01-18",
    },
    {
      id: 5,
      fullName: "خالد سعيد",
      phone: "0133445566",
      role: "employee",
      salonId: "salon-002",
      salonName: "صالون النجوم",
      status: "نشط",
      createdAt: "2026-01-19",
    },
    {
      id: 6,
      fullName: "نور الدين",
      phone: "0144556677",
      role: "salon_owner",
      salonId: "salon-003",
      salonName: "صالون الأناقة",
      status: "معطل",
      createdAt: "2026-01-20",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedSalon = salons.find((s) => s.id === formData.salonId);
    
    if (activeTab === "edit" && editingUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                fullName: formData.fullName,
                phone: formData.phone,
                role: formData.role,
                salonId: formData.salonId || null,
                salonName: selectedSalon?.name || null,
                status: formData.status,
              }
            : user
        )
      );
      alert("تم تحديث المستخدم بنجاح!");
    } else {
      // Add new user
      const newUser: User = {
        id: users.length + 1,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        salonId: formData.salonId || null,
        salonName: selectedSalon?.name || null,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
      alert("تم إضافة المستخدم بنجاح!");
    }
    
    // Reset form and go back to list
    handleReset();
    setActiveTab("list");
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      phone: "",
      password: "",
      role: "employee",
      salonId: "",
      status: "نشط",
    });
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      phone: user.phone,
      password: "",
      role: user.role,
      salonId: user.salonId || "",
      status: user.status,
    });
    setActiveTab("edit");
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      setUsers(users.filter((user) => user.id !== id));
      alert("تم حذف المستخدم بنجاح!");
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "نشط" ? "معطل" : "نشط" }
          : user
      )
    );
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      admin: "مدير النظام",
      salon_owner: "مالك صالون",
      employee: "موظف",
      reception: "استقبال",
    };
    return roleLabels[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-danger/20 text-danger",
      salon_owner: "bg-primary/20 text-primary",
      employee: "bg-success/20 text-success",
      reception: "bg-warning/20 text-warning",
    };
    return colors[role] || "bg-default/20 text-default";
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSalon = filterSalon === "all" || user.salonId === filterSalon;
    const matchRole = filterRole === "all" || user.role === filterRole;
    return matchSalon && matchRole;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">إدارة المستخدمين</h1>
        <p className="text-default-500">إضافة وتعديل وحذف مستخدمي النظام</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-primary">{users.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">المستخدمين النشطين</p>
              <p className="text-2xl font-bold text-success">
                {users.filter((u) => u.status === "نشط").length}
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
              <p className="text-sm text-default-500">ملاك الصالونات</p>
              <p className="text-2xl font-bold text-primary">
                {users.filter((u) => u.role === "salon_owner").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">الموظفين</p>
              <p className="text-2xl font-bold text-success">
                {users.filter((u) => u.role === "employee").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-2xl">👨‍💼</span>
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
          جميع المستخدمين
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
          إضافة مستخدم
        </button>
        {activeTab === "edit" && (
          <button className="px-4 py-2 font-medium border-b-2 border-primary text-primary">
            تعديل مستخدم
          </button>
        )}
      </div>

      {/* List Users Tab */}
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
                <label htmlFor="filterRole" className="block text-sm font-medium mb-2">
                  تصفية حسب الدور
                </label>
                <select
                  id="filterRole"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="admin">مدير النظام</option>
                  <option value="salon_owner">مالك صالون</option>
                  <option value="employee">موظف</option>
                  <option value="reception">استقبال</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                جميع المستخدمين ({filteredUsers.length})
              </h2>
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                onClick={() => setActiveTab("add")}
              >
                + إضافة مستخدم جديد
              </button>
            </div>
            <div className="overflow-x-auto">
              <Table aria-label="جدول المستخدمين">
                <TableHeader>
                  <TableColumn>الاسم الكامل</TableColumn>
                  <TableColumn>رقم الهاتف</TableColumn>
                  <TableColumn>الدور</TableColumn>
                  <TableColumn>الصالون</TableColumn>
                  <TableColumn>الحالة</TableColumn>
                  <TableColumn>تاريخ الإنشاء</TableColumn>
                  <TableColumn>الإجراءات</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.salonName || <span className="text-default-400">-</span>}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.status === "نشط"
                              ? "bg-success/20 text-success hover:bg-success/30"
                              : "bg-danger/20 text-danger hover:bg-danger/30"
                          }`}
                        >
                          {user.status}
                        </button>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            className="text-primary hover:text-primary-600 text-sm"
                            onClick={() => handleEdit(user)}
                          >
                            تعديل
                          </button>
                          <button
                            className="text-danger hover:text-danger-600 text-sm"
                            onClick={() => handleDelete(user.id)}
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

      {/* Add/Edit User Tab */}
      {(activeTab === "add" || activeTab === "edit") && (
        <Card className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === "add" ? "إضافة مستخدم جديد" : "تعديل المستخدم"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-default-700 border-b pb-2">
                المعلومات الشخصية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    الاسم الكامل <span className="text-danger">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    رقم الهاتف <span className="text-danger">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-default-700 border-b pb-2">
                معلومات الحساب
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    كلمة المرور {activeTab === "add" && <span className="text-danger">*</span>}
                    {activeTab === "edit" && (
                      <span className="text-xs text-default-500">
                        {" "}
                        (اتركه فارغاً لعدم التغيير)
                      </span>
                    )}
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={activeTab === "add"}
                  />
                </div>
              </div>
            </div>

            {/* Role & Salon Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-default-700 border-b pb-2">
                معلومات الدور والصالون
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-2">
                    الدور <span className="text-danger">*</span>
                  </label>
                  <select
                    id="role"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as typeof formData.role,
                      })
                    }
                    required
                  >
                    <option value="employee">موظف</option>
                    <option value="reception">استقبال</option>
                    <option value="salon_owner">مالك صالون</option>
                    <option value="admin">مدير النظام</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="salonId" className="block text-sm font-medium mb-2">
                    الصالون {formData.role !== "admin" && <span className="text-danger">*</span>}
                  </label>
                  <select
                    id="salonId"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.salonId}
                    onChange={(e) =>
                      setFormData({ ...formData, salonId: e.target.value })
                    }
                    required={formData.role !== "admin"}
                    disabled={formData.role === "admin"}
                  >
                    <option value="">
                      {formData.role === "admin" ? "لا يوجد" : "اختر الصالون"}
                    </option>
                    {salons.map((salon) => (
                      <option key={salon.id} value={salon.id}>
                        {salon.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-2">
                    الحالة <span className="text-danger">*</span>
                  </label>
                  <select
                    id="status"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "نشط" | "معطل",
                      })
                    }
                    required
                  >
                    <option value="نشط">نشط</option>
                    <option value="معطل">معطل</option>
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
                {activeTab === "add" ? "إضافة المستخدم" : "حفظ التعديلات"}
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
              <h3 className="font-semibold mb-2">نصائح لإدارة المستخدمين</h3>
              <ul className="text-sm text-default-600 space-y-1 list-disc list-inside">
                <li>مدير النظام له صلاحيات كاملة على جميع الصالونات</li>
                <li>مالك الصالون يمكنه إدارة صالونه فقط</li>
                <li>الموظف والاستقبال لهم صلاحيات محدودة حسب دورهم</li>
                <li>يمكنك تعطيل المستخدم بدلاً من حذفه للحفاظ على السجلات</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
