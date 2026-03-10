import { Employee } from "../types";

export async function fetchEmployees(salonId: string): Promise<Employee[]> {
  const response = await fetch(`/api/salon/employees?salon_id=${salonId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Failed to fetch employees");
  }
  return response.json();
}
