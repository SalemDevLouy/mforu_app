import { Card } from "@heroui/card";
import { MonthlyReport } from "../../types";
import { HiClipboardDocumentList } from "react-icons/hi2";

interface ConstantsTableProps {
  constants: MonthlyReport["constants"];
  constantsTotal: number;
  formatCurrency: (amount: number) => string;
  formatRepetation: (rep: string) => string;
}

export default function ConstantsTable({ constants, constantsTotal, formatCurrency, formatRepetation }: Readonly<ConstantsTableProps>) {
  if (constants.length === 0) return null;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <HiClipboardDocumentList className="text-default-500" />
        <span>المصروفات الثابتة</span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-right p-3">الاسم</th>
              <th className="text-right p-3">القيمة</th>
              <th className="text-right p-3">التكرار</th>
            </tr>
          </thead>
          <tbody>
            {constants.map((constant) => (
              <tr key={constant.const_id} className="border-b hover:bg-default-50">
                <td className="p-3">{constant.const_name}</td>
                <td className="p-3 font-semibold text-danger">{formatCurrency(constant.const_value)}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-default-100 rounded text-xs">
                    {formatRepetation(constant.repetation)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-danger/10">
              <td colSpan={2} className="p-3">الإجمالي</td>
              <td className="p-3 text-danger">{formatCurrency(constantsTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
