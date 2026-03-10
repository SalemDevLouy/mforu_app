"use client";
import { useState, useEffect } from "react";
import { Employee } from "../types";
import { fetchEmployees } from "../model/Employees";

export function useEmployees(salonId: string) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    if (!salonId) return;

    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchEmployees(salonId);
        if (!cancelled) setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        if (!cancelled) setLoadingEmployees(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [salonId]);

  return { employees, loadingEmployees };
}
