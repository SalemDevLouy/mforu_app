import { Reservation } from "../types";

export interface ReservationCreatePayload {
  salon_id: string;
  client_id: string;
  date_exploit: string;
  deposit: string;
  status: string;
}

export interface ReservationUpdatePayload extends ReservationCreatePayload {
  reservation_id: string;
}

interface ReservationsResponse {
  success: boolean;
  reservations: Reservation[];
  error?: string;
}

interface MutationResponse {
  success: boolean;
  error?: string;
}

export async function fetchReservations(
  salonId: string,
  status: string
): Promise<Reservation[]> {
  let url = `/api/salon/reservations?salon_id=${salonId}`;
  if (status) url += `&status=${status}`;

  const response = await fetch(url);
  const data: ReservationsResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch reservations");
  return data.reservations;
}

export async function createReservation(
  payload: ReservationCreatePayload
): Promise<void> {
  const response = await fetch("/api/salon/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: MutationResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to create reservation");
}

export async function updateReservation(
  payload: ReservationUpdatePayload
): Promise<void> {
  const response = await fetch("/api/salon/reservations", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: MutationResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to update reservation");
}

export async function updateReservationStatus(
  reservationId: string,
  newStatus: string
): Promise<void> {
  const response = await fetch("/api/salon/reservations", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservation_id: reservationId, status: newStatus }),
  });
  const data: MutationResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to update status");
}

export async function deleteReservation(reservationId: string): Promise<void> {
  const response = await fetch(
    `/api/salon/reservations?reservation_id=${reservationId}`,
    { method: "DELETE" }
  );
  const data: MutationResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to delete reservation");
}
