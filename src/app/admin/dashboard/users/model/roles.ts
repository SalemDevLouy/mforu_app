import { Role } from "../types";

export async function fetchRoles(): Promise<Role[]> {
  const response = await fetch("/api/admin/roles");
  if (!response.ok) throw new Error("Failed to fetch roles");
  const data = await response.json();
  return data.roles;
}
