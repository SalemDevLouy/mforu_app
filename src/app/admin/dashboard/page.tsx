"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { useAuth } from "@/hooks/useAuth";
import AddSalonDialog from "./components/Dialoges/AddSalonDialog";
import { ApiSalon, ViewMode } from "./types";
import { DashCard } from "@/components/common/DashCard";
import SalonCard from "./components/Cards/SalonCard";
import SalonsTable from "./components/tables/SalonsTable";

export default function Page() {
  // Protect this page - only admin of system and accounting man can access
  useAuth(["admin of system", "accounting man"]);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [salonCount, setSalonCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [salons, setSalons] = useState<ApiSalon[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "force-cache" });
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const payload = await res.json();
      const data = payload.data;
      setSalonCount(data.salonCount ?? 0);
      setEmployeesCount(data.employeesCount ?? 0);
      setSalons(Array.isArray(data.salons) ? data.salons : []);
    } catch (e) {
      setError("فشل في جلب بيانات لوحة التحكم");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Filtered using owner name or site
  const filtered = salons.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const ownerName = s.owner?.name?.toLowerCase() ?? "";
    const site = s.site?.toLowerCase() ?? "";
    return ownerName.includes(q) || site.includes(q) || s.salon_id.includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">لوحة تحكم الصالونات</h1>
          <p className="text-default-500">عرض الحالة السريعة للصالونات</p>
        </div>
        <Button color="primary" size="lg" onPress={() => setIsAddDialogOpen(true)}>
          ➕ إضافة صالون جديد
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashCard title="إجمالي الصالونات" value={salonCount} icon="🏪" />
        <DashCard title="إجمالي الموظفين" value={employeesCount} icon="👥" />
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-default-500 text-sm">الحالة</p>
            <div className="text-2xl font-bold">{loading ? "⏳ جارٍ التحميل" : "✅ جاهز"}</div>
          </div>
        </Card>
        <DashCard title="نتائج البحث" value={filtered.length} icon="🔍" />
      </div>

   

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="البحث باسم المالك أو الموقع أو المعرف..."
              className="w-full pr-10 pl-4 py-2.5 border border-default-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-default-50 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600 text-xs"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 p-1 bg-default-100 rounded-xl self-start md:self-auto">
            <button
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                viewMode === "grid"
                  ? "bg-white dark:bg-default-200 shadow-sm text-primary"
                  : "text-default-500 hover:text-default-700"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <span>⊞</span>
              <span>شبكة</span>
            </button>
            <button
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                viewMode === "table"
                  ? "bg-white dark:bg-default-200 shadow-sm text-primary"
                  : "text-default-500 hover:text-default-700"
              }`}
              onClick={() => setViewMode("table")}
            >
              <span>☰</span>
              <span>جدول</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="p-4 bg-danger/10 text-danger">{error}</Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <SalonCard key={s.salon_id} salon={s} />
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-full">
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-default-100 flex items-center justify-center">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">لا توجد نتائج</h3>
                    <p className="text-default-500 mt-2">لم يتم العثور على صالونات تطابق معايير البحث</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="p-4 overflow-x-auto">
          <SalonsTable salons={filtered} />
        </Card>
      )}
      <AddSalonDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={load}
      />
    </div>
  );
}
