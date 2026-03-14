"use client";
import { Card } from "@heroui/card";
import { Employee } from "../types";
import { HiPencilSquare, HiTrash, HiPhone } from "react-icons/hi2";

interface EmployeeCardProps {
  readonly employee: Employee;
  readonly onEdit: (employee: Employee) => void;
  readonly onDelete: (empId: string) => void;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const initials = getInitials(employee.emp_name);
  const avatarColor = getAvatarColor(employee.emp_id);

  return (
    <Card className="group relative overflow-hidden border border-default-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Top accent bar */}
      <div className={`h-1 w-full ${avatarColor} opacity-70`} />

      <div className="p-5 flex flex-col gap-4">
        {/* Avatar + Info */}
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl ${avatarColor} flex items-center justify-center shrink-0 text-white text-lg font-bold shadow-sm`}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-base text-foreground truncate leading-snug">
              {employee.emp_name}
            </p>
            {employee.emp_phone ? (
              <div className="flex items-center gap-1.5 mt-1 text-default-400">
                <HiPhone className="text-sm shrink-0" />
                <span className="text-xs truncate" dir="ltr">
                  {employee.emp_phone}
                </span>
              </div>
            ) : (
              <p className="text-xs text-default-400 mt-1">لا يوجد رقم هاتف</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-default-100">
          <button
            onClick={() => onEdit(employee)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/15 rounded-xl transition-colors duration-150"
          >
            <HiPencilSquare className="text-base" />
            تعديل
          </button>
          <button
            onClick={() => onDelete(employee.emp_id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-danger bg-danger/5 hover:bg-danger/15 rounded-xl transition-colors duration-150"
          >
            <HiTrash className="text-base" />
            حذف
          </button>
        </div>
      </div>
    </Card>
  );
}
