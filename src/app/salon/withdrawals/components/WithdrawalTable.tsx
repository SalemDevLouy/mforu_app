"use client";
import { Card } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Withdrawal } from "../types";

interface WithdrawalTableProps {
  readonly withdrawals: Withdrawal[];
  readonly loading: boolean;
  readonly onDelete: (id: string) => void;
  readonly onEdit: (withdrawal: Withdrawal) => void;
}

export function WithdrawalTable({
  withdrawals,
  loading,
  onDelete,
  onEdit,
}: WithdrawalTableProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="overflow-x-auto">
        <Table aria-label="جدول السحوبات">
          <TableHeader>
            <TableColumn>اسم الموظف</TableColumn>
            <TableColumn>المبلغ</TableColumn>
            <TableColumn>التاريخ</TableColumn>
            <TableColumn>الملاحظات</TableColumn>
            <TableColumn>تم بواسطة</TableColumn>
            <TableColumn>الإجراءات</TableColumn>
          </TableHeader>
          <TableBody emptyContent="لا توجد سحوبات حالياً">
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.withdraw_id}>
                  <TableCell className="font-medium">
                    {withdrawal.emp_name}
                  </TableCell>
                  <TableCell className="text-danger font-semibold">
                    {withdrawal.amount.toFixed(2)} دج
                  </TableCell>
                  <TableCell>
                    {new Date(withdrawal.date).toLocaleDateString("ar-DZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{withdrawal.notes || "—"}</TableCell>
                  <TableCell>{withdrawal.salon_name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        className="text-primary hover:text-primary-600 text-sm font-medium"
                        onClick={() => onEdit(withdrawal)}
                      >
                        تعديل
                      </button>
                      <button
                        className="text-danger hover:text-danger-600 text-sm font-medium"
                        onClick={() => onDelete(withdrawal.withdraw_id)}
                      >
                        حذف
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
