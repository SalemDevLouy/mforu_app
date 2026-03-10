"use client";
import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseFilters } from "../types";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  ExpenseCreatePayload,
  ExpenseUpdatePayload,
} from "../model/Expenses";

export function useExpenses(salonId: string, filters: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!salonId) return;

    let cancelled = false;
    setLoading(true);

    try {
      const data = await fetchExpenses(salonId, filters);
      if (!cancelled) setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => { cancelled = true; };
  }, [salonId, filters]);

  useEffect(() => {
    void load();
  }, [load]);

  const addExpense = async (payload: ExpenseCreatePayload) => {
    await createExpense(payload);
    await load();
  };

  const editExpense = async (payload: ExpenseUpdatePayload) => {
    await updateExpense(payload);
    await load();
  };

  const removeExpense = async (expId: string) => {
    await deleteExpense(expId);
    await load();
  };

  return { expenses, loading, addExpense, editExpense, removeExpense };
}
