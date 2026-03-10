"use client";
import { useState, useEffect, useCallback } from "react";
import { Employee, EmployeeFormData } from "../types";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../model/Employees";

export function useEmployees(salonId: string) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const load = useCallback(async () => {
    if (!salonId) return;
    let cancelled = false;
    setLoadingEmployees(true);
    try {
      const data = await fetchEmployees(salonId);
      if (!cancelled) setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      if (!cancelled) setLoadingEmployees(false);
    }
    return () => { cancelled = true; };
  }, [salonId]);

  useEffect(() => { void load(); }, [load]);

  const addEmployee = async (data: EmployeeFormData) => {
    await createEmployee({ ...data, salon_id: salonId });
    await load();
  };

  const editEmployee = async (empId: string, data: EmployeeFormData) => {
    await updateEmployee(empId, data);
    await load();
  };

  const removeEmployee = async (empId: string) => {
    await deleteEmployee(empId);
    await load();
  };

  return { employees, loadingEmployees, addEmployee, editEmployee, removeEmployee };
}
