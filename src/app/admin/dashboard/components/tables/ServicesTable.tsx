import { Card } from "@heroui/card";
import { MonthlyReport } from "../../types";

interface ServicesTableProps {
  services: MonthlyReport["services"];
  totalIncome: number;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

export default function ServicesTable({ services, totalIncome, formatCurrency, formatDate }: ServicesTableProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span>✂️</span>
        <span>الخدمات ({services.length})</span>
      </h2>
      {services.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right p-3">التاريخ</th>
                <th className="text-right p-3">العميل</th>
                <th className="text-right p-3">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.service_id} className="border-b hover:bg-default-50">
                  <td className="p-3">{formatDate(service.date)}</td>
                  <td className="p-3">{service.client.name}</td>
                  <td className="p-3 font-semibold text-success">{formatCurrency(service.price_total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-success/10">
                <td colSpan={2} className="p-3">الإجمالي</td>
                <td className="p-3 text-success">{formatCurrency(totalIncome)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <p className="text-center text-default-400 py-8">لا توجد خدمات في هذه الفترة</p>
      )}
    </Card>
  );
}
