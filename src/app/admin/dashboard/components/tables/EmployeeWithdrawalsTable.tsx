import { MonthlyReport } from "../../types";

type Withdrawal = MonthlyReport["employee_incomes"][number]["withdrawals"][number];

interface EmployeeWithdrawalsTableProps {
  withdrawals: Withdrawal[];
  totalWithdrawn: number;
  formatCurrency: (amount: number) => string;
}

export default function EmployeeWithdrawalsTable({ withdrawals, totalWithdrawn, formatCurrency }: EmployeeWithdrawalsTableProps) {
  if (withdrawals.length === 0) return null;

  return (
    <div>
      <h4 className="font-semibold text-sm text-default-600 mb-3">
        السحوبات ({withdrawals.length})
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-default-200 bg-default-50">
              <th className="text-right p-2 text-xs font-semibold">التاريخ</th>
              <th className="text-right p-2 text-xs font-semibold">المبلغ</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.withdraw_id} className="border-b border-default-100 hover:bg-default-50">
                <td className="p-2 whitespace-nowrap">
                  {new Date(w.date).toLocaleDateString("ar-DZ")}
                </td>
                <td className="p-2 font-semibold text-danger">{formatCurrency(w.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-danger/5 font-bold">
              <td className="p-2">الإجمالي</td>
              <td className="p-2 text-danger">{formatCurrency(totalWithdrawn)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
