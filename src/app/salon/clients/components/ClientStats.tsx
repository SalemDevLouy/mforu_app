import React from "react";
import { Card } from "@heroui/card";
import { Client } from "../types";

interface ClientStatsProps {
  clients: Client[];
}

export default function ClientStats({ clients }: Readonly<ClientStatsProps>) {
  const totalClientsWithDebt = clients.filter(
    (c) => c.totalDebt && c.totalDebt > 0
  ).length;
  const totalDebtAmount = clients.reduce((sum, c) => sum + (c.totalDebt || 0), 0);
  const totalCreditAmount = clients.reduce((sum, c) => sum + (c.totalCredit || 0), 0);
  const totalClientsWithCredit = clients.filter(
    (c) => c.totalCredit && c.totalCredit > 0
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">إجمالي العملاء</p>
            <p className="text-2xl font-bold text-primary">{clients.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">عملاء لديهم ديون</p>
            <p className="text-2xl font-bold text-warning">{totalClientsWithDebt}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">إجمالي ديون العملاء</p>
            <p className="text-2xl font-bold text-danger">
              {totalDebtAmount.toFixed(2)} دج
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
            <span className="text-2xl">💸</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-default-500">فكة مستحقة للعملاء</p>
            <p className="text-2xl font-bold text-amber-600">
              {totalCreditAmount.toFixed(2)} دج
            </p>
            {totalClientsWithCredit > 0 && (
              <p className="text-xs text-amber-500">{totalClientsWithCredit} عميل</p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
