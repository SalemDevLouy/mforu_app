"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Salon } from "../types";


export default function ReportPage() {
  // Protect this page - only admin of system and accounting man can access
  useAuth(["admin of system", "accounting man"]);

  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) throw new Error("Failed to fetch salons");
      const payload = await response.json();
      setSalons(payload.data?.salons || []);
    } catch (err) {
      setError("فشل في تحميل الصالونات");
      console.error("Error fetching salons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter salons by owner name or site
  const filteredSalons = salons.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const ownerName = s.owner?.name?.toLowerCase() ?? "";
    const site = s.site?.toLowerCase() ?? "";
    return ownerName.includes(q) || site.includes(q) || s.salon_id.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">تقارير الصالونات</h1>
        <p className="text-default-500">اختر صالون لعرض التقرير التفصيلي</p>
      </div>


      {/* Search */}
      <Card className="p-4">
        <input
          type="text"
          placeholder="🔍 البحث باسم المالك أو الموقع أو المعرف..."
          className="w-full px-4 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-danger/10 text-danger">
          {error}
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredSalons.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-default-100 flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">لا توجد صالونات</h3>
              <p className="text-default-500 mt-2">
                {searchQuery ? "لم يتم العثور على صالونات تطابق معايير البحث" : "لا توجد صالونات مسجلة في النظام"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Salons Grid */}
      {!isLoading && filteredSalons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSalons.map((salon) => (
            <Card key={salon.salon_id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Salon Info */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-default-900">
                      {salon.owner?.name ?? "صالون غير معروف"}
                    </h3>
                    <span className="text-2xl">🏪</span>
                  </div>
                  <p className="text-sm text-default-500">📍 {salon.site ?? "—"}</p>
                  {salon.owner?.phone && (
                    <p className="text-sm text-default-500 mt-1">📞 {salon.owner.phone}</p>
                  )}
                  <p className="text-xs text-default-400 mt-2">ID: {salon.salon_id}</p>
                </div>

                <div className="border-t border-default-200" />

                {/* Action Button */}
                <Link href={`/admin/dashboard/accounting/${salon.salon_id}`} className="block">
                  <Button color="primary" className="w-full" size="lg">
                    📊 عرض التقرير
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

    
    </div>
  );
}
