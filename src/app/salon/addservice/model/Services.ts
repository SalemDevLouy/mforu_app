import { ClientData, CompletedService } from "../types";

// ─── Completed Services ───────────────────────────────────────────────────────

export interface CompletedServicesResult {
  services: CompletedService[];
  todayTotal: number;
}

export async function fetchCompletedServices(
  salonId: string,
  date: string
): Promise<CompletedServicesResult> {
  const response = await fetch(
    `/api/salon/addservice?salon_id=${salonId}&date=${date}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch completed services");
  }
  return response.json();
}

// ─── Client Search ────────────────────────────────────────────────────────────

export async function searchClient(
  phone: string,
  salonId: string
): Promise<ClientData> {
  const response = await fetch(
    `/api/salon/clients/search?phone=${encodeURIComponent(phone)}&salon_id=${salonId}`
  );
  if (!response.ok) {
    throw new Error("Failed to search client");
  }
  return response.json();
}

// ─── Submit Service ───────────────────────────────────────────────────────────

export interface SubmitServicePayload {
  salon_id: string;
  clientName: string;
  clientPhone?: string;
  clientId?: string;
  paidAmount: number;
  notes?: string;
  tasks: Array<{
    cat_id: string;
    price: number;
    employeeIds: string[];
  }>;
}

export interface SubmitServiceResult {
  client_name: string;
  [key: string]: unknown;
}

export interface UpdateServicePayload {
  notes?: string | null;
  price_total?: number;
  tasks?: Array<{
    cat_id: string;
    price: number;
    employeeIds: string[];
  }>;
}

export async function updateService(
  service_id: string,
  data: UpdateServicePayload
): Promise<void> {
  const res = await fetch("/api/salon/addservice", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service_id, ...data }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "فشل تحديث الخدمة");
}

export async function deleteService(service_id: string): Promise<void> {
  const res = await fetch("/api/salon/addservice", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service_id }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "فشل حذف الخدمة");
}

export async function submitService(
  payload: SubmitServicePayload
): Promise<SubmitServiceResult> {
  const response = await fetch("/api/salon/addservice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "حدث خطأ أثناء تسجيل الخدمة");
  }

  return data;
}
