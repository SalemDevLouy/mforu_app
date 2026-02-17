"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAuth, getUser } from "@/hooks/useAuth";

export default function SalonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Protect all salon pages - only salon owner and reception can access
  useAuth(["salon owner", "reception"]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  const role = user?.role || "SALON_OWNER";

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      {/* Sidebar with responsive behavior */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          role={role} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
