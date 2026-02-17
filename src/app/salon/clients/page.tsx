"use client";

import React, { useState } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

interface Client {
  client_id: string;
  name: string;
  phone?: string;
  notes?: string;
}

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    phone: "",
    notes: "",
  });

  // Mock data
  const [clients, setClients] = useState<Client[]>([
    {
      client_id: "1",
      name: "أحمد محمد",
      phone: "0501234567",
      notes: "يفضل القص القصير",
    },
    {
      client_id: "2",
      name: "فاطمة علي",
      phone: "0559876543",
      notes: "حساسية من بعض المنتجات",
    },
    {
      client_id: "3",
      name: "سارة أحمد",
      phone: "0551112233",
      notes: "",
    },
    {
      client_id: "4",
      name: "خالد عبدالله",
      phone: "0544445566",
      notes: "عميل دائم",
    },
  ]);

  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.phone?.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      client_id: Date.now().toString(),
      name: formData.name || "",
      phone: formData.phone,
      notes: formData.notes,
    };
    setClients([...clients, newClient]);
    setFormData({ name: "", phone: "", notes: "" });
    setActiveTab("list");
    alert("تم إضافة العميل بنجاح!");
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العميل؟")) {
      setClients(clients.filter((client) => client.client_id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">إدارة العملاء</h1>
        <p className="text-default-500">عرض وإدارة بيانات العملاء</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-primary">{clients.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500">نتائج البحث</p>
              <p className="text-2xl font-bold text-success">{filteredClients.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-default-200">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "list"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("list")}
        >
          قائمة العملاء
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "add"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-900"
          }`}
          onClick={() => setActiveTab("add")}
        >
          إضافة عميل جديد
        </button>
      </div>

      {/* List Tab */}
      {activeTab === "list" && (
        <Card className="p-4 md:p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="البحث بالاسم أو رقم الهاتف..."
              className="w-full px-4 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <Table aria-label="جدول العملاء">
              <TableHeader>
                <TableColumn>الاسم</TableColumn>
                <TableColumn>رقم الهاتف</TableColumn>
                <TableColumn>الملاحظات</TableColumn>
                <TableColumn>الإجراءات</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.client_id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.phone || "—"}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {client.notes || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          className="text-danger hover:text-danger-600 text-sm"
                          onClick={() => handleDelete(client.client_id)}
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

          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-default-500">
              {searchQuery ? "لا توجد نتائج للبحث" : "لا يوجد عملاء حالياً"}
            </div>
          )}
        </Card>
      )}

      {/* Add Tab */}
      {activeTab === "add" && (
        <Card className="p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">إضافة عميل جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  الاسم <span className="text-danger">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="05xxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                الملاحظات
              </label>
              <textarea
                id="notes"
                className="w-full px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="أي ملاحظات خاصة بالعميل..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-6 py-2 border border-default-300 rounded-lg hover:bg-default-100 transition-colors"
                onClick={() => setFormData({ name: "", phone: "", notes: "" })}
              >
                إعادة تعيين
              </button>
              <Button type="submit" color="primary" className="px-8">
                إضافة عميل
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
