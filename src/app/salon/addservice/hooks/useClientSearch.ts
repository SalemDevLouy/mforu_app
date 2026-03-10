"use client";
import { useState } from "react";
import { ClientData } from "../types";
import { searchClient as searchClientApi } from "../model/Services";

export function useClientSearch(
  salonId: string,
  onClientFound: (name: string) => void
) {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [searchingClient, setSearchingClient] = useState(false);

  const doSearch = async (phone: string) => {
    if (!phone || phone.length < 10) {
      setClientData(null);
      return;
    }

    setSearchingClient(true);
    try {
      const data = await searchClientApi(phone, salonId);
      setClientData(data);
      if (data.found && data.client) {
        onClientFound(data.client.name);
      }
    } catch (error) {
      console.error("Error searching client:", error);
      setClientData(null);
    } finally {
      setSearchingClient(false);
    }
  };

  const clearClient = () => setClientData(null);

  return { clientData, searchingClient, doSearch, clearClient };
}
