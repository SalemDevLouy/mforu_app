"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface SalonReport {
  salon_id: string;
  salon_name: string;
  salon_site: string;
  owner_name: string;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  services_count: number;
  clients_count: number;
  employees_count: number;
}

export default function SalonReportPage({ params }: { params: { salonId: string } }) {
  // Protect this page - only admin of system and accounting man can access
  useAuth(["admin of system", "accounting man"]);

  const router = useRouter();
  const [report, setReport] = useState<SalonReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSalonReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSalonReport = async () => {
    setIsLoading(true);
    setError("");
    try {
      // TODO: Replace with actual API endpoint when ready
      // const response = await fetch(`/api/admin/reports/salon/${params.salonId}`);
      // if (!response.ok) throw new Error("Failed to fetch salon report");
      // const data = await response.json();
      // setReport(data);

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReport({
        salon_id: params.salonId,
        salon_name: "صالون الجمال",
        salon_site: "الرياض - حي النخيل",
        owner_name: "أحمد محمد",
        total_revenue: 45000,
        total_expenses: 15000,
        net_profit: 30000,
        services_count: 120,
        clients_count: 45,
        employees_count: 8,
      });
    } catch (err) {
      setError("فشل في تحميل تقرير الصالون");
      console.error("Error fetching salon report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">جاري تحميل التقرير...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-4">
        <Card className="p-6 bg-danger/10 text-danger">
          <p>{error || "لم يتم العثور على التقرير"}</p>
        </Card>
        <Button color="primary" onPress={() => router.push("/admin/dashboard/report")}>
          العودة إلى القائمة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">تقرير الصالون</h1>
          <p className="text-default-500">{report.salon_name} - {report.salon_site}</p>
          <p className="text-sm text-default-400 mt-1">المالك: {report.owner_name}</p>
        </div>
        <Button 
          color="default" 
          variant="bordered"
          onPress={() => router.push("/admin/dashboard/report")}
        >
          ← العودة
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-success">{report.total_revenue.toLocaleString()} ر.س</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-danger">{report.total_expenses.toLocaleString()} ر.س</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">صافي الربح</p>
              <p className="text-2xl font-bold text-primary">{report.net_profit.toLocaleString()} ر.س</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">عدد الخدمات</p>
              <p className="text-2xl font-bold text-warning">{report.services_count}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <span className="text-2xl">✂️</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">عدد العملاء</p>
              <p className="text-2xl font-bold text-secondary">{report.clients_count}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">عدد الموظفين</p>
              <p className="text-2xl font-bold text-default-700">{report.employees_count}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center">
              <span className="text-2xl">👔</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Breakdown */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">تفصيل الإيرادات</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
              <span className="text-default-600">خدمات الصالون</span>
              <span className="font-semibold text-success">35,000 ر.س</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
              <span className="text-default-600">منتجات مباعة</span>
              <span className="font-semibold text-success">10,000 ر.س</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary">
              <span className="font-semibold">الإجمالي</span>
              <span className="font-bold text-success">{report.total_revenue.toLocaleString()} ر.س</span>
            </div>
          </div>
        </Card>

        {/* Expenses Breakdown */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">تفصيل المصروفات</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
              <span className="text-default-600">رواتب الموظفين</span>
              <span className="font-semibold text-danger">8,000 ر.س</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
              <span className="text-default-600">إيجار وفواتير</span>
              <span className="font-semibold text-danger">5,000 ر.س</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
              <span className="text-default-600">مصروفات أخرى</span>
              <span className="font-semibold text-danger">2,000 ر.س</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-danger/5 rounded-lg border border-danger">
              <span className="font-semibold">الإجمالي</span>
              <span className="font-bold text-danger">{report.total_expenses.toLocaleString()} ر.س</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button color="primary" size="lg">
          📥 تصدير PDF
        </Button>
        <Button color="default" variant="bordered" size="lg">
          📊 تصدير Excel
        </Button>
        <Button color="default" variant="bordered" size="lg">
          🖨️ طباعة
        </Button>
      </div>

      {/* Info Note */}
      <Card className="p-4 md:p-6 bg-primary/5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="font-semibold mb-2">ملاحظة</h3>
            <p className="text-sm text-default-600">
              هذا التقرير يعرض البيانات الإجمالية للصالون. يمكنك تصدير التقرير بصيغة PDF أو Excel للحصول على نسخة قابلة للطباعة أو المشاركة.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
