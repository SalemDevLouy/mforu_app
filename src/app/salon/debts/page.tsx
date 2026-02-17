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
  const [activeTab, setActiveTab] = useState<"debts" | "expenses" | "history">("debts");
  
  // Debts state
  const [debtFormData, setDebtFormData] = useState({
    debtorName: "",
    debtorPhone: "",
    amount: "",
    description: "",
    dueDate: "",
    notes: "",
  });

  // Expenses state
  const [expenseFormData, setExpenseFormData] = useState({
    expenseType: "",
    amount: "",
    description: "",
    date: "",
    paymentMethod: "",
    notes: "",
  });

  // Mock data for debts history
  const [debtsHistory] = useState([
    {
      id: 1,
      debtorName: "أحمد محمد",
      debtorPhone: "0123456789",
      amount: "500",
      description: "خدمات متعددة",
      dueDate: "2026-02-15",
      status: "معلق",
      date: "2026-01-28",
    },
    {
      id: 2,
      debtorName: "سارة أحمد",
      debtorPhone: "0198765432",
      amount: "300",
      description: "صبغة وتسريحة",
      dueDate: "2026-02-10",
      status: "معلق",
      date: "2026-01-25",
    },
    {
      id: 3,
      debtorName: "محمد علي",
      debtorPhone: "0111222333",
      amount: "200",
      description: "قص شعر",
      dueDate: "2026-01-30",
      status: "مدفوع",
      date: "2026-01-20",
    },
  ]);

  // Mock data for expenses history
  const [expensesHistory] = useState([
    {
      id: 1,
      expenseType: "مواد تجميل",
      amount: "1500",
      description: "شامبو وكريمات",
      date: "2026-01-30",
      paymentMethod: "نقدي",
    },
    {
      id: 2,
      expenseType: "إيجار",
      amount: "5000",
      description: "إيجار شهر فبراير",
      date: "2026-02-01",
      paymentMethod: "تحويل بنكي",
    },
    {
      id: 3,
      expenseType: "كهرباء",
      amount: "800",
      description: "فاتورة الكهرباء",
      date: "2026-01-28",
      paymentMethod: "نقدي",
    },
    {
      id: 4,
      expenseType: "صيانة",
      amount: "350",
      description: "إصلاح كرسي",
      date: "2026-01-26",
      paymentMethod: "نقدي",
    },
  ]);

  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Debt Data:", debtFormData);
    // Reset form
    setDebtFormData({
      debtorName: "",
      debtorPhone: "",
      amount: "",
      description: "",
      dueDate: "",
      notes: "",
    });
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Expense Data:", expenseFormData);
    // Reset form
    setExpenseFormData({
      expenseType: "",
      amount: "",
      description: "",
      date: "",
      paymentMethod: "",
      notes: "",
    });
  };

  // Calculate totals
  const totalDebts = useMemo(() => {
    return debtsHistory
      .filter((debt) => debt.status === "معلق")
      .reduce((sum, debt) => sum + parseFloat(debt.amount || "0"), 0);
  }, [debtsHistory]);

  const totalExpenses = useMemo(() => {
    return expensesHistory.reduce(
      (sum, expense) => sum + parseFloat(expense.amount || "0"),
      0
    );
  }, [expensesHistory]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">الديون والمصاريف</h1>
        <p className="text-default-500">إدارة الديون والمصاريف اليومية</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-default-200">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "debts"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("debts")}
        >
          تسجيل دين
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "expenses"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("expenses")}
        >
          تسجيل مصروف
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "history"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("history")}
        >
          السجلات
        </button>
      </div>

      {/* Register Debt Tab */}
      {activeTab === "debts" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">تسجيل دين جديد</h2>
          <form onSubmit={handleDebtSubmit} className="space-y-6">
            {/* Debtor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-default-700">
                معلومات المدين
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    اسم المدين <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={debtFormData.debtorName}
                    onChange={(e) =>
                      setDebtFormData({ ...debtFormData, debtorName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    رقم الهاتف <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={debtFormData.debtorPhone}
                    onChange={(e) =>
                      setDebtFormData({ ...debtFormData, debtorPhone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Debt Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-default-700">
                تفاصيل الدين
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    المبلغ <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={debtFormData.amount}
                    onChange={(e) =>
                      setDebtFormData({ ...debtFormData, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    تاريخ الاستحقاق <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={debtFormData.dueDate}
                    onChange={(e) =>
                      setDebtFormData({ ...debtFormData, dueDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  الوصف <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={debtFormData.description}
                  onChange={(e) =>
                    setDebtFormData({ ...debtFormData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  ملاحظات
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  value={debtFormData.notes}
                  onChange={(e) =>
                    setDebtFormData({ ...debtFormData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" color="primary" className="px-8">
                حفظ الدين
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Register Expense Tab */}
      {activeTab === "expenses" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">تسجيل مصروف جديد</h2>
          <form onSubmit={handleExpenseSubmit} className="space-y-6">
            {/* Expense Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-default-700">
                تفاصيل المصروف
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    نوع المصروف <span className="text-danger">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={expenseFormData.expenseType}
                    onChange={(e) =>
                      setExpenseFormData({ ...expenseFormData, expenseType: e.target.value })
                    }
                    required
                  >
                    <option value="">اختر نوع المصروف</option>
                    <option value="إيجار">إيجار</option>
                    <option value="رواتب">رواتب</option>
                    <option value="مواد تجميل">مواد تجميل</option>
                    <option value="كهرباء">كهرباء</option>
                    <option value="ماء">ماء</option>
                    <option value="صيانة">صيانة</option>
                    <option value="معدات">معدات</option>
                    <option value="تسويق">تسويق</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    المبلغ <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={expenseFormData.amount}
                    onChange={(e) =>
                      setExpenseFormData({ ...expenseFormData, amount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    التاريخ <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={expenseFormData.date}
                    onChange={(e) =>
                      setExpenseFormData({ ...expenseFormData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    طريقة الدفع <span className="text-danger">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={expenseFormData.paymentMethod}
                    onChange={(e) =>
                      setExpenseFormData({ ...expenseFormData, paymentMethod: e.target.value })
                    }
                    required
                  >
                    <option value="">اختر طريقة الدفع</option>
                    <option value="نقدي">نقدي</option>
                    <option value="تحويل بنكي">تحويل بنكي</option>
                    <option value="بطاقة ائتمان">بطاقة ائتمان</option>
                    <option value="شيك">شيك</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  الوصف <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={expenseFormData.description}
                  onChange={(e) =>
                    setExpenseFormData({ ...expenseFormData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  ملاحظات
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  value={expenseFormData.notes}
                  onChange={(e) =>
                    setExpenseFormData({ ...expenseFormData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" color="primary" className="px-8">
                حفظ المصروف
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي الديون المعلقة</p>
                  <p className="text-2xl font-bold text-danger">{totalDebts} ج.م</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">إجمالي المصاريف</p>
                  <p className="text-2xl font-bold text-warning">{totalExpenses} ج.م</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Debts Table */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">سجل الديون</h2>
            <div className="overflow-x-auto">
              <Table aria-label="جدول الديون">
                <TableHeader>
                  <TableColumn>اسم المدين</TableColumn>
                  <TableColumn>رقم الهاتف</TableColumn>
                  <TableColumn>المبلغ</TableColumn>
                  <TableColumn>الوصف</TableColumn>
                  <TableColumn>تاريخ الاستحقاق</TableColumn>
                  <TableColumn>الحالة</TableColumn>
                  <TableColumn>التاريخ</TableColumn>
                </TableHeader>
                <TableBody>
                  {debtsHistory.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell>{debt.debtorName}</TableCell>
                      <TableCell>{debt.debtorPhone}</TableCell>
                      <TableCell>{debt.amount} ج.م</TableCell>
                      <TableCell>{debt.description}</TableCell>
                      <TableCell>{debt.dueDate}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            debt.status === "مدفوع"
                              ? "bg-success/20 text-success"
                              : "bg-danger/20 text-danger"
                          }`}
                        >
                          {debt.status}
                        </span>
                      </TableCell>
                      <TableCell>{debt.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Expenses Table */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">سجل المصاريف</h2>
            <div className="overflow-x-auto">
              <Table aria-label="جدول المصاريف">
                <TableHeader>
                  <TableColumn>نوع المصروف</TableColumn>
                  <TableColumn>المبلغ</TableColumn>
                  <TableColumn>الوصف</TableColumn>
                  <TableColumn>التاريخ</TableColumn>
                  <TableColumn>طريقة الدفع</TableColumn>
                </TableHeader>
                <TableBody>
                  {expensesHistory.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.expenseType}</TableCell>
                      <TableCell>{expense.amount} ج.م</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
