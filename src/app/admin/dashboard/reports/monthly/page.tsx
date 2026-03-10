"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { useAuth } from "@/hooks/useAuth";

interface Salon {
  salon_id: string;
  site: string;
}

interface MonthlyReport {
  salon: {
    salon_id: string;
    name: string;
    site: string;
    owner: {
      name: string;
      phone: string | null;
    } | null;
  };
  period: {
    start: string;
    end: string;
    type: string;
  };
  summary: {
    total_income: number;
    total_expenses: number;
    constants_total: number;
    employee_income_total: number;
    net_profit: number;
    services_count: number;
  };
  services: Array<{
    service_id: string;
    price_total: number;
    date: string;
    client: { name: string };
  }>;
  expenses: Array<{
    exp_id: string;
    exp_type: string;
    exp_val: number;
    date: string;
  }>;
  constants: Array<{
    const_id: string;
    const_name: string;
    const_value: number;
    repetation: string;
  }>;
  employee_incomes: Array<{
    emp_id: string;
    emp_name: string;
    role: string | null;
    field: string | null;
    total_earned: number;
    total_withdrawn: number;
    balance: number;
    tasks_count: number;
  }>;
}

export default function MonthlyReportsPage() {
  useAuth(["admin of system", "accounting man"]);

  const [salons, setSalons] = useState<Salon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with current month
  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(currentMonth);
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const response = await fetch("/api/admin/salons");
      if (!response.ok) throw new Error("Failed to fetch salons");
      const data = await response.json();
      setSalons(data);
      if (data.length > 0) {
        setSelectedSalon(data[0].salon_id);
      }
    } catch (err) {
      console.error("Error fetching salons:", err);
    }
  };

  const fetchReport = async () => {
    if (!selectedSalon || !selectedMonth) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/reports/monthly?salon_id=${selectedSalon}&month=${selectedMonth}`
      );
      if (!response.ok) throw new Error("Failed to fetch report");
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch report");
      console.error("Error fetching report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    globalThis.print();
  };

  const handleExportCSV = () => {
    if (!report) return;

    // Create CSV content
    let csv = "Monthly Report\n\n";
    csv += `Salon,${report.salon.name}\n`;
    csv += `Location,${report.salon.site}\n`;
    csv += `Owner,${report.salon.owner?.name || "N/A"}\n`;
    csv += `Period,${new Date(report.period.start).toLocaleDateString()} - ${new Date(report.period.end).toLocaleDateString()}\n\n`;
    
    csv += "Summary\n";
    csv += `Total Income,${report.summary.total_income}\n`;
    csv += `Total Expenses,${report.summary.total_expenses}\n`;
    csv += `Constants Total,${report.summary.constants_total}\n`;
    csv += `Employee Income,${report.summary.employee_income_total}\n`;
    csv += `Net Profit,${report.summary.net_profit}\n\n`;

    csv += "Employee Income Details\n";
    csv += "Name,Role,Total Earned,Withdrawn,Balance,Tasks\n";
    report.employee_incomes.forEach((emp) => {
      csv += `${emp.emp_name},${emp.role || "N/A"},${emp.total_earned},${emp.total_withdrawn},${emp.balance},${emp.tasks_count}\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `monthly-report-${selectedMonth}.csv`;
    link.click();
  };

  const formatCurrency = (amount: number) => {
    // Use Latin numerals (0-9) for better readability
    const formatted = new Intl.NumberFormat("ar-DZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(amount);
    
    return `${formatted} دج`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">التقارير الشهرية</h1>
        <p className="text-default-500">عرض التقارير المالية الشهرية للصالونات</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="salon" className="block text-sm font-medium mb-2">
              اختر الصالون
            </label>
            <select
              id="salon"
              className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedSalon}
              onChange={(e) => setSelectedSalon(e.target.value)}
            >
              <option value="">اختر الصالون</option>
              {salons.map((salon) => (
                <option key={salon.salon_id} value={salon.salon_id}>
                  {salon.site}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="month" className="block text-sm font-medium mb-2">
              اختر الشهر
            </label>
            <input
              id="month"
              type="month"
              className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button
              color="primary"
              className="w-full"
              onPress={fetchReport}
              isLoading={isLoading}
              isDisabled={!selectedSalon || !selectedMonth}
            >
              عرض التقرير
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Display */}
      {error && (
        <Card className="p-6 bg-danger/10 border border-danger">
          <p className="text-danger">{error}</p>
        </Card>
      )}

      {report && (
        <div className="space-y-6 print:space-y-4">
          {/* Export Buttons */}
          <div className="flex gap-3 print:hidden">
            <Button color="default" variant="bordered" onPress={handlePrint}>
              🖨️ طباعة
            </Button>
            <Button color="default" variant="bordered" onPress={handleExportCSV}>
              📊 تصدير CSV
            </Button>
          </div>

          {/* Salon Info */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">معلومات الصالون</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-default-500">اسم الصالون</p>
                <p className="font-semibold">{report.salon.name}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">الموقع</p>
                <p className="font-semibold">{report.salon.site}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">المالك</p>
                <p className="font-semibold">{report.salon.owner?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">الفترة</p>
                <p className="font-semibold">
                  {new Date(report.period.start).toLocaleDateString("ar-SA")} -{" "}
                  {new Date(report.period.end).toLocaleDateString("ar-SA")}
                </p>
              </div>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-success/10">
              <p className="text-sm text-default-500 mb-1">إجمالي الدخل</p>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(report.summary.total_income)}
              </p>
              <p className="text-xs text-default-400 mt-1">
                {report.summary.services_count} خدمة
              </p>
            </Card>

            <Card className="p-6 bg-danger/10">
              <p className="text-sm text-default-500 mb-1">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-danger">
                {formatCurrency(report.summary.total_expenses + report.summary.constants_total)}
              </p>
              <p className="text-xs text-default-400 mt-1">
                شامل الثوابت والمصروفات
              </p>
            </Card>

            <Card className={`p-6 ${report.summary.net_profit >= 0 ? "bg-primary/10" : "bg-warning/10"}`}>
              <p className="text-sm text-default-500 mb-1">صافي الربح</p>
              <p className={`text-2xl font-bold ${report.summary.net_profit >= 0 ? "text-primary" : "text-warning"}`}>
                {formatCurrency(report.summary.net_profit)}
              </p>
            </Card>
          </div>

          {/* Employee Income Table */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">دخل الموظفين</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">الاسم</th>
                    <th className="text-right p-3">الدور</th>
                    <th className="text-right p-3">المجال</th>
                    <th className="text-right p-3">المكتسب</th>
                    <th className="text-right p-3">المسحوب</th>
                    <th className="text-right p-3">الرصيد</th>
                    <th className="text-right p-3">عدد المهام</th>
                    <th className="text-right p-3 print:hidden">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {report.employee_incomes.map((emp) => (
                    <tr key={emp.emp_id} className="border-b hover:bg-default-50">
                      <td className="p-3 font-medium">{emp.emp_name}</td>
                      <td className="p-3">{emp.role || "-"}</td>
                      <td className="p-3">{emp.field || "-"}</td>
                      <td className="p-3 text-success">{formatCurrency(emp.total_earned)}</td>
                      <td className="p-3 text-danger">{formatCurrency(emp.total_withdrawn)}</td>
                      <td className="p-3 font-semibold">{formatCurrency(emp.balance)}</td>
                      <td className="p-3">{emp.tasks_count}</td>
                      <td className="p-3 print:hidden">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onPress={() => {
                            globalThis.open(
                              `/admin/dashboard/reports/employee-income?emp_id=${emp.emp_id}&month=${selectedMonth}`,
                              "_blank"
                            );
                          }}
                        >
                          التفاصيل
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold bg-default-100">
                    <td colSpan={3} className="p-3">الإجمالي</td>
                    <td className="p-3 text-success">
                      {formatCurrency(report.employee_incomes.reduce((s, e) => s + e.total_earned, 0))}
                    </td>
                    <td className="p-3 text-danger">
                      {formatCurrency(report.employee_incomes.reduce((s, e) => s + e.total_withdrawn, 0))}
                    </td>
                    <td className="p-3">
                      {formatCurrency(report.employee_incomes.reduce((s, e) => s + e.balance, 0))}
                    </td>
                    <td className="p-3">
                      {report.employee_incomes.reduce((s, e) => s + e.tasks_count, 0)}
                    </td>
                    <td className="print:hidden"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Constants (Fixed Expenses) */}
          {report.constants.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">المصروفات الثابتة</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-3">الاسم</th>
                      <th className="text-right p-3">القيمة</th>
                      <th className="text-right p-3">التكرار</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.constants.map((constant) => (
                      <tr key={constant.const_id} className="border-b">
                        <td className="p-3">{constant.const_name}</td>
                        <td className="p-3">{formatCurrency(constant.const_value)}</td>
                        <td className="p-3">{constant.repetation}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-default-100">
                      <td className="p-3">الإجمالي</td>
                      <td className="p-3">{formatCurrency(report.summary.constants_total)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {!report && !isLoading && !error && (
        <Card className="p-12 text-center">
          <p className="text-default-500">اختر صالون وشهر لعرض التقرير</p>
        </Card>
      )}
    </div>
  );
}
