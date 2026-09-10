import { Card } from "@heroui/card";
import { MonthlyReport } from "../../types";

interface SummaryCardsProps {
  summary: MonthlyReport["summary"];
  employeeCount: number;
  formatCurrency: (amount: number) => string;
}

export default function SummaryCards({ summary, employeeCount, formatCurrency }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-5 bg-success/10">
        <p className="text-xs text-default-500 mb-1">دخل الصالون الكلي للشهر</p>
        <p className="text-xl font-bold text-success">{formatCurrency(summary.total_income)}</p>
        <p className="text-xs text-default-400 mt-1">{summary.services_count} خدمة</p>
      </Card>

      <Card className="p-5 bg-danger/10">
        <p className="text-xs text-default-500 mb-1">المصروفات الكلية</p>
        <p className="text-xl font-bold text-danger">
          {formatCurrency(summary.total_expenses + summary.constants_total)}
        </p>
        <p className="text-xs text-default-400 mt-1">شامل الثوابت</p>
      </Card>

      <Card className="p-5 bg-warning/10">
        <p className="text-xs text-default-500 mb-1">دخل الموظفين</p>
        <p className="text-xl font-bold text-warning">{formatCurrency(summary.employee_income_total)}</p>
        <p className="text-xs text-default-400 mt-1">{employeeCount} موظف</p>
      </Card>

      <Card className="p-5 bg-primary/10">
        <p className="text-xs text-default-500 mb-1">الدخل الصافي للصالون</p>
        <p className={`text-xl font-bold ${summary.net_income >= 0 ? "text-primary" : "text-danger"}`}>
          {formatCurrency(summary.net_income)}
        </p>
        <p className="text-xs text-default-400 mt-1">بعد المصاريف ودخل الموظفين</p>
      </Card>

      <Card className="p-5 bg-orange-50">
        <p className="text-xs text-default-500 mb-1">ديون على العملاء</p>
        <p className="text-xl font-bold text-orange-600">{formatCurrency(summary.debts_total)}</p>
        <p className="text-xs text-default-400 mt-1">مبالغ غير محصلة</p>
      </Card>

      <Card className="p-5 bg-amber-50">
        <p className="text-xs text-default-500 mb-1">فكة مستحقة للعملاء</p>
        <p className="text-xl font-bold text-amber-600">{formatCurrency(summary.credits_total)}</p>
        <p className="text-xs text-default-400 mt-1">مبالغ يجب ردها</p>
      </Card>
    </div>
  );
}
