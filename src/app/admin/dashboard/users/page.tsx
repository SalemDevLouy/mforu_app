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

interface User {
  user_id: string;
  name: string;
  phone: string | null;
  status: string | null;
  salon_id: string | null;
  role: {
    role_id: string;
    role_name: string;
  } | null;
  salon: {
    salon_id: string;
    name: string;
    site: string;
  } | null;
}

interface Role {
  role_id: string;
  role_name: string;
}

interface Salon {
  salon_id: string;
  site: string;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterSalon, setFilterSalon] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  
  // User form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role_id: "",
    salon_id: "",
    status: "ACTIVE",
  });

  // Fetch all data on mount
  useEffect(() => {
    fetchUsers();
    fetchSalons();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalons = async () => {
    try {
      const response = await fetch("/api/admin/salons");
      if (!response.ok) throw new Error("Failed to fetch salons");
      const data = await response.json();
      setSalons(data);
    } catch (err) {
      console.error("Error fetching salons:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      if (!response.ok) throw new Error("Failed to fetch roles");
      const data = await response.json();
      setRoles(data.roles);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (activeTab === "edit" && editingUser) {
        // Update existing user
        const response = await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: editingUser.user_id,
            name: formData.name,
            phone: formData.phone,
            password: formData.password, // Will only update if not empty
            role_id: formData.role_id,
            salon_id: formData.salon_id || null,
            status: formData.status,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to update user");
        }

        alert("تم تحديث المستخدم بنجاح!");
      } else {
        // Add new user
        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            password: formData.password,
            role_id: formData.role_id,
            salon_id: formData.salon_id || null,
            status: formData.status,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to create user");
        }

        alert("تم إضافة المستخدم بنجاح!");
      }

      // Reset form and refresh data
      handleReset();
      setActiveTab("list");
      await fetchUsers();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "حدث خطأ";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      password: "",
      role_id: "",
      salon_id: "",
      status: "ACTIVE",
    });
    setEditingUser(null);
    setError(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone || "",
      password: "",
      role_id: user.role?.role_id || "",
      salon_id: user.salon_id || "",
      status: user.status || "ACTIVE",
    });
    setActiveTab("edit");
  };

  const handleDelete = async (user_id: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?user_id=${user_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      alert("تم حذف المستخدم بنجاح!");
      await fetchUsers();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "فشل حذف المستخدم";
      alert(errorMsg);
      console.error("Error deleting user:", err);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          name: user.name,
          phone: user.phone,
          role_id: user.role?.role_id || "",
          salon_id: user.salon_id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
      }

      await fetchUsers();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "فشل تحديث الحالة";
      alert(errorMsg);
      console.error("Error toggling status:", err);
    }
  };

  const getRoleLabel = (roleName: string) => {
    return roleName;
  };

  const getRoleBadgeColor = (roleName: string) => {
    const colors: Record<string, string> = {
      "admin of system": "bg-danger/20 text-danger",
      "accounting man": "bg-warning/20 text-warning",
      "salon owner": "bg-primary/20 text-primary",
      "reception": "bg-success/20 text-success",
    };
    return colors[roleName] || "bg-default/20 text-default";
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSalon = filterSalon === "all" || user.salon_id === filterSalon;
    const matchRole = filterRole === "all" || user.role?.role_id === filterRole;
    return matchSalon && matchRole;
  });

  // Check if role is admin (doesn't need salon)
  const isAdminRole = (roleId: string) => {
    const role = roles.find(r => r.role_id === roleId);
    return role?.role_name === "admin of system" || role?.role_name === "accounting man";
  };

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
                {users.filter((u) => u.status === "ACTIVE").length}
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
                {users.filter((u) => u.role?.role_name === "salon owner").length}
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
              <p className="text-sm text-default-500">موظفي الاستقبال</p>
              <p className="text-2xl font-bold text-success">
                {users.filter((u) => u.role?.role_name === "reception").length}
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
                    <option key={salon.salon_id} value={salon.salon_id}>
                      {salon.site}
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
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {isLoading && (
            <Card className="p-8 text-center">
              <div className="flex justify-center items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p>جاري التحميل...</p>
              </div>
            </Card>
          )}

          {!isLoading && error && (
            <Card className="p-8 text-center">
              <p className="text-danger">{error}</p>
              <Button onPress={fetchUsers} className="mt-4" color="primary">
                إعادة المحاولة
              </Button>
            </Card>
          )}

          {!isLoading && !error && (
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
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-default-500">
                <p>لا يوجد مستخدمين</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <Table aria-label="جدول المستخدمين">
                <TableHeader>
                  <TableColumn>الاسم الكامل</TableColumn>
                  <TableColumn>رقم الهاتف</TableColumn>
                  <TableColumn>الدور</TableColumn>
                  <TableColumn>الصالون</TableColumn>
                  <TableColumn>الحالة</TableColumn>
                  <TableColumn>الإجراءات</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(
                            user.role?.role_name || ""
                          )}`}
                        >
                          {getRoleLabel(user.role?.role_name || "غير محدد")}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.salon?.site || <span className="text-default-400">-</span>}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.status === "ACTIVE"
                              ? "bg-success/20 text-success hover:bg-success/30"
                              : "bg-danger/20 text-danger hover:bg-danger/30"
                          }`}
                        >
                          {user.status === "ACTIVE" ? "نشط" : "معطل"}
                        </button>
                      </TableCell>
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
                            onClick={() => handleDelete(user.user_id, user.name)}
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
        </div>
      )}

      {/* Add/Edit User Tab */}
      {(activeTab === "add" || activeTab === "edit") && (
        <Card className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === "add" ? "إضافة مستخدم جديد" : "تعديل المستخدم"}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger rounded-lg text-danger">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-default-700 border-b pb-2">
                المعلومات الشخصية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    الاسم الكامل <span className="text-danger">*</span>
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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    رقم الهاتف <span className="text-danger">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    pattern="\d{10}"
                    placeholder="05XXXXXXXX"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
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
                    minLength={6}
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={activeTab === "add"}
                    disabled={isSubmitting}
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
                  <label htmlFor="role_id" className="block text-sm font-medium mb-2">
                    الدور <span className="text-danger">*</span>
                  </label>
                  <select
                    id="role_id"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.role_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role_id: e.target.value,
                        salon_id: isAdminRole(e.target.value) ? "" : formData.salon_id,
                      })
                    }
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">اختر الدور</option>
                    {roles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="salon_id" className="block text-sm font-medium mb-2">
                    الصالون {!isAdminRole(formData.role_id) && <span className="text-danger">*</span>}
                  </label>
                  <select
                    id="salon_id"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.salon_id}
                    onChange={(e) =>
                      setFormData({ ...formData, salon_id: e.target.value })
                    }
                    required={!isAdminRole(formData.role_id)}
                    disabled={isAdminRole(formData.role_id) || isSubmitting}
                  >
                    <option value="">
                      {isAdminRole(formData.role_id) ? "لا يوجد" : "اختر الصالون"}
                    </option>
                    {salons.map((salon) => (
                      <option key={salon.salon_id} value={salon.salon_id}>
                        {salon.site}
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
                        status: e.target.value,
                      })
                    }
                    required
                    disabled={isSubmitting}
                  >
                    <option value="ACTIVE">نشط</option>
                    <option value="INACTIVE">معطل</option>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                إلغاء
              </button>
              <Button type="submit" color="primary" className="px-8" isLoading={isSubmitting}>
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
