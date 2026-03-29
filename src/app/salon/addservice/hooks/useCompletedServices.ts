"use client";
import { useState, useEffect } from "react";
import { CompletedService } from "../types";
import { fetchCompletedServices } from "../model/Services";

export function useCompletedServices(salonId: string, refreshKey: number) {
  const [completedServices, setCompletedServices] = useState<CompletedService[]>([]);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayTotalDebt, setTodayTotalDebt] = useState(0);
  const [todayTotalCredit, setTodayTotalCredit] = useState(0);
  const [localKey, setLocalKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const refresh = () => setLocalKey((k) => k + 1);

  useEffect(() => {
    const load = () => {
      if (!salonId) return;
      setLoadingCompleted(true);
      fetchCompletedServices(salonId, selectedDate)
        .then((data) => {
          setCompletedServices(data.services);
          setTodayTotal(data.todayTotal);
          setTodayTotalDebt(data.todayTotalDebt);
          setTodayTotalCredit(data.todayTotalCredit);
        })
        .catch((err) => console.error("Error fetching completed services:", err))
        .finally(() => setLoadingCompleted(false));
    };

    load();
  }, [salonId, selectedDate, refreshKey, localKey]);

  return { completedServices, loadingCompleted, todayTotal, todayTotalDebt, todayTotalCredit, selectedDate, setSelectedDate, refresh };
}
