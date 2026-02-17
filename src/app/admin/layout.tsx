"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth, getUser } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Protect all admin pages - only admin of system and accounting man can access
  useAuth(["admin of system", "accounting man"]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  const role = user?.role || "APP_OWNER";

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
