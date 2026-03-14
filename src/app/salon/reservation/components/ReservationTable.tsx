"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Reservation } from "../types";
import { RESERVATION_STATUSES, getStatusColor } from "../constants";

interface ReservationTableProps {
  readonly reservations: Reservation[];
  readonly loading: boolean;
  readonly onEdit: (r: Reservation) => void;
  readonly onDelete: (id: string) => void;
  readonly onStatusChange: (id: string, status: string) => void;
}

export function ReservationTable({
  reservations,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}: ReservationTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table aria-label="جدول الحجوزات">
        <TableHeader>
          <TableColumn>اسم العميل</TableColumn>
          <TableColumn>رقم الهاتف</TableColumn>
          <TableColumn>تاريخ التسجيل</TableColumn>
          <TableColumn>موعد الحجز</TableColumn>
          <TableColumn>العربون</TableColumn>
          <TableColumn>الحالة</TableColumn>
          <TableColumn>الإجراءات</TableColumn>
        </TableHeader>
        <TableBody emptyContent={loading ? "جاري التحميل..." : "لا توجد حجوزات حالياً"}>
          {reservations.map((r) => (
            <TableRow key={r.reservation_id}>
              <TableCell className="font-medium">{r.client_name}</TableCell>
              <TableCell>{r.client_phone || "—"}</TableCell>
              <TableCell>
                {new Date(r.date_register).toLocaleDateString("ar-DZ", {
                  dateStyle: "short",
                })}
              </TableCell>
              <TableCell>
                {new Date(r.date_exploit).toLocaleDateString("ar-DZ", {
                  dateStyle: "short",
                })}
              </TableCell>
              <TableCell>
                {r.deposit > 0 ? `${r.deposit.toFixed(2)} دج` : "—"}
              </TableCell>
              <TableCell>
                <select
                  className={`px-3 py-1 rounded-full text-sm bg-${getStatusColor(r.status)}/10 text-${getStatusColor(r.status)} border-0`}
                  value={r.status}
                  onChange={(e) => onStatusChange(r.reservation_id, e.target.value)}
                >
                  {RESERVATION_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    className="text-primary hover:text-primary-600 text-sm"
                    onClick={() => onEdit(r)}
                  >
                    تعديل
                  </button>
                  <button
                    className="text-danger hover:text-danger-600 text-sm"
                    onClick={() => onDelete(r.reservation_id)}
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
  );
}
