import React from "react";
import { Card } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Client } from "../types";

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onAdjustBalance: (client: Client) => void;
  onViewDebts: (client: Client) => void;
}

export default function ClientsTable({
  clients,
  loading,
  searchQuery,
  onSearchChange,
  onEdit,
  onDelete,
  onAdjustBalance,
  onViewDebts,
}: Readonly<ClientsTableProps>) {
  return (
    <Card className="p-4 md:p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="البحث بالاسم أو رقم الهاتف..."
          className="w-full px-4 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <Table aria-label="جدول العملاء">
          <TableHeader>
            <TableColumn>الاسم</TableColumn>
            <TableColumn>رقم الهاتف</TableColumn>
            <TableColumn>الديون</TableColumn>
            <TableColumn>آخر زيارة</TableColumn>
            <TableColumn>الإجراءات</TableColumn>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.client_id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.phone || "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {client.totalDebt && client.totalDebt > 0 ? (
                      <span className="text-danger font-semibold text-sm">
                        {client.totalDebt.toFixed(2)} دج
                        {!!client.debtCount && client.debtCount > 1 && (
                          <span className="text-xs font-normal"> ({client.debtCount})</span>
                        )}
                      </span>
                    ) : null}
                    {client.totalCredit && client.totalCredit > 0 ? (
                      <span className="text-amber-600 font-semibold text-sm">
                        {client.totalCredit.toFixed(2)} دج
                        {!!client.creditCount && client.creditCount > 1 && (
                          <span className="text-xs font-normal"> ({client.creditCount})</span>
                        )}
                      </span>
                    ) : null}
                    {(!client.totalDebt || client.totalDebt === 0) &&
                      (!client.totalCredit || client.totalCredit === 0) && (
                        <span className="text-success text-sm">__</span>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  {client.lastVisit
                    ? new Date(client.lastVisit).toLocaleDateString("ar-DZ")
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      className="text-primary hover:text-primary-600 text-sm"
                      onClick={() => onEdit(client)}
                    >
                      تعديل
                    </button>
                    <button
                      className="text-warning hover:text-warning-600 text-sm"
                      onClick={() => onAdjustBalance(client)}
                    >
                      ضبط الرصيد
                    </button>
                    {((!!client.totalDebt && client.totalDebt > 0) ||
                      (!!client.totalCredit && client.totalCredit > 0)) && (
                      <button
                        className="text-blue-600 hover:text-blue-700 text-sm"
                        onClick={() => onViewDebts(client)}
                      >
                        الديون
                      </button>
                    )}
                    <button
                      className="text-danger hover:text-danger-600 text-sm"
                      onClick={() => onDelete(client.client_id)}
                    >
                      حذف
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {clients.length === 0 && (
        <div className="text-center py-8 text-default-500">
          {loading ? "جاري التحميل..." : "لا يوجد عملاء حالياً"}
        </div>
      )}
    </Card>
  );
}
