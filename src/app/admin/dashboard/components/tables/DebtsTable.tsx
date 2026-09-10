import { Card } from "@heroui/card";
import { MonthlyReport } from "../../types";
import { HiScale } from "react-icons/hi2";
import { sum } from "@/lib/math";

interface DebtsTableProps {
  debts: MonthlyReport["debts"];
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

export default function DebtsTable({ debts, formatCurrency, formatDate }: Readonly<DebtsTableProps>) {
  if (debts.length === 0) return null;

  const pendingDebts = debts.filter((debt) => debt.status === "pending");
  const credits = debts.filter((debt) => debt.status === "credit");
  const unpaidOnly = debts.filter(
    (debt) => debt.status === "pending" || debt.status === "credit"
  );

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <HiScale className="text-default-500" />
        <span>الديون والفكة ({debts.length})</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
          <p className="text-xs text-orange-700 mb-1">ديون على العملاء (غير محصلة)</p>
          <p className="text-xl font-bold text-orange-700">{formatCurrency(sum(pendingDebts.map((d) => d.debt_val)))}</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-xs text-amber-700 mb-1">فكة مستحقة للعملاء</p>
          <p className="text-xl font-bold text-amber-700">{formatCurrency(sum(credits.map((d) => d.debt_val)))}</p>
        </div>
      </div>

      {unpaidOnly.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right p-3">التاريخ</th>
                <th className="text-right p-3">العميل</th>
                <th className="text-right p-3">النوع</th>
                <th className="text-right p-3">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {unpaidOnly.map((debt) => (
                <tr key={debt.debt_id} className="border-b hover:bg-default-50">
                  <td className="p-3">{formatDate(debt.date_reg)}</td>
                  <td className="p-3 font-medium">{debt.client.name}</td>
                  <td className="p-3">
                    {debt.status === "pending" ? (
                      <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs">دين</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs">فكة</span>
                    )}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      debt.status === "pending" ? "text-orange-700" : "text-amber-700"
                    }`}
                  >
                    {formatCurrency(debt.debt_val)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-default-400 py-8">لا توجد ديون أو فكة مسجلة في هذه الفترة</p>
      )}
    </Card>
  );
}