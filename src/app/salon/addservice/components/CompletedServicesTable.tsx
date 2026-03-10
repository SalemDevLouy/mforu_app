"use client";
import React from "react";
import { Card } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "@heroui/table";
import { CompletedService } from "../types";

interface CompletedServicesTableProps {
  completedServices: CompletedService[];
  loadingCompleted: boolean;
  todayTotal: number;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export default function CompletedServicesTable({
  completedServices,
  loadingCompleted,
  todayTotal,
  selectedDate,
  setSelectedDate,
}: CompletedServicesTableProps) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-medium">الخدمات المكتملة</h2>
              <p className="text-sm text-gray-500">
                {new Date(selectedDate).toLocaleDateString("ar-DZ", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <div className="text-right">
                <p className="text-sm text-gray-500">إجمالي اليوم</p>
                <p className="text-xl font-bold text-green-600">
                  {todayTotal.toFixed(2)} دج
                </p>
              </div>
            </div>
          </div>

          {loadingCompleted ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              جاري التحميل...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableColumn>العميل</TableColumn>
                <TableColumn>الخدمات</TableColumn>
                <TableColumn>الموظفون</TableColumn>
                <TableColumn>الوقت</TableColumn>
                <TableColumn>الإجمالي</TableColumn>
                <TableColumn>ملاحظات</TableColumn>
              </TableHeader>
              <TableBody>
                {completedServices.map((service) => (
                  <TableRow key={service.service_id}>
                    <TableCell>
                      <div className="font-medium">{service.client_name}</div>
                      {service.client_phone && (
                        <div className="text-xs text-gray-500">
                          {service.client_phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.employees.map((emp) => (
                          <span
                            key={emp}
                            className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            {emp}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(service.date).toLocaleTimeString("ar-DZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-700">
                        {service.price_total.toFixed(2)} دج
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {service.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loadingCompleted && completedServices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              لا توجد خدمات مسجّلة في هذا اليوم
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
