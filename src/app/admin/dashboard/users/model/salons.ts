import { Salon } from "../types";

export async function fetchSalons(): Promise<Salon[]> {
  const response = await fetch("/api/admin/salons");
  if (!response.ok) throw new Error("Failed to fetch salons");
  const data = await response.json();
  return data;
}
