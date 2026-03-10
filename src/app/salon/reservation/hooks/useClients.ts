"use client";
import { useState, useEffect, useCallback } from "react";
import { Client, NewClientFormData } from "../types";
import { fetchClients, createClient } from "../model/Clients";

export function useClients(salonId: string) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const load = useCallback(async () => {
    if (!salonId) return;
    setLoadingClients(true);
    try {
      const data = await fetchClients(salonId);
      setClients(data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoadingClients(false);
    }
  }, [salonId]);

  useEffect(() => {
    load();
  }, [load]);

  const addClient = async (data: NewClientFormData): Promise<Client> => {
    const newClient = await createClient({ ...data, salon_id: salonId });
    await load();
    return newClient;
  };

  return { clients, loadingClients, addClient };
}
