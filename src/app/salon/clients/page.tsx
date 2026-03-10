"use client";

import React from "react";
import { Button } from "@heroui/button";
import { useClients } from "./hooks/useClients";
import { useDebts } from "./hooks/useDebts";
import ClientStats from "./components/ClientStats";
import ClientsTable from "./components/ClientsTable";
import ClientFormModal from "./components/ClientFormModal";
import DeleteClientModal from "./components/DeleteClientModal";
import DebtsModal from "./components/DebtsModal";
import AddDebtModal from "./components/AddDebtModal";
import BalanceModal from "./components/BalanceModal";

export default function ClientsPage() {
  const {
    clients,
    loading,
    searchQuery,
    setSearchQuery,
    fetchClients,
    showClientModal,
    editingClient,
    formData,
    setFormData,
    openAddModal,
    openEditModal,
    closeClientModal,
    handleSubmit,
    showDeleteModal,
    confirmDelete,
    closeDeleteModal,
    handleDelete,
  } = useClients();

  const {
    selectedClient,
    clientDebts,
    showDebtsModal,
    openDebtsModal,
    closeDebtsModal,
    showAddDebtModal,
    setShowAddDebtModal,
    debtFormData,
    setDebtFormData,
    handleAddDebt,
    handleMarkDebtPaid,
    handleMarkCreditReturned,
    showBalanceModal,
    balanceFormData,
    setBalanceFormData,
    openBalanceModal,
    closeBalanceModal,
    handleBalanceSubmit,
  } = useDebts(fetchClients);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">إدارة العملاء</h1>
          <p className="text-default-500">عرض وإدارة بيانات العملاء</p>
        </div>
        <Button color="primary" onPress={openAddModal}>
          + إضافة عميل جديد
        </Button>
      </div>

      {/* Stats */}
      <ClientStats clients={clients} />

      {/* Clients Table */}
      <ClientsTable
        clients={clients}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        onAdjustBalance={openBalanceModal}
        onViewDebts={openDebtsModal}
      />

      {/* Add / Edit Client Modal */}
      <ClientFormModal
        isOpen={showClientModal}
        editingClient={editingClient}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onClose={closeClientModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteClientModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      {/* Debts Modal */}
      {showDebtsModal && selectedClient && (
        <DebtsModal
          isOpen={showDebtsModal}
          client={selectedClient}
          debts={clientDebts}
          onClose={closeDebtsModal}
          onOpenAddDebt={() => setShowAddDebtModal(true)}
          onMarkPaid={handleMarkDebtPaid}
          onMarkCreditReturned={handleMarkCreditReturned}
        />
      )}

      {/* Add Debt Modal */}
      {showAddDebtModal && selectedClient && (
        <AddDebtModal
          isOpen={showAddDebtModal}
          formData={debtFormData}
          onChange={setDebtFormData}
          onSubmit={handleAddDebt}
          onClose={() => {
            setShowAddDebtModal(false);
            setDebtFormData({ debt_val: "", date_exp: "" });
          }}
        />
      )}

      {/* Balance Adjustment Modal */}
      {showBalanceModal && selectedClient && (
        <BalanceModal
          isOpen={showBalanceModal}
          client={selectedClient}
          formData={balanceFormData}
          onChange={setBalanceFormData}
          onSubmit={handleBalanceSubmit}
          onClose={closeBalanceModal}
        />
      )}
    </div>
  );
}
