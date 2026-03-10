"use client";
import { useState, useEffect } from "react";

export function useSalonId(): string {
  const [salonId, setSalonId] = useState("");

  useEffect(() => {
    const read = async () => {
      const userStr = await Promise.resolve(localStorage.getItem("user"));
      if (userStr) {
        const user = JSON.parse(userStr) as { salon_id?: string };
        setSalonId(user.salon_id || "");
      }
    };
    void read();
  }, []);

  return salonId;
}
