"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Expense } from "../types";
import { getCategoryIcon } from "../constants";
import { HiCheckCircle, HiClock } from "react-icons/hi2";

interface ExpenseTableProps {
  readonly expenses: Expense[];
  readonly loading: boolean;
  readonly onEdit: (expense: Expense) => void;
  readonly onDelete: (id: string) => void;
}

export function ExpenseTable({
  expenses,
  loading,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table aria-label="جدول المصروفات">
        <TableHeader>
          <TableColumn>التاريخ</TableColumn>
          <TableColumn>النوع</TableColumn>
          <TableColumn>الوصف / البيان</TableColumn>
          <TableColumn>المبلغ</TableColumn>
          <TableColumn>الحالة</TableColumn>
          <TableColumn>الإجراءات</TableColumn>
        </TableHeader>
        <TableBody emptyContent={loading ? "جاري التحميل..." : "لا توجد مصروفات"}>
          {expenses.map((expense) => (
            <TableRow key={expense.exp_id}>
              <TableCell className="text-sm text-gray-600">
                {new Date(expense.date).toLocaleDateString("ar-DZ")}
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1.5 font-medium">
                  {(() => {
                    const CategoryIcon = getCategoryIcon(expense.exp_type);
                    return <CategoryIcon />;
                  })()}
                  <span>{expense.exp_type}</span>
                </span>
              </TableCell>
              <TableCell className="max-w-50">
                <span className="text-sm text-gray-600 truncate block">
                  {expense.description || "—"}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-red-600">
                  {expense.exp_val.toFixed(2)} دج
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    expense.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {expense.status === "paid" ? <HiCheckCircle /> : <HiClock />}
                  {expense.status === "paid" ? "مدفوع" : "معلّق"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => onEdit(expense)}
                  >
                    تعديل
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                    onClick={() => onDelete(expense.exp_id)}
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
