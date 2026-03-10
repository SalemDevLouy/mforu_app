import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "@heroui/table";
import { User } from "../../users/types";

interface UsersTableProps {
  filteredUsers: User[];
  getRoleBadgeColor: (roleName: string) => string;
  getRoleLabel: (roleName: string) => string;
  handleToggleStatus: (user: User) => void;
  handleEdit: (user: User) => void;
  handleDelete: (user_id: string, userName: string) => void;
}

export default function UsersTable({
  filteredUsers,
  getRoleBadgeColor,
  getRoleLabel,
  handleToggleStatus,
  handleEdit,
  handleDelete,
}: Readonly<UsersTableProps>) {
  return (
    <Table aria-label="جدول المستخدمين">
      <TableHeader>
        <TableColumn>الاسم الكامل</TableColumn>
        <TableColumn>رقم الهاتف</TableColumn>
        <TableColumn>الدور</TableColumn>
        <TableColumn>الصالون</TableColumn>
        <TableColumn>الحالة</TableColumn>
        <TableColumn>الإجراءات</TableColumn>
      </TableHeader>
      <TableBody>
        {filteredUsers.map((user) => (
          <TableRow key={user.user_id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.phone || "-"}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(
                  user.role?.role_name || ""
                )}`}
              >
                {getRoleLabel(user.role?.role_name || "غير محدد")}
              </span>
            </TableCell>
            <TableCell>
              {user.salon?.name || <span className="text-default-400">-</span>}
            </TableCell>
            <TableCell>
              <button
                onClick={() => handleToggleStatus(user)}
                className={`px-2 py-1 rounded-full text-xs ${
                  user.status === "ACTIVE"
                    ? "bg-success/20 text-success hover:bg-success/30"
                    : "bg-danger/20 text-danger hover:bg-danger/30"
                }`}
              >
                {user.status === "ACTIVE" ? "نشط" : "معطل"}
              </button>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <button
                  className="text-primary hover:text-primary-600 text-sm"
                  onClick={() => handleEdit(user)}
                >
                  تعديل
                </button>
                <button
                  className="text-danger hover:text-danger-600 text-sm"
                  onClick={() => handleDelete(user.user_id, user.name)}
                >
                  حذف
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
