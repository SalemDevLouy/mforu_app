import { Card } from "@heroui/card";
import { MonthlyReport } from "../../types";
import { HiBanknotes } from "react-icons/hi2";

interface ExpensesTableProps {
  expenses: MonthlyReport["expenses"];
  totalExpenses: number;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

export default function ExpensesTable({ expenses, totalExpenses, formatCurrency, formatDate }: Readonly<ExpensesTableProps>) {
  if (expenses.length === 0) return null;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <HiBanknotes className="text-default-500" />
        <span>المصروفات ({expenses.length})</span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-right p-3">التاريخ</th>
              <th className="text-right p-3">النوع</th>
              <th className="text-right p-3">القيمة</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.exp_id} className="border-b hover:bg-default-50">
                <td className="p-3">{formatDate(expense.date)}</td>
                <td className="p-3">{expense.exp_type}</td>
                <td className="p-3 font-semibold text-danger">{formatCurrency(expense.exp_val)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-danger/10">
              <td colSpan={2} className="p-3">الإجمالي</td>
              <td className="p-3 text-danger">{formatCurrency(totalExpenses)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
