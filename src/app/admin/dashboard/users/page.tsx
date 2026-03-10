"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { User, Role, Salon } from "./types";
import { fetchUsers as apiFetchUsers, createUser, updateUser, deleteUser, toggleUserStatus } from "./model/users";
import { fetchSalons as apiFetchSalons } from "./model/salons";
import { fetchRoles as apiFetchRoles } from "./model/roles";
import UsersTable from "../components/tables/UsersTable";
import { DashCard } from "@/components/common/DashCard";
import AddUsersDialog from "../components/Dialoges/Users/AddUsersDialog";
import UpdateUserDialog from "../components/Dialoges/Users/UpdateUserDialog";
import DeleteUserDialoge from "../components/Dialoges/Users/DeleteUserDialoge";


export default function Page() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterSalon, setFilterSalon] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ user_id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
      const users = await apiFetchUsers();
      setUsers(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalons = async () => {
    try {
      const salons = await apiFetchSalons();
      setSalons(salons);
    } catch (err) {
      console.error("Error fetching salons:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const roles = await apiFetchRoles();
      setRoles(roles);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingUser) {
        // Update existing user
        await updateUser({
          user_id: editingUser.user_id,
          name: formData.name,
          phone: formData.phone,
          password: formData.password, // Will only update if not empty
          role_id: formData.role_id,
          salon_id: formData.salon_id || null,
          status: formData.status,
        });
        alert("تم تحديث المستخدم بنجاح!");
      } else {
        // Add new user
        await createUser({
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          role_id: formData.role_id,
          salon_id: formData.salon_id || null,
          status: formData.status,
        });
        alert("تم إضافة المستخدم بنجاح!");
      }

      // Reset form and refresh data
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      handleReset();
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
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user_id: string, userName: string) => {
    setDeleteTarget({ user_id, name: userName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteUser(deleteTarget.user_id);
      alert("تم حذف المستخدم بنجاح!");
      setDeleteTarget(null);
      await fetchUsers();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "فشل حذف المستخدم";
      alert(errorMsg);
      console.error("Error deleting user:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleUserStatus(user);
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
        <DashCard title="إجمالي المستخدمين" value={users.length} icon="👥" />
          
          <DashCard title="إجمالي الصالونات" value={salons.length} icon="🏪" />
          <DashCard title="إجمالي الأدوار" value={roles.length} icon="🎭" />
      </div>

      {/* List Users */}
      <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-default-600">تصفية النتائج</p>
                {(filterSalon !== "all" || filterRole !== "all") && (
                  <button
                    onClick={() => { setFilterSalon("all"); setFilterRole("all"); }}
                    className="text-xs text-primary hover:underline"
                  >
                    مسح التصفية
                  </button>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <Select
                  label="الصالون"
                  placeholder="جميع الصالونات"
                  variant="bordered"
                  size="sm"
                  className="flex-1"
                  selectedKeys={filterSalon === "all" ? new Set(["all"]) : new Set([filterSalon])}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    setFilterSalon(val ?? "all");
                  }}
                  startContent={<span className="text-default-400 text-sm">🏪</span>}
                  items={[{ key: "all", label: "جميع الصالونات" }, ...salons.map((s) => ({ key: s.salon_id, label: s.site }))]}
                >
                  {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
                </Select>
                <Select
                  label="الدور"
                  placeholder="جميع الأدوار"
                  variant="bordered"
                  size="sm"
                  className="flex-1"
                  selectedKeys={filterRole === "all" ? new Set(["all"]) : new Set([filterRole])}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    setFilterRole(val ?? "all");
                  }}
                  startContent={<span className="text-default-400 text-sm">🎭</span>}
                  items={[{ key: "all", label: "جميع الأدوار" }, ...roles.map((r) => ({ key: r.role_id, label: r.role_name }))]}
                >
                  {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
                </Select>
              </div>
              {(filterSalon !== "all" || filterRole !== "all") && (
                <div className="flex flex-wrap gap-2">
                  {filterSalon !== "all" && (
                    <Chip
                      size="sm"
                      variant="flat"
                      color="primary"
                      onClose={() => setFilterSalon("all")}
                    >
                      {salons.find(s => s.salon_id === filterSalon)?.site ?? filterSalon}
                    </Chip>
                  )}
                  {filterRole !== "all" && (
                    <Chip
                      size="sm"
                      variant="flat"
                      color="secondary"
                      onClose={() => setFilterRole("all")}
                    >
                      {roles.find(r => r.role_id === filterRole)?.role_name ?? filterRole}
                    </Chip>
                  )}
                </div>
              )}
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
              <Button
                color="primary"
                onPress={() => { handleReset(); setIsAddDialogOpen(true); }}
              >
                + إضافة مستخدم جديد
              </Button>
            </div>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-default-500">
                <p>لا يوجد مستخدمين</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <UsersTable
                filteredUsers={filteredUsers}
                getRoleBadgeColor={getRoleBadgeColor}
                getRoleLabel={getRoleLabel}
                handleToggleStatus={handleToggleStatus}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
            )}
          </Card>
          )}
        </div>

      <UpdateUserDialog
        isOpen={isEditDialogOpen}
        isSubmitting={isSubmitting}
        error={error}
        formData={formData}
        roles={roles}
        salons={salons}
        isAdminRole={isAdminRole}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        onClose={() => { setIsEditDialogOpen(false); handleReset(); }}
        onReset={handleReset}
      />
      <AddUsersDialog
        isOpen={isAddDialogOpen}
        isSubmitting={isSubmitting}
        error={error}
        formData={formData}
        roles={roles}
        salons={salons}
        isAdminRole={isAdminRole}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        onClose={() => { setIsAddDialogOpen(false); handleReset(); }}
        onReset={handleReset}
      />

      <DeleteUserDialoge
        isOpen={deleteTarget !== null}
        userName={deleteTarget?.name ?? ""}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
