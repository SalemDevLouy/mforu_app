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
  
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    depositAmount: "",
    exploitationDate: "",
    notes: "",
  });

  // Mock data for all reservations
  const [allReservations] = useState([
    {
      id: 1,
      clientName: "أحمد محمد",
      phone: "0501234567",
      email: "ahmed@email.com",
      depositAmount: "100",
      exploitationDate: "2026-02-05",
      createdAt: "2026-02-01",
      status: "مؤكد",
    },
    {
      id: 2,
      clientName: "سارة أحمد",
      phone: "0509876543",
      email: "sara@email.com",
      depositAmount: "150",
      exploitationDate: "2026-02-10",
      createdAt: "2026-01-30",
      status: "قيد الانتظار",
    },
    {
      id: 3,
      clientName: "محمد علي",
      phone: "0551234567",
      email: "",
      depositAmount: "200",
      exploitationDate: "2026-02-15",
      createdAt: "2026-01-28",
      status: "مؤكد",
    },
    {
      id: 4,
      clientName: "فاطمة خالد",
      phone: "0561234567",
      email: "fatima@email.com",
      depositAmount: "120",
      exploitationDate: "2026-02-20",
      createdAt: "2026-02-01",
      status: "مؤكد",
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reservation:", formData);
    alert("تم إنشاء الحجز بنجاح - Reservation created successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مؤكد":
        return "bg-green-100 text-green-800";
      case "قيد الانتظار":
        return "bg-yellow-100 text-yellow-800";
      case "ملغي":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">إدارة الحجوزات</h1>
        <p className="text-gray-600">إنشاء حجز جديد أو عرض حجوزات اليوم</p>
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
            حجز جديد
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            جميع الحجوزات
          </button>
        </nav>
      </div>

      {/* Tab Content - Add Reservation */}
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

                <label className="flex flex-col">
                  <span className="text-sm mb-1">البريد الإلكتروني</span>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Reservation Details Section */}
          <Card>
            <div className="p-4 space-y-4">
              <h2 className="text-lg font-medium">تفاصيل الحجز</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm mb-1">قيمة العربون (ريال) *</span>
                  <input
                    type="number"
                    name="depositAmount"
                    value={formData.depositAmount}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                    min="0"
                    step="0.01"
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm mb-1">تاريخ الاستغلال *</span>
                  <input
                    type="date"
                    name="exploitationDate"
                    value={formData.exploitationDate}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm mb-1">ملاحظات</span>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                    placeholder="أي ملاحظات أو تفاصيل إضافية"
                    rows={3}
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Summary and Submit */}
          <Card>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">العربون المطلوب</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formData.depositAmount ? `${formData.depositAmount} ريال` : "0 ريال"}
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
                      depositAmount: "",
                      exploitationDate: "",
                      notes: "",
                    });
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                >
                  إعادة تعيين
                </button>
                <Button type="submit">
                  إنشاء حجز
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}

      {/* Tab Content - All Reservations */}
      {activeTab === "all" && (
        <div className="space-y-6">
          <Card>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">جميع الحجوزات</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">إجمالي الحجوزات</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {allReservations.length}
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableColumn>اسم العميل</TableColumn>
                  <TableColumn>رقم الهاتف</TableColumn>
                  <TableColumn>البريد الإلكتروني</TableColumn>
                  <TableColumn>العربون</TableColumn>
                  <TableColumn>تاريخ الاستغلال</TableColumn>
                  <TableColumn>تاريخ الإنشاء</TableColumn>
                  <TableColumn>الحالة</TableColumn>
                </TableHeader>
                <TableBody>
                  {allReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.clientName}</TableCell>
                      <TableCell>{reservation.phone}</TableCell>
                      <TableCell>{reservation.email || "-"}</TableCell>
                      <TableCell>{reservation.depositAmount} ريال</TableCell>
                      <TableCell>{new Date(reservation.exploitationDate).toLocaleDateString("ar-SA")}</TableCell>
                      <TableCell>{new Date(reservation.createdAt).toLocaleDateString("ar-SA")}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {allReservations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد حجوزات
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
