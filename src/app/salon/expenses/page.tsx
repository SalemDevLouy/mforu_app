"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Expense, ExpenseFilters, ExpenseFormData } from "./types";
import { useExpenses } from "./hooks/useExpenses";
import { ExpenseStatsCards } from "./components/ExpenseStatsCards";
import { ExpenseFiltersBar } from "./components/ExpenseFiltersBar";
import { ExpenseTable } from "./components/ExpenseTable";
import { AddEditExpenseModal } from "./components/AddEditExpenseModal";
import { DeleteExpenseModal } from "./components/DeleteExpenseModal";

const EMPTY_FILTERS: ExpenseFilters = { exp_type: "", status: "" };

export default function ExpensesPage() {
  const [salonId, setSalonId] = useState<string>("");
  const [filters, setFilters] = useState<ExpenseFilters>(EMPTY_FILTERS);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setSalonId(user.salon_id || "");
    }
  }, []);

  const stableFilters = useMemo(() => filters, [filters]);
  const { expenses, loading, addExpense, editExpense, removeExpense } =
    useExpenses(salonId, stableFilters);

  const openAdd = () => {
    setEditingExpense(null);
    setShowAddEdit(true);
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowAddEdit(true);
  };

  const handleAdd = async (data: ExpenseFormData) => {
    await addExpense({ ...data, salon_id: salonId });
  };

  const handleEdit = async (data: ExpenseFormData, expId: string) => {
    await editExpense({ ...data, exp_id: expId, salon_id: salonId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await removeExpense(deleteId);
    } catch {
      alert("فشل حذف المصروف");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">إدارة المصروفات</h1>
          <p className="text-default-500">تتبع وإدارة مصروفات الصالون</p>
        </div>
        <Button color="primary" onPress={openAdd}>+ إضافة مصروف</Button>
      </div>

      {/* Stats */}
      <ExpenseStatsCards expenses={expenses} />

      {/* Filters + Table */}
      <Card className="p-4 md:p-6">
        <ExpenseFiltersBar filters={filters} onChange={setFilters} />
        <ExpenseTable
          expenses={expenses}
          loading={loading}
          onEdit={openEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      </Card>

      {/* Add / Edit Modal */}
      {showAddEdit && (
        <AddEditExpenseModal
          editingExpense={editingExpense}
          salonId={salonId}
          onClose={() => { setShowAddEdit(false); setEditingExpense(null); }}
          onAdd={handleAdd}
          onEdit={handleEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteExpenseModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

