"use client";
import { useState, useEffect } from "react";
import { Employee } from "../types";
import { fetchEmployees } from "../model/Employees";

export function useEmployees(salonId: string) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    if (!salonId) return;
    fetchEmployees(salonId)
      .then(setEmployees)
      .catch((err) => console.error("Error fetching employees:", err))
      .finally(() => setLoadingEmployees(false));
  }, [salonId]);

  return { employees, loadingEmployees };
}
