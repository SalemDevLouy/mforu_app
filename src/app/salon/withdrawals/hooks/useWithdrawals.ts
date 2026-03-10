"use client";
import { useState, useEffect, useCallback } from "react";
import { Withdrawal, WithdrawalFilters } from "../types";
import {
  fetchWithdrawals,
  createWithdrawal,
  deleteWithdrawal,
  WithdrawalCreatePayload,
} from "../model/Withdrawals";

export function useWithdrawals(salonId: string, filters: WithdrawalFilters) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!salonId) return;
    setLoading(true);
    try {
      const data = await fetchWithdrawals(salonId, filters);
      setWithdrawals(data);
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      alert("فشل تحميل بيانات السحوبات");
    } finally {
      setLoading(false);
    }
  }, [salonId, filters]);

  useEffect(() => {
    load();
  }, [load]);

  const addWithdrawal = async (payload: WithdrawalCreatePayload) => {
    await createWithdrawal(payload);
    await load();
  };

  const removeWithdrawal = async (withdrawId: string) => {
    await deleteWithdrawal(withdrawId);
    await load();
  };

  return { withdrawals, loading, refresh: load, addWithdrawal, removeWithdrawal };
}
