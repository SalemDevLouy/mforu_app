import React from "react";
import { DashCard } from "@/components/common/DashCard";
import { Client } from "../types";
import { sum } from "@/lib/math";
import { HiUsers, HiExclamationTriangle, HiBanknotes, HiCurrencyDollar } from "react-icons/hi2";

interface ClientStatsProps {
  clients: Client[];
}

export default function ClientStats({ clients }: Readonly<ClientStatsProps>) {
  const totalClientsWithDebt = clients.filter(
    (c) => c.totalDebt && c.totalDebt > 0
  ).length;
  const totalDebtAmount   = sum(clients.map((c) => c.totalDebt ?? 0));
  const totalCreditAmount = sum(clients.map((c) => c.totalCredit ?? 0));
  const totalClientsWithCredit = clients.filter(
    (c) => c.totalCredit && c.totalCredit > 0
  ).length;
  const creditTitle = totalClientsWithCredit > 0
    ? `فكة مستحقة للعملاء (${totalClientsWithCredit} عميل)`
    : "فكة مستحقة للعملاء";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <DashCard
        title="إجمالي العملاء"
        value={clients.length}
        icon={<HiUsers className="text-blue-500" />}
      />
      <DashCard
        title="عملاء لديهم ديون"
        value={totalClientsWithDebt}
        icon={<HiExclamationTriangle className="text-blue-500" />}
      />
      <DashCard
        title="إجمالي ديون العملاء"
        value={`${totalDebtAmount.toFixed(2)} دج`}
        icon={<HiBanknotes className="text-blue-500" />}
      />
      <DashCard
        title={creditTitle}
        value={`${totalCreditAmount.toFixed(2)} دج`}
        icon={<HiCurrencyDollar className="text-blue-500" />}
      />
    </div>
  );
}
