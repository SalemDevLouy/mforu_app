import { Client } from "../types";

export interface ClientCreatePayload {
  salon_id: string;
  name: string;
  phone: string;
}

interface ClientsResponse {
  success: boolean;
  clients: Client[];
  error?: string;
}

interface ClientCreateResponse {
  success: boolean;
  client: Client;
  error?: string;
}

export async function fetchClients(salonId: string): Promise<Client[]> {
  const response = await fetch(`/api/salon/clients?salon_id=${salonId}`);
  const data: ClientsResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch clients");
  return data.clients;
}

export async function createClient(payload: ClientCreatePayload): Promise<Client> {
  const response = await fetch("/api/salon/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: ClientCreateResponse = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to create client");
  return data.client;
}
