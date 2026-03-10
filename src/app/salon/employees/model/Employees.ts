import { Employee, EmployeeFormData } from "../types";

interface MutationResponse {
  success?: boolean;
  error?: string;
}

export async function fetchEmployees(salonId: string): Promise<Employee[]> {
  const response = await fetch(`/api/salon/employees?salon_id=${salonId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Failed to fetch employees");
  }
  return response.json();
}

export async function createEmployee(
  payload: EmployeeFormData & { salon_id: string }
): Promise<void> {
  const response = await fetch("/api/salon/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error: MutationResponse = await response.json();
    throw new Error(error?.error || "Failed to create employee");
  }
}

export async function updateEmployee(
  empId: string,
  payload: EmployeeFormData
): Promise<void> {
  const response = await fetch(`/api/salon/employees/${empId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error: MutationResponse = await response.json();
    throw new Error(error?.error || "Failed to update employee");
  }
}

export async function deleteEmployee(empId: string): Promise<void> {
  const response = await fetch(`/api/salon/employees/${empId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error: MutationResponse = await response.json();
    throw new Error(error?.error || "Failed to delete employee");
  }
}
