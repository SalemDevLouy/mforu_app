"use client";

import React, { useState, useMemo } from "react";
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

export default function Page() {
  const [activeTab, setActiveTab] = useState<"daily" | "monthly" | "employees">("daily");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Mock data for daily report
  const dailyServices = useMemo(() => [
    {
      id: 1,
      time: "09:00",
      clientName: "أحمد محمد",
      serviceName: "قص شعر",
      employeeName: "علي",
      price: "50",
      status: "مكتمل",
    },
    {
      id: 2,
      time: "10:30",
      clientName: "سارة أحمد",
      serviceName: "صبغة",
      employeeName: "فاطمة",
      price: "150",
      status: "مكتمل",
    },
    {
      id: 3,
      time: "11:00",
      clientName: "محمد علي",
      serviceName: "حلاقة + تشذيب",
      employeeName: "علي",
      price: "70",
      status: "مكتمل",
    },
    {
      id: 4,
      time: "13:00",
      clientName: "ليلى حسن",
      serviceName: "تسريحة",
      employeeName: "فاطمة",
      price: "100",
      status: "مكتمل",
    },
    {
      id: 5,
      time: "14:30",
      clientName: "خالد سعيد",
      serviceName: "قص شعر",
      employeeName: "محمد",
      price: "50",
      status: "مكتمل",
    },
  ], []);

  const dailyExpenses = useMemo(() => [
    { id: 1, type: "مواد تجميل", amount: "200", description: "شامبو وكريمات" },
    { id: 2, type: "كهرباء", amount: "150", description: "فاتورة اليوم" },
    { id: 3, type: "أخرى", amount: "50", description: "مستلزمات تنظيف" },
  ], []);

  // Mock data for monthly report
  const monthlyData = {
    totalServices: 150,
    totalIncome: 25000,
    totalExpenses: 8000,
    netProfit: 17000,
    servicesBreakdown: [
      { service: "قص شعر", count: 60, income: 3000 },
      { service: "صبغة", count: 25, income: 6250 },
      { service: "تسريحة", count: 30, income: 4500 },
      { service: "حلاقة كاملة", count: 20, income: 4000 },
      { service: "مكياج", count: 15, income: 7250 },
    ],
    expensesBreakdown: [
      { type: "إيجار", amount: 5000 },
      { type: "رواتب", amount: 15000 },
      { type: "مواد تجميل", amount: 2000 },
      { type: "كهرباء وماء", amount: 1500 },
      { type: "صيانة", amount: 500 },
    ],
  };

  // Mock data for employee income
  const employeeIncomeData = [
    {
      id: 1,
      name: "علي محمد",
      position: "حلاق",
      servicesCount: 45,
      totalIncome: 7500,
      commission: 2250,
      salary: 3000,
      totalEarnings: 5250,
    },
    {
      id: 2,
      name: "فاطمة أحمد",
      position: "خبيرة تجميل",
      servicesCount: 38,
      totalIncome: 9500,
      commission: 2850,
      salary: 3500,
      totalEarnings: 6350,
    },
    {
      id: 3,
      name: "محمد علي",
      position: "حلاق",
      servicesCount: 42,
      totalIncome: 6300,
      commission: 1890,
      salary: 2800,
      totalEarnings: 4690,
    },
    {
      id: 4,
      name: "سارة حسن",
      position: "خبيرة صبغة",
      servicesCount: 25,
      totalIncome: 6250,
      commission: 1875,
      salary: 3200,
      totalEarnings: 5075,
    },
  ];

  // Calculate daily totals
  const dailyTotalIncome = useMemo(() => {
    return dailyServices.reduce(
      (sum, service) => sum + Number.parseFloat(service.price || "0"),
      0
    );
  }, [dailyServices]);

  const dailyTotalExpenses = useMemo(() => {
    return dailyExpenses.reduce(
      (sum, expense) => sum + Number.parseFloat(expense.amount || "0"),
      0
    );
  }, [dailyExpenses]);

  const dailyNetProfit = dailyTotalIncome - dailyTotalExpenses;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">التقارير</h1>
        <p className="text-default-500">عرض تقارير النشاط اليومي والشهري ودخل الموظفين</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-default-200 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "daily"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("daily")}
        >
          التقرير اليومي
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "monthly"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("monthly")}
        >
          التقرير الشهري
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === "employees"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("employees")}
        >
          دخل الموظفين
        </button>
      </div>

      {/* Daily Report Tab */}
      {activeTab === "daily" && (
        <div className="space-y-4">
          {/* Date Picker */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <label htmlFor="daily-date" className="block text-sm font-medium mb-2">اختر التاريخ</label>
                <input
                  id="daily-date"
                  type="date"
                  className="px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <Button color="primary" className="mt-6 md:mt-0">
                تصدير PDF
              </Button>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-success">{dailyTotalIncome} ج.م</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-2xl">💵</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي المصاريف</p>
                  <p className="text-2xl font-bold text-danger">{dailyTotalExpenses} ج.م</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                  <span className="text-2xl">💸</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">صافي الربح</p>
                  <p className="text-2xl font-bold text-primary">{dailyNetProfit} ج.م</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Services Table */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">
              الخدمات المقدمة ({dailyServices.length})
            </h2>
            <div className="overflow-x-auto">
              <Table aria-label="جدول الخدمات اليومية">
                <TableHeader>
                  <TableColumn>الوقت</TableColumn>
                  <TableColumn>اسم العميل</TableColumn>
                  <TableColumn>الخدمة</TableColumn>
                  <TableColumn>الموظف</TableColumn>
                  <TableColumn>السعر</TableColumn>
                  <TableColumn>الحالة</TableColumn>
                </TableHeader>
                <TableBody>
                  {dailyServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.time}</TableCell>
                      <TableCell>{service.clientName}</TableCell>
                      <TableCell>{service.serviceName}</TableCell>
                      <TableCell>{service.employeeName}</TableCell>
                      <TableCell>{service.price} ج.م</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-success/20 text-success">
                          {service.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Expenses Table */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">
              المصاريف اليومية ({dailyExpenses.length})
            </h2>
            <div className="overflow-x-auto">
              <Table aria-label="جدول المصاريف اليومية">
                <TableHeader>
                  <TableColumn>نوع المصروف</TableColumn>
                  <TableColumn>المبلغ</TableColumn>
                  <TableColumn>الوصف</TableColumn>
                </TableHeader>
                <TableBody>
                  {dailyExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.type}</TableCell>
                      <TableCell>{expense.amount} ج.م</TableCell>
                      <TableCell>{expense.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* Monthly Report Tab */}
      {activeTab === "monthly" && (
        <div className="space-y-4">
          {/* Month Picker */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <label htmlFor="monthly-report-month" className="block text-sm font-medium mb-2">اختر الشهر</label>
                <input
                  id="monthly-report-month"
                  type="month"
                  className="px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
              <Button color="primary" className="mt-6 md:mt-0">
                تصدير PDF
              </Button>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي الخدمات</p>
                  <p className="text-2xl font-bold text-primary">
                    {monthlyData.totalServices}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-success">
                    {monthlyData.totalIncome} ج.م
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-2xl">💵</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي المصاريف</p>
                  <p className="text-2xl font-bold text-danger">
                    {monthlyData.totalExpenses} ج.م
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                  <span className="text-2xl">💸</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">صافي الربح</p>
                  <p className="text-2xl font-bold text-warning">
                    {monthlyData.netProfit} ج.م
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Services Breakdown */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">تفصيل الخدمات</h2>
            <div className="overflow-x-auto">
              <Table aria-label="جدول تفصيل الخدمات">
                <TableHeader>
                  <TableColumn>الخدمة</TableColumn>
                  <TableColumn>عدد المرات</TableColumn>
                  <TableColumn>إجمالي الإيرادات</TableColumn>
                  <TableColumn>متوسط السعر</TableColumn>
                </TableHeader>
                <TableBody>
                  {monthlyData.servicesBreakdown.map((service) => (
                    <TableRow key={service.service}>
                      <TableCell className="font-medium">{service.service}</TableCell>
                      <TableCell>{service.count}</TableCell>
                      <TableCell>{service.income} ج.م</TableCell>
                      <TableCell>
                        {(service.income / service.count).toFixed(2)} ج.م
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Expenses Breakdown */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">تفصيل المصاريف</h2>
            <div className="overflow-x-auto">
              <Table aria-label="جدول تفصيل المصاريف">
                <TableHeader>
                  <TableColumn>نوع المصروف</TableColumn>
                  <TableColumn>المبلغ</TableColumn>
                  <TableColumn>النسبة من الإجمالي</TableColumn>
                </TableHeader>
                <TableBody>
                  {monthlyData.expensesBreakdown.map((expense) => (
                    <TableRow key={expense.type}>
                      <TableCell className="font-medium">{expense.type}</TableCell>
                      <TableCell>{expense.amount} ج.م</TableCell>
                      <TableCell>
                        {((expense.amount / monthlyData.totalExpenses) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* Employee Income Tab */}
      {activeTab === "employees" && (
        <div className="space-y-4">
          {/* Month Picker */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <label htmlFor="employee-month" className="block text-sm font-medium mb-2">اختر الشهر</label>
                <input
                  id="employee-month"
                  type="month"
                  className="px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
              <Button color="primary" className="mt-6 md:mt-0">
                تصدير PDF
              </Button>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي العمولات</p>
                  <p className="text-2xl font-bold text-success">
                    {employeeIncomeData.reduce((sum, emp) => sum + emp.commission, 0)} ج.م
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-2xl">💵</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي الرواتب</p>
                  <p className="text-2xl font-bold text-warning">
                    {employeeIncomeData.reduce((sum, emp) => sum + emp.salary, 0)} ج.م
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي المدفوعات</p>
                  <p className="text-2xl font-bold text-primary">
                    {employeeIncomeData.reduce((sum, emp) => sum + emp.totalEarnings, 0)} ج.م
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Employee Income Table */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">دخل الموظفين الشهري</h2>
            <div className="overflow-x-auto">
              <Table aria-label="جدول دخل الموظفين">
                <TableHeader>
                  <TableColumn>اسم الموظف</TableColumn>
                  <TableColumn>المسمى الوظيفي</TableColumn>
                  <TableColumn>عدد الخدمات</TableColumn>
                  <TableColumn>إجمالي الإيرادات</TableColumn>
                  <TableColumn>العمولة (30%)</TableColumn>
                  <TableColumn>الراتب الأساسي</TableColumn>
                  <TableColumn>الإجمالي</TableColumn>
                </TableHeader>
                <TableBody>
                  {employeeIncomeData.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.servicesCount}</TableCell>
                      <TableCell>{employee.totalIncome} ج.م</TableCell>
                      <TableCell className="text-success">
                        {employee.commission} ج.م
                      </TableCell>
                      <TableCell>{employee.salary} ج.م</TableCell>
                      <TableCell className="font-bold text-primary">
                        {employee.totalEarnings} ج.م
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Performance Info */}
          <Card className="p-4 md:p-6 bg-primary/5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold mb-2">ملاحظة</h3>
                <p className="text-sm text-default-600">
                  يتم احتساب العمولة بنسبة 30% من إجمالي إيرادات الخدمات التي قدمها الموظف.
                  الإجمالي النهائي هو مجموع العمولة والراتب الأساسي.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
