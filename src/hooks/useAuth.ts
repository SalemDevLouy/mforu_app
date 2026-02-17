"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: string;
  name: string;
  phone: string;
  role: string;
  salon_id: string | null;
  status: string;
}

export function useAuth(allowedRoles?: string[]) {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    
    if (!userStr) {
      router.push("/auth/signin");
      return;
    }

    try {
      const user: User = JSON.parse(userStr);

      // Check if user has required role
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          router.push("/unauthorized");
          return;
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/auth/signin");
    }
  }, [router, allowedRoles]);
}

export function getUser(): User | null {
  if (globalThis.window === undefined) return null;
  
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("user");
  globalThis.location.href = "/auth/signin";
}
