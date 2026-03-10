"use client";
import { useState, useEffect, useCallback } from "react";
import { Reservation, ReservationFormData } from "../types";
import {
  fetchReservations,
  createReservation,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
} from "../model/Reservations";

export function useReservations(salonId: string, filterStatus: string) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!salonId) return;
    let cancelled = false;
    setLoading(true);
    try {
      const data = await fetchReservations(salonId, filterStatus);
      if (!cancelled) setReservations(data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      alert("فشل تحميل بيانات الحجوزات");
    } finally {
      if (!cancelled) setLoading(false);
    }
    return () => { cancelled = true; };
  }, [salonId, filterStatus]);

  useEffect(() => { void load(); }, [load]);

  const addReservation = async (data: ReservationFormData) => {
    await createReservation({ ...data, salon_id: salonId });
    await load();
  };

  const editReservation = async (data: ReservationFormData, reservationId: string) => {
    await updateReservation({ ...data, salon_id: salonId, reservation_id: reservationId });
    await load();
  };

  const changeStatus = async (reservationId: string, newStatus: string) => {
    await updateReservationStatus(reservationId, newStatus);
    await load();
  };

  const removeReservation = async (reservationId: string) => {
    await deleteReservation(reservationId);
    await load();
  };

  return { reservations, loading, addReservation, editReservation, changeStatus, removeReservation };
}
