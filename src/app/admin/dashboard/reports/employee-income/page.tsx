"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { useAuth } from "@/hooks/useAuth";
import { HiChartBar, HiPrinter } from "react-icons/hi2";

interface EmployeeIncomeReport {
  employee: {
    emp_id: string;
    emp_name: string;
    role: string | null;
    field: string | null;
    salon: {
      name: string;
      site: string;
    };
  };
  period: {
    start: string;
    end: string;
    month: string;
  };
  summary: {
    total_earned: number;
    total_withdrawn: number;
    balance: number;
    tasks_count: number;
    withdrawals_count: number;
  };
  tasks_by_category: Array<{
    category: string;
    count: number;
    total: number;
    tasks: Array<{
      task_id: string;
      amount: number;
      date: string;
      client: string | null;
      client_phone: string | null;
    }>;
  }>;
  all_tasks: Array<{
    task_id: string;
    amount: number;
    category: string | null;
    client: string | null;
    client_phone: string | null;
    date: string;
  }>;
  withdrawals: Array<{
    withdraw_id: string;
    amount: number;
    date: string;
  }>;
}

export default function EmployeeIncomePage() {
  useAuth(["admin of system", "accounting man"]);

  const searchParams = useSearchParams();
  const empId = searchParams.get("emp_id");
  const month = searchParams.get("month");

  const [report, setReport] = useState<EmployeeIncomeReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    if (!empId || !month) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/reports/employee-income-detail?emp_id=${empId}&month=${month}`
      );
      if (!response.ok) throw new Error("Failed to fetch employee report");
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch report");
      console.error("Error fetching report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (empId && month) {
      fetchReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empId, month]);

  const handlePrint = () => {
    globalThis.print();
  };

  const handleExportCSV = () => {
    if (!report) return;

    let csv = "Employee Income Report\n\n";
    csv += `Employee,${report.employee.emp_name}\n`;
    csv += `Role,${report.employee.role || "N/A"}\n`;
    csv += `Field,${report.employee.field || "N/A"}\n`;
    csv += `Salon,${report.employee.salon.name}\n`;
    csv += `Location,${report.employee.salon.site}\n`;
    csv += `Period,${new Date(report.period.start).toLocaleDateString()} - ${new Date(report.period.end).toLocaleDateString()}\n\n`;

    csv += "Summary\n";
    csv += `Total Earned,${report.summary.total_earned}\n`;
    csv += `Total Withdrawn,${report.summary.total_withdrawn}\n`;
    csv += `Balance,${report.summary.balance}\n`;
    csv += `Tasks Count,${report.summary.tasks_count}\n`;
    csv += `Withdrawals Count,${report.summary.withdrawals_count}\n\n`;

    csv += "Tasks\n";
    csv += "Date,Category,Client,Phone,Amount\n";
    report.all_tasks.forEach((task) => {
      csv += `${new Date(task.date).toLocaleDateString()},${task.category || "N/A"},${task.client || "N/A"},${task.client_phone || "N/A"},${task.amount}\n`;
    });

    csv += "\nWithdrawals\n";
    csv += "Date,Amount\n";
    report.withdrawals.forEach((w) => {
      csv += `${new Date(w.date).toLocaleDateString()},${w.amount}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `employee-income-${report.employee.emp_name}-${month}.csv`;
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-danger/10 border border-danger">
        <p className="text-danger">{error}</p>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="p-12 text-center">
        <p className="text-default-500">لم يتم العثور على بيانات</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">تقرير دخل الموظف</h1>
          <p className="text-default-500">التفاصيل الكاملة لدخل الموظف</p>
        </div>
        <div className="flex gap-3">
          <Button color="default" variant="bordered" onPress={handlePrint} startContent={<HiPrinter />}>
            طباعة
          </Button>
          <Button color="default" variant="bordered" onPress={handleExportCSV} startContent={<HiChartBar />}>
            تصدير CSV
          </Button>
        </div>
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">تقرير دخل الموظف</h1>
        <p className="text-lg">{report.employee.salon.name}</p>
      </div>

      {/* Employee Info */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">معلومات الموظف</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-default-500">الاسم</p>
            <p className="font-semibold">{report.employee.emp_name}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">الدور</p>
            <p className="font-semibold">{report.employee.role || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">المجال</p>
            <p className="font-semibold">{report.employee.field || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">الصالون</p>
            <p className="font-semibold">{report.employee.salon.name}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">الموقع</p>
            <p className="font-semibold">{report.employee.salon.site}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-success/10">
          <p className="text-sm text-default-500 mb-1">إجمالي المكتسب</p>
          <p className="text-2xl font-bold text-success">
            {formatCurrency(report.summary.total_earned)}
          </p>
          <p className="text-xs text-default-400 mt-1">
            {report.summary.tasks_count} مهمة
          </p>
        </Card>

        <Card className="p-6 bg-danger/10">
          <p className="text-sm text-default-500 mb-1">إجمالي المسحوب</p>
          <p className="text-2xl font-bold text-danger">
            {formatCurrency(report.summary.total_withdrawn)}
          </p>
          <p className="text-xs text-default-400 mt-1">
            {report.summary.withdrawals_count} سحب
          </p>
        </Card>

        <Card className={`p-6 ${report.summary.balance >= 0 ? "bg-primary/10" : "bg-warning/10"}`}>
          <p className="text-sm text-default-500 mb-1">الرصيد</p>
          <p className={`text-2xl font-bold ${report.summary.balance >= 0 ? "text-primary" : "text-warning"}`}>
            {formatCurrency(report.summary.balance)}
          </p>
        </Card>

        <Card className="p-6 bg-default-100">
          <p className="text-sm text-default-500 mb-1">معدل الكسب</p>
          <p className="text-2xl font-bold">
            {report.summary.tasks_count > 0
              ? formatCurrency(report.summary.total_earned / report.summary.tasks_count)
              : formatCurrency(0)}
          </p>
          <p className="text-xs text-default-400 mt-1">لكل مهمة</p>
        </Card>
      </div>

      {/* Tasks by Category */}
      {report.tasks_by_category.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">المهام حسب الفئة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.tasks_by_category.map((cat) => (
              <Card key={cat.category || "uncategorized"} className="p-4 bg-default-50">
                <p className="text-sm text-default-500">{cat.category || "غير محدد"}</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(cat.total)}</p>
                <p className="text-xs text-default-400 mt-1">{cat.count} مهمة</p>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* All Tasks */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">جميع المهام ({report.all_tasks.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right p-3">التاريخ</th>
                <th className="text-right p-3">الفئة</th>
                <th className="text-right p-3">العميل</th>
                <th className="text-right p-3">الهاتف</th>
                <th className="text-right p-3">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {report.all_tasks.map((task) => (
                <tr key={task.task_id} className="border-b hover:bg-default-50">
                  <td className="p-3">
                    {new Date(task.date).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="p-3">{task.category || "-"}</td>
                  <td className="p-3">{task.client || "-"}</td>
                  <td className="p-3" dir="ltr">{task.client_phone || "-"}</td>
                  <td className="p-3 font-semibold text-success">
                    {formatCurrency(task.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-success/10">
                <td colSpan={4} className="p-3">الإجمالي</td>
                <td className="p-3 text-success">
                  {formatCurrency(report.summary.total_earned)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Withdrawals */}
      {report.withdrawals.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">السحوبات ({report.withdrawals.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">التاريخ</th>
                  <th className="text-right p-3">المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {report.withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.withdraw_id} className="border-b hover:bg-default-50">
                    <td className="p-3">
                      {new Date(withdrawal.date).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="p-3 font-semibold text-danger">
                      {formatCurrency(withdrawal.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold bg-danger/10">
                  <td className="p-3">الإجمالي</td>
                  <td className="p-3 text-danger">
                    {formatCurrency(report.summary.total_withdrawn)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* Print Footer */}
      <div className="hidden print:block text-center mt-8 pt-4 border-t">
        <p className="text-sm text-default-500">
          تم الطباعة في: {new Date().toLocaleDateString("ar-SA")} - {new Date().toLocaleTimeString("ar-SA")}
        </p>
      </div>
    </div>
  );
}
