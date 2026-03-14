"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface User {
  user_id: string;
  name: string;
  phone: string;
  role: string;
  salon_id: string | null;
  status: string;
}

/**
 * Client-side auth guard.
 * Reads the user stored in localStorage and redirects when:
 *   - no session exists  → /auth/signin
 *   - role not allowed   → /unauthorized
 *
 * The middleware provides a parallel server-side guard using the
 * HTTP-only "auth-token" JWT cookie set on login.
 */
export function useAuth(allowedRoles?: string[]) {
  const router = useRouter();
  // Stable reference so the effect doesn't re-run on every render
  const allowedRolesRef = useRef(allowedRoles);

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      router.replace("/auth/signin");
      return;
    }

    try {
      const user: User = JSON.parse(userStr);

      if (allowedRolesRef.current && allowedRolesRef.current.length > 0) {
        if (!allowedRolesRef.current.includes(user.role)) {
          router.replace("/unauthorized");
          return;
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      localStorage.removeItem("user");
      router.replace("/auth/signin");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
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

/** Clears the local session and the server-side cookie, then redirects. */
export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // best-effort – proceed with local cleanup even if the request fails
  }
  localStorage.removeItem("user");
  globalThis.location.href = "/auth/signin";
}
