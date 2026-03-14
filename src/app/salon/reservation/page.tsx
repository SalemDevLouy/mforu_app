"use client";

import { useState, useMemo } from "react";
import { Button } from "@heroui/button";
import { useSalonId } from "@/hooks/useSalonId";
import { DashCard } from "@/components/common/DashCard";
import { useReservations } from "./hooks/useReservations";
import { useClients } from "./hooks/useClients";
import { Reservation } from "./types";
import { ReservationStatsCards } from "./components/ReservationStatsCards";
import { ReservationFiltersBar } from "./components/ReservationFiltersBar";
import { ReservationTable } from "./components/ReservationTable";
import { AddEditReservationModal } from "./components/AddEditReservationModal";
import { DeleteReservationModal } from "./components/DeleteReservationModal";
import { HiCalendarDays, HiPlus } from "react-icons/hi2";

export default function ReservationsPage() {
  const salonId = useSalonId();

  const [filterStatus, setFilterStatus] = useState("");
  const stableFilter = useMemo(() => filterStatus, [filterStatus]);

  const { reservations, loading, addReservation, editReservation, changeStatus, removeReservation } =
    useReservations(salonId, stableFilter);
  const { clients, addClient } = useClients(salonId);

  // Modal state
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingReservation(null);
    setShowReservationModal(true);
  };

  const openEdit = (r: Reservation) => {
    setEditingReservation(r);
    setShowReservationModal(true);
  };

  const requestDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await removeReservation(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">إدارة الحجوزات</h1>
          <p className="text-default-500 text-sm mt-1">تسجيل ومتابعة مواعيد العملاء</p>
        </div>
        <Button color="primary" onPress={openAdd} startContent={<HiPlus />}>حجز جديد</Button>
      </div>

      {/* Stats */}
      <ReservationStatsCards reservations={reservations} />

      {/* Summary card */}
      <DashCard
        title="إجمالي الحجوزات"
        value={reservations.length}
        icon={<HiCalendarDays className="text-blue-500" />}
      />

      {/* Filters */}
      <ReservationFiltersBar filterStatus={filterStatus} onChange={setFilterStatus} />

      {/* Table */}
      <ReservationTable
        reservations={reservations}
        loading={loading}
        onEdit={openEdit}
        onDelete={requestDelete}
        onStatusChange={changeStatus}
      />

      {/* Add / Edit Modal */}
      {showReservationModal && (
        <AddEditReservationModal
          editingReservation={editingReservation}
          salonId={salonId}
          clients={clients}
          onClose={() => setShowReservationModal(false)}
          onAdd={addReservation}
          onEdit={editReservation}
          onCreateClient={addClient}
        />
      )}

      {/* Delete Modal */}
      <DeleteReservationModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteId(null); }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
