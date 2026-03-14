"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { MonthlyReport } from "../../types";
import PageHeader from "../../components/Common/PageHeader";
import SummaryCards from "../../components/Cards/SummaryCards";
import GlobalTab from "../../components/Common/GlobalTab";
import EmployeesTab from "../../components/Common/EmployeesTab";
import { formatCurrency } from "./utils";
import { HiChartBar, HiUsers } from "react-icons/hi2";

export default function SalonReportPage({ params }: Readonly<{ params: Promise<{ salonId: string }> }>) {
  // Protect this page - only admin of system and accounting man can access
  useAuth(["admin of system", "accounting man"]);

  const router = useRouter();
  const [salonId, setSalonId] = useState<string>("");
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((p) => setSalonId(p.salonId));
  }, [params]);

  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(currentMonth);
  }, []);

  useEffect(() => {
    if (salonId && selectedMonth) {
      fetchSalonReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salonId, selectedMonth]);

  const fetchSalonReport = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/reports/monthly?salon_id=${salonId}&month=${selectedMonth}`
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to fetch salon report");
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError("فشل في تحميل تقرير الصالون");
      console.error("Error fetching salon report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!report) return [];
    if (selectedEmployee === "all") return report.employee_incomes;
    return report.employee_incomes.filter((e) => e.emp_id === selectedEmployee);
  }, [report, selectedEmployee]);

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
    <div className="space-y-6 print:space-y-4">
      <PageHeader
        salonName={report.salon.name}
        salonSite={report.salon.site}
        ownerName={report.salon.owner?.name}
        onBack={() => router.push("/admin/dashboard/accounting")}
      />

      <SummaryCards
        summary={report.summary}
        employeeCount={report.employee_incomes.length}
        formatCurrency={formatCurrency}
      />

      <Tabs
        aria-label="أقسام التقرير"
        color="primary"
        variant="underlined"
        classNames={{ tabList: "gap-6", cursor: "w-full", panel: "pt-4" }}
      >
        <Tab
          key="global"
          title={
            <div className="flex items-center gap-2">
              <HiChartBar />
              <span>التقرير الشامل</span>
            </div>
          }
        >
          <GlobalTab
            report={report}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onPrint={() => globalThis.print()}
          />
        </Tab>

        <Tab
          key="employees"
          title={
            <div className="flex items-center gap-2">
              <HiUsers />
              <span>دخل الموظفين</span>
            </div>
          }
        >
          <EmployeesTab
            report={report}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedEmployee={selectedEmployee}
            onEmployeeChange={setSelectedEmployee}
            filteredEmployees={filteredEmployees}
          />
        </Tab>
      </Tabs>

      {/* Print Footer */}
      <div className="hidden print:block text-center mt-8 pt-4 border-t">
        <p className="text-sm text-default-500">
          تم الطباعة في: {new Date().toLocaleDateString("ar-DZ")} — {new Date().toLocaleTimeString("ar-DZ")}
        </p>
      </div>
    </div>
  );
}
