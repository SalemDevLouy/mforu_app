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
  const [activeTab, setActiveTab] = useState<"add" | "completed">("add");
  
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const [tasks, setTasks] = useState<
    Array<{ id: number; serviceName: string; duration: string; price: string; employeeName: string }>
  >([{ id: 1, serviceName: "", duration: "", price: "", employeeName: "" }]);

  // Mock data for completed services today
  const [completedServices] = useState([
    {
      id: 1,
      clientName: "أحمد محمد",
      serviceName: "قص شعر",
      employeeName: "علي",
      price: "50",
      time: "10:00",
      status: "مكتمل",
    },
    {
      id: 2,
      clientName: "سارة أحمد",
      serviceName: "صبغة",
      employeeName: "فاطمة",
      price: "150",
      time: "11:30",
      status: "مكتمل",
    },
    {
      id: 3,
      clientName: "محمد علي",
      serviceName: "حلاقة ذقن",
      employeeName: "علي",
      price: "30",
      time: "14:00",
      status: "مكتمل",
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = () => {
    setTasks((prev) => [...prev, { id: Date.now(), serviceName: "", duration: "", price: "", employeeName: "" }]);
  };

  const removeTask = (id: number) => {
    if (tasks.length > 1) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleTaskChange = (id: number, field: string, value: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const getTotalPrice = () => {
    return tasks.reduce((sum, task) => sum + (Number.parseFloat(task.price) || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just log the payload. In a real app you would POST to an API route.
    console.log("Service registration:", { ...formData, tasks, totalPrice: getTotalPrice() });
    alert("تم تسجيل الخدمة بنجاح - Service registered successfully");
  };

  const getTodayTotal = () => {
    return completedServices.reduce((sum, service) => sum + Number.parseFloat(service.price), 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">إدارة الخدمات</h1>
        <p className="text-gray-600">إضافة خدمة جديدة أو عرض الخدمات المكتملة</p>
      </div>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("add")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "add"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            إضافة خدمة جديدة
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "completed"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            الخدمات المكتملة اليوم
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "add" && (
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Information Section */}
        <Card>
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-medium">معلومات العميل</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex flex-col">
                <span className="text-sm mb-1">اسم العميل *</span>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل اسم العميل"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm mb-1">رقم الهاتف *</span>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="05xxxxxxxx"
                  required
                />
              </label>

            </div>
          </div>
        </Card>

        {/* Service Details Section - Multiple Tasks */}
        <Card>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">تفاصيل الخدمات</h2>
              <button
                type="button"
                onClick={addTask}
                className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50"
              >
                إضافة خدمة
              </button>
            </div>
            
            <Table>
              <TableHeader>
                <TableColumn>اسم الخدمة *</TableColumn>
                <TableColumn>المدة (دقيقة) *</TableColumn>
                <TableColumn>السعر (ريال) *</TableColumn>
                <TableColumn>الموظف *</TableColumn>
                <TableColumn>إجراءات</TableColumn>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <input
                        type="text"
                        value={task.serviceName}
                        onChange={(e) => handleTaskChange(task.id, "serviceName", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="قص شعر، صبغة، الخ"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        value={task.duration}
                        onChange={(e) => handleTaskChange(task.id, "duration", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                        placeholder="60"
                        min="0"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        value={task.price}
                        onChange={(e) => handleTaskChange(task.id, "price", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                        placeholder="100"
                        min="0"
                        step="0.01"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={task.employeeName}
                        onChange={(e) => handleTaskChange(task.id, "employeeName", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="اسم الموظف"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        disabled={tasks.length === 1}
                        className="px-2 py-1 rounded text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        حذف
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="text-right">
              <strong>إجمالي الخدمات: </strong>
              <span>{getTotalPrice().toFixed(2)} ريال</span>
            </div>
          </div>
        </Card>



        {/* Summary and Submit */}
        <Card>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">الإجمالي</h3>
              <p className="text-2xl font-bold text-blue-600">
                {getTotalPrice().toFixed(2)} ريال
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    clientName: "",
                    clientPhone: "",
                    clientEmail: "",
                    appointmentDate: "",
                    appointmentTime: "",
                    notes: "",
                  });
                  setTasks([{ id: Date.now(), serviceName: "", duration: "", price: "", employeeName: "" }]);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
              >
                إعادة تعيين
              </button>
              <Button type="submit">
                تسجيل الخدمة
              </Button>
            </div>
          </div>
        </Card>
      </form>
      )}

      {/* Completed Services Tab */}
      {activeTab === "completed" && (
        <div className="space-y-6">
          <Card>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">الخدمات المكتملة - {new Date().toLocaleDateString("ar-SA")}</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">إجمالي اليوم</p>
                  <p className="text-2xl font-bold text-green-600">
                    {getTodayTotal()} ريال
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableColumn>اسم العميل</TableColumn>
                  <TableColumn>الخدمة</TableColumn>
                  <TableColumn>الموظف</TableColumn>
                  <TableColumn>الوقت</TableColumn>
                  <TableColumn>السعر</TableColumn>
                  <TableColumn>الحالة</TableColumn>
                </TableHeader>
                <TableBody>
                  {completedServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.clientName}</TableCell>
                      <TableCell>{service.serviceName}</TableCell>
                      <TableCell>{service.employeeName}</TableCell>
                      <TableCell>{service.time}</TableCell>
                      <TableCell>{service.price} ريال</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {service.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {completedServices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد خدمات مكتملة اليوم
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
