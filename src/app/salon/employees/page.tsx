"use client";

import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"add" | "all">("add");
  
  // Employee form state
  const [employeeFormData, setEmployeeFormData] = useState({
    emp_name: "",
    role: "",
    field: "",
  });

  // Mock data for all employees
  const [employees] = useState([
    {
      emp_id: "1",
      emp_name: "علي محمد",
      role: "حلاق",
      field: "قص شعر",
    },
    {
      emp_id: "2",
      emp_name: "فاطمة أحمد",
      role: "خبيرة تجميل",
      field: "مكياج",
    },
    {
      emp_id: "3",
      emp_name: "محمد علي",
      role: "حلاق",
      field: "حلاقة ذقن",
    },
    {
      emp_id: "4",
      emp_name: "سارة حسن",
      role: "خبيرة صبغة",
      field: "صبغ شعر",
    },
    {
      emp_id: "5",
      emp_name: "أحمد كمال",
      role: "مساعد",
      field: "عام",
    },
  ]);

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Employee Data:", employeeFormData);
    // Reset form
    setEmployeeFormData({
      emp_name: "",
      role: "",
      field: "",
    });
    alert("تم إضافة الموظف بنجاح!");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">إدارة الموظفين</h1>
        <p className="text-default-500">إضافة وإدارة موظفي الصالون</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي الموظفين</p>
              <p className="text-2xl font-bold text-primary">{employees.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">التخصصات</p>
              <p className="text-2xl font-bold text-success">
                {new Set(employees.map(emp => emp.field)).size}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-default-200">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "add"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("add")}
        >
          إضافة موظف
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "all"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("all")}
        >
          جميع الموظفين
        </button>
      </div>

      {/* Add Employee Tab */}
      {activeTab === "add" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">إضافة موظف جديد</h2>
          <form onSubmit={handleEmployeeSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="emp_name" className="block text-sm font-medium mb-2">
                    اسم الموظف <span className="text-danger">*</span>
                  </label>
                  <input
                    id="emp_name"
                    type="text"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={employeeFormData.emp_name}
                    onChange={(e) =>
                      setEmployeeFormData({ ...employeeFormData, emp_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-2">
                    الدور <span className="text-danger">*</span>
                  </label>
                  <input
                    id="role"
                    type="text"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={employeeFormData.role}
                    onChange={(e) =>
                      setEmployeeFormData({ ...employeeFormData, role: e.target.value })
                    }
                    required
                    placeholder="مثال: حلاق، خبير تجميل"
                  />
                </div>
                <div>
                  <label htmlFor="field" className="block text-sm font-medium mb-2">
                    المجال <span className="text-danger">*</span>
                  </label>
                  <input
                    id="field"
                    type="text"
                    className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={employeeFormData.field}
                    onChange={(e) =>
                      setEmployeeFormData({ ...employeeFormData, field: e.target.value })
                    }
                    required
                    placeholder="مثال: قص شعر، مكياج"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-6 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors"
                onClick={() => {
                  setEmployeeFormData({
                    emp_name: "",
                    role: "",
                    field: "",
                  });
                }}
              >
                إعادة تعيين
              </button>
              <Button type="submit" color="primary" className="px-8">
                إضافة موظف
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* All Employees Tab */}
      {activeTab === "all" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">جميع الموظفين</h2>
          <div className="overflow-x-auto">
            <Table aria-label="جدول الموظفين">
              <TableHeader>
                <TableColumn>الاسم</TableColumn>
                <TableColumn>الدور</TableColumn>
                <TableColumn>المجال</TableColumn>
                <TableColumn>الإجراءات</TableColumn>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.emp_id}>
                    <TableCell className="font-medium">{employee.emp_name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.field}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          className="text-primary hover:text-primary-600 text-sm"
                          onClick={() => console.log("Edit employee", employee.emp_id)}
                        >
                          تعديل
                        </button>
                        <button
                          className="text-danger hover:text-danger-600 text-sm"
                          onClick={() => console.log("Delete employee", employee.emp_id)}
                        >
                          حذف
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
