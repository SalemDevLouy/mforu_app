"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import { WithdrawalFilters, WithdrawalFormData } from "./types";
import { parseAmount } from "@/lib/math";
import { useWithdrawals } from "./hooks/useWithdrawals";
import { useEmployees } from "./hooks/useEmployees";
import { WithdrawalStatsCards } from "./components/WithdrawalStatsCards";
import { WithdrawalFilters as WithdrawalFiltersCard } from "./components/WithdrawalFilters";
import { WithdrawalTable } from "./components/WithdrawalTable";
import { AddWithdrawalModal } from "./components/AddWithdrawalModal";
import { DeleteWithdrawalModal } from "./components/DeleteWithdrawalModal";

const EMPTY_FILTERS: WithdrawalFilters = { emp_id: "", month: new Date().toISOString().slice(0, 7) };

export default function WithdrawalsPage() {
  const [salonId, setSalonId] = useState<string>("");
  const [filters, setFilters] = useState<WithdrawalFilters>(EMPTY_FILTERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Read salonId from localStorage once
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setSalonId(user.salon_id || "");
    }
  }, []);

  const stableFilters = useMemo(() => filters, [filters]);

  const { withdrawals, loading, addWithdrawal, removeWithdrawal } =
    useWithdrawals(salonId, stableFilters);

  const { employees, loadingEmployees } = useEmployees(salonId);

  const handleAddSubmit = async (formData: WithdrawalFormData) => {
    await addWithdrawal({
      salon_id: salonId,
      emp_id: formData.emp_id,
      amount: parseAmount(formData.amount),
      date: formData.date,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await removeWithdrawal(deleteId);
      alert("تم حذف السحب بنجاح");
    } catch {
      alert("فشل حذف السحب");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">إدارة السحوبات</h1>
          <p className="text-default-500">تتبع وإدارة سحوبات الموظفين والمالك</p>
        </div>
        <Button color="primary" onPress={() => setShowAddModal(true)}>
          + إضافة سحب جديد
        </Button>
      </div>

      {/* Stats */}
      <WithdrawalStatsCards withdrawals={withdrawals} />

      {/* Filters + Table */}
      <div className="space-y-4">
        <WithdrawalFiltersCard
          filters={filters}
          employees={employees}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
        <WithdrawalTable
          withdrawals={withdrawals}
          loading={loading}
          onDelete={(id) => setDeleteId(id)}
        />
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddWithdrawalModal
          employees={employees}
          loadingEmployees={loadingEmployees}
          salonId={salonId}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteWithdrawalModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}