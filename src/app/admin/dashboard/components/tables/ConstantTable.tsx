"use client";

import React from "react";
import { Card } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Constant, Salon } from "../../constants/types";
import { getTypeIcon, getRepLabel, getRepBadge } from "../../constants/data";
import { HiBuildingStorefront, HiCheckCircle } from "react-icons/hi2";

interface SalonSummaryRow extends Salon {
  monthly: number;
  yearly:  number;
  count:   number;
}

interface ConstantTableProps {
  constants:       Constant[];
  salons:          Salon[];
  salonSummary:    SalonSummaryRow[];
  loading:         boolean;
  filterSalon:     string;
  filterStatus:    string;
  setFilterSalon:  (v: string) => void;
  setFilterStatus: (v: string) => void;
  onEdit:          (c: Constant) => void;
  onDelete:        (id: string) => void;
}

export default function ConstantTable({
  constants,
  salons,
  salonSummary,
  loading,
  filterSalon,
  filterStatus,
  setFilterSalon,
  setFilterStatus,
  onEdit,
  onDelete,
}: Readonly<ConstantTableProps>) {
  return (
    <>
      {/* Per-salon summary (only when showing all) */}
      {!filterSalon && salonSummary.length > 0 && (
        <Card className="p-4 md:p-5">
          <h2 className="text-base font-bold text-gray-700 mb-3">ملخص حسب الصالون</h2>
          <div className="overflow-x-auto">
            <Table aria-label="ملخص الصالونات">
              <TableHeader>
                <TableColumn>الصالون</TableColumn>
                <TableColumn>شهري (نشط)</TableColumn>
                <TableColumn>سنوي (نشط)</TableColumn>
                <TableColumn>عدد الثوابت</TableColumn>
              </TableHeader>
              <TableBody>
                {salonSummary.map((s) => (
                  <TableRow key={s.salon_id}>
                    <TableCell>
                      <button
                        className="text-blue-600 hover:underline text-sm font-medium"
                        onClick={() => setFilterSalon(s.salon_id)}
                      >
                        <span className="inline-flex items-center gap-1"><HiBuildingStorefront /> {s.name}</span>
                      </button>
                    </TableCell>
                    <TableCell className="text-green-700 font-semibold">{s.monthly.toFixed(2)} دج</TableCell>
                    <TableCell className="text-amber-700 font-semibold">{s.yearly.toFixed(2)} دج</TableCell>
                    <TableCell>{s.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Main Table */}
      <Card className="p-4 md:p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <select
            className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterSalon}
            onChange={(e) => setFilterSalon(e.target.value)}
          >
            <option value="">كل الصالونات</option>
            {salons.map((s) => (
              <option key={s.salon_id} value={s.salon_id}>{s.name}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
          {(filterSalon || filterStatus) && (
            <button
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
              onClick={() => { setFilterSalon(""); setFilterStatus(""); }}
            >× مسح الفلاتر</button>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table aria-label="جدول الثوابت">
            <TableHeader>
              <TableColumn>الصالون</TableColumn>
              <TableColumn>الاسم</TableColumn>
              <TableColumn>القيمة</TableColumn>
              <TableColumn>التكرار</TableColumn>
              <TableColumn>تاريخ البدء</TableColumn>
              <TableColumn>الحالة</TableColumn>
              <TableColumn>الإجراءات</TableColumn>
            </TableHeader>
            <TableBody emptyContent={loading ? "جاري التحميل..." : "لا توجد ثوابت مسجلة"}>
              {constants.map((c) => (
                <TableRow key={c.const_id}>
                  <TableCell className="text-sm text-gray-600">
                    {c.salon?.name ?? <span className="text-gray-400">—</span>}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 font-medium">
                      {(() => {
                        const TypeIcon = getTypeIcon(c.const_name);
                        return <TypeIcon />;
                      })()}
                      <span>{c.const_name}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-blue-700">{c.const_value.toFixed(2)} دج</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getRepBadge(c.repetation)}`}>
                      {getRepLabel(c.repetation)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(c.started_at).toLocaleDateString("ar-DZ")}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      c.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {c.status === "active" ? <HiCheckCircle /> : null}
                      {c.status === "active" ? "نشط" : "غير نشط"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => onEdit(c)}
                      >تعديل</button>
                      <button
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                        onClick={() => onDelete(c.const_id)}
                      >حذف</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
}
