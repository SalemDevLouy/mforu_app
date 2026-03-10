import { MonthlyReport } from "../../types";

type Task = MonthlyReport["employee_incomes"][number]["tasks"][number];

interface EmployeeTasksTableProps {
  tasks: Task[];
  tasksCount: number;
  totalEarned: number;
  formatCurrency: (amount: number) => string;
}

export default function EmployeeTasksTable({ tasks, tasksCount, totalEarned, formatCurrency }: EmployeeTasksTableProps) {
  return (
    <div>
      <h4 className="font-semibold text-sm text-default-600 mb-3">
        المهام — {tasksCount} مهمة (عرض {tasks.length})
      </h4>
      {tasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-default-200 bg-default-50">
                <th className="text-right p-2 text-xs font-semibold">التاريخ</th>
                <th className="text-right p-2 text-xs font-semibold">الفئة</th>
                <th className="text-right p-2 text-xs font-semibold">العميل</th>
                <th className="text-right p-2 text-xs font-semibold">سعر المهمة</th>
                <th className="text-right p-2 text-xs font-semibold">نسبة الموظف</th>
                <th className="text-right p-2 text-xs font-semibold">مكتسب الموظف</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.task_id}
                  className="border-b border-default-100 hover:bg-default-50 transition-colors"
                >
                  <td className="p-2 whitespace-nowrap">
                    {new Date(task.date).toLocaleDateString("ar-DZ")}
                  </td>
                  <td className="p-2">{task.category || "—"}</td>
                  <td className="p-2">{task.client || "—"}</td>
                  <td className="p-2 text-default-600">{formatCurrency(task.amount)}</td>
                  <td className="p-2">
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="inline-block h-2 rounded-full bg-primary/60"
                        style={{ width: `${task.percentage * 0.6}px` }}
                      />
                      <span className="font-semibold text-primary">{task.percentage}%</span>
                    </span>
                  </td>
                  <td className="p-2 font-semibold text-success">
                    {formatCurrency(task.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-success/5 font-bold">
                <td colSpan={6} className="p-2 text-sm text-right">إجمالي المكتسب</td>
                <td className="p-2 text-success">{formatCurrency(totalEarned)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <p className="text-sm text-default-400 text-center py-4">لا توجد مهام</p>
      )}
    </div>
  );
}
