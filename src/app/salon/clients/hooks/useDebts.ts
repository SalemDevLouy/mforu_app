"use client";

import { useState } from "react";
import { Client, Debt, DebtFormData, BalanceFormData } from "../types";
import {
  fetchDebts as fetchDebtsApi,
  addDebt as addDebtApi,
  updateDebtStatus,
  adjustBalance as adjustBalanceApi,
} from "../model/debts.model";

export function useDebts(onRefreshClients: () => void) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDebts, setClientDebts] = useState<Debt[]>([]);

  // Modals
  const [showDebtsModal, setShowDebtsModal] = useState(false);
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  // Forms
  const [debtFormData, setDebtFormData] = useState<DebtFormData>({
    debt_val: "",
    date_exp: "",
  });
  const [balanceFormData, setBalanceFormData] = useState<BalanceFormData>({
    amount: "",
    type: "credit",
    date_exp: "",
  });

  const fetchDebts = async (clientId: string) => {
    try {
      const data = await fetchDebtsApi(clientId);
      setClientDebts(data);
    } catch (error) {
      console.error("Error fetching debts:", error);
      alert("فشل تحميل بيانات الديون");
    }
  };

  const openDebtsModal = async (client: Client) => {
    setSelectedClient(client);
    await fetchDebts(client.client_id);
    setShowDebtsModal(true);
  };

  const closeDebtsModal = () => {
    setShowDebtsModal(false);
    setSelectedClient(null);
    setClientDebts([]);
  };

  const handleAddDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    try {
      await addDebtApi(selectedClient.client_id, debtFormData);
      alert("تم إضافة الدين بنجاح");
      setDebtFormData({ debt_val: "", date_exp: "" });
      setShowAddDebtModal(false);
      await fetchDebts(selectedClient.client_id);
      onRefreshClients();
    } catch (error) {
      console.error("Error adding debt:", error);
      alert(error instanceof Error ? error.message : "فشل إضافة الدين");
    }
  };

  const handleMarkDebtPaid = async (debtId: string) => {
    if (!confirm("هل تريد تحديد هذا الدين كمدفوع؟")) return;
    try {
      await updateDebtStatus(debtId, "paid");
      alert("تم تحديث حالة الدين بنجاح");
      if (selectedClient) await fetchDebts(selectedClient.client_id);
      onRefreshClients();
    } catch (error) {
      console.error("Error updating debt:", error);
      alert(error instanceof Error ? error.message : "فشل تحديث حالة الدين");
    }
  };

  const handleMarkCreditReturned = async (debtId: string) => {
    if (!confirm("هل تم إرجاع الفكة للعميل؟")) return;
    try {
      await updateDebtStatus(debtId, "credit_returned");
      alert("تم تسجيل إرجاع الفكة بنجاح");
      if (selectedClient) await fetchDebts(selectedClient.client_id);
      onRefreshClients();
    } catch (error) {
      console.error("Error updating debt:", error);
      alert(error instanceof Error ? error.message : "فشل تحديث حالة الدين");
    }
  };

  const openBalanceModal = (client: Client) => {
    setSelectedClient(client);
    setBalanceFormData({ amount: "", type: "credit", date_exp: "" });
    setShowBalanceModal(true);
  };

  const closeBalanceModal = () => {
    setShowBalanceModal(false);
    setBalanceFormData({ amount: "", type: "credit", date_exp: "" });
  };

  const handleBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    try {
      await adjustBalanceApi(selectedClient.client_id, balanceFormData);
      alert(
        balanceFormData.type === "debit"
          ? "تم إضافة الدين بنجاح"
          : "تم إضافة الدفعة بنجاح"
      );
      closeBalanceModal();
      setSelectedClient(null);
      onRefreshClients();
    } catch (error) {
      console.error("Error adjusting balance:", error);
      alert(error instanceof Error ? error.message : "فشل تعديل الرصيد");
    }
  };

  return {
    selectedClient,
    clientDebts,
    // Debts modal
    showDebtsModal,
    openDebtsModal,
    closeDebtsModal,
    // Add debt modal
    showAddDebtModal,
    setShowAddDebtModal,
    debtFormData,
    setDebtFormData,
    handleAddDebt,
    // Debt status actions
    handleMarkDebtPaid,
    handleMarkCreditReturned,
    // Balance modal
    showBalanceModal,
    balanceFormData,
    setBalanceFormData,
    openBalanceModal,
    closeBalanceModal,
    handleBalanceSubmit,
  };
}
