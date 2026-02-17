"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type ViewMode = "grid" | "table";

interface ApiSalon {
  salon_id: string;
  site: string | null;
  owner: {
    name: string;
    phone?: string | null;
    status?: string | null;
  } | null;
}

export default function Page() {
  // Protect this page - only admin of system and accounting man can access
  useAuth(["admin of system", "accounting man"]);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [salonCount, setSalonCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [salons, setSalons] = useState<ApiSalon[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/dashboard");
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
    }
    load();
  }, []);

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
        <Link href="/admin/dashboard/salons/addsalon">
          <Button color="primary" size="lg">
            ➕ إضافة صالون جديد
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي الصالونات</p>
              <p className="text-2xl font-bold text-primary">{salonCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي الموظفين</p>
              <p className="text-2xl font-bold text-warning">{employeesCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">النتائج</p>
              <p className="text-2xl font-bold text-secondary">{filtered.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="text-2xl">🔎</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">الحالة</p>
              <p className="text-2xl font-bold text-success">{loading ? "جارٍ التحميل" : "جاهز"}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 البحث باسم المالك أو الموقع أو المعرف..."
              className="w-full px-4 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-default-100 text-default-600 hover:bg-default-200"
              }`}
              onClick={() => setViewMode("grid")}
            >
              ⊞ شبكة
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-white"
                  : "bg-default-100 text-default-600 hover:bg-default-200"
              }`}
              onClick={() => setViewMode("table")}
            >
              ☰ جدول
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
            <Card key={s.salon_id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-default-900">{s.owner?.name ?? "—"}</h3>
                    <p className="text-sm text-default-500 mt-1">📍 {s.site ?? "—"}</p>
                    <p className="text-xs text-default-500 mt-1">ID: {s.salon_id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary`}>{s.owner?.status ?? "—"}</span>
                </div>

                <div className="border-t border-default-200" />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-default-500">الهاتف:</span>
                    <span className="text-default-700 font-medium">{s.owner?.phone ?? "—"}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-default-200">
                  <Link href={`/salon/${s.salon_id}`} className="flex-1">
                    <Button color="primary" size="sm" className="w-full">
                      فتح الصالون
                    </Button>
                  </Link>
                  <Button color="default" size="sm" variant="bordered" onClick={() => console.log("Edit", s.salon_id)}>
                    ✏️
                  </Button>
                </div>
              </div>
            </Card>
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-default-200">
                <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">المالك</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">الموقع</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">الهاتف</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">المعرف</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-default-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.salon_id} className="border-b border-default-100 hover:bg-default-50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-default-900">{s.owner?.name ?? "—"}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-default-700">{s.site ?? "—"}</td>
                  <td className="py-3 px-4 text-sm text-default-700">{s.owner?.phone ?? "—"}</td>
                  <td className="py-3 px-4 text-sm text-default-700">{s.salon_id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/salon/${s.salon_id}`}>
                        <Button color="primary" size="sm" variant="flat">فتح</Button>
                      </Link>
                      <Button color="default" size="sm" variant="flat" onClick={() => console.log("Edit", s.salon_id)}>تعديل</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
