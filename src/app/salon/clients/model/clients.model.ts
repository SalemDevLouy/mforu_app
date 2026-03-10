import { Client, ClientFormData } from "../types";

export async function fetchClients(
  salonId: string,
  searchQuery?: string
): Promise<Client[]> {
  const url = searchQuery
    ? `/api/salon/clients?salon_id=${salonId}&search=${encodeURIComponent(searchQuery)}`
    : `/api/salon/clients?salon_id=${salonId}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) throw new Error(data.error || "فشل تحميل بيانات العملاء");
  return data.clients;
}

export async function createClient(
  salonId: string,
  formData: ClientFormData
): Promise<Client> {
  const response = await fetch("/api/salon/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, salon_id: salonId }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "فشل إضافة العميل");
  return data.client;
}

export async function updateClient(
  clientId: string,
  formData: ClientFormData
): Promise<Client> {
  const response = await fetch("/api/salon/clients", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, client_id: clientId }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "فشل تحديث العميل");
  return data.client;
}

export async function deleteClient(clientId: string): Promise<void> {
  const response = await fetch(`/api/salon/clients?client_id=${clientId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "فشل حذف العميل");
}
