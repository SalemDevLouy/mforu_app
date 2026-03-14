import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { MonthlyReport } from "../../types";
import ServicesTable from "../tables/ServicesTable";
import ExpensesTable from "../tables/ExpensesTable";
import ConstantsTable from "../tables/ConstantsTable";
import { formatCurrency, formatDate, formatRepetation } from "../../accounting/[salonId]/utils";
import { HiArrowDownTray, HiPrinter } from "react-icons/hi2";

interface GlobalTabProps {
  report: MonthlyReport;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onPrint: () => void;
}

export default function GlobalTab({ report, selectedMonth, onMonthChange, onPrint }: Readonly<GlobalTabProps>) {
  const handleExportCsv = () => {
    let csv = `تقرير الصالون - ${report.salon.name}\n\n`;
    csv += `الفترة,${formatDate(report.period.start)} - ${formatDate(report.period.end)}\n\n`;
    csv += `إجمالي الدخل,${report.summary.total_income}\n`;
    csv += `إجمالي المصروفات,${report.summary.total_expenses}\n`;
    csv += `الثوابت,${report.summary.constants_total}\n`;
    csv += `دخل الموظفين,${report.summary.employee_income_total}\n`;
    csv += `صافي الربح,${report.summary.net_profit}\n`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `salon-report-${selectedMonth}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Month filter + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <label htmlFor="global-month" className="text-sm font-medium whitespace-nowrap">الشهر:</label>
          <input
            id="global-month"
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-3 py-2 border border-default-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" color="primary" onPress={onPrint} startContent={<HiPrinter />}>
            طباعة
          </Button>
          <Button size="sm" color="default" variant="bordered" onPress={handleExportCsv} startContent={<HiArrowDownTray />}>
            تصدير CSV
          </Button>
        </div>
      </div>

      {/* Period banner */}
      <Card className="p-3 bg-primary/5">
        <p className="text-sm">
          <strong>الفترة:</strong> {formatDate(report.period.start)} — {formatDate(report.period.end)}
        </p>
      </Card>

      <ServicesTable
        services={report.services}
        totalIncome={report.summary.total_income}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      <ExpensesTable
        expenses={report.expenses}
        totalExpenses={report.summary.total_expenses}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      <ConstantsTable
        constants={report.constants}
        constantsTotal={report.summary.constants_total}
        formatCurrency={formatCurrency}
        formatRepetation={formatRepetation}
      />
    </div>
  );
}
