"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";

interface NavbarProps {
  readonly role?: string;
  readonly onMenuToggle?: () => void;
}

export default function Navbar({ role, onMenuToggle }: NavbarProps) {
  return (
    <nav className="w-full bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Left side - Menu toggle & Brand */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button for mobile/tablet */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="فتح القائمة"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Brand */}
        <div>
          <span className="font-bold text-lg">لوحة التحكم</span>
          {role && (
            <span className="text-xs text-gray-500 mr-2">
              {role === "admin" && "- المدير"}
              {role === "APP_OWNER" && "- المدير"}
              {role === "ACCOUNTANT" && "- المحاسب"}
              {role === "reception" && "- الاستقبال"}
              {role === "RECEPTIONIST" && "- الاستقبال"}
              {role === "salon" && "- الصالون"}
              {role === "SALON_OWNER" && "- صاحب الصالون"}
            </span>
          )}
        </div>
      </div>

      {/* Right side - Actions & User */}
      <div className="flex items-center gap-3">
        <Link href="/notifications" className="hidden md:inline-block">
          <Button variant="ghost" size="sm">
            <span className="ml-1">🔔</span>{" "}
            إشعارات
          </Button>
        </Link>
        <Link href="/help" className="hidden md:inline-block">
          <Button variant="ghost" size="sm">
            <span className="ml-1">❓</span>{" "}
            مساعدة
          </Button>
        </Link>
        <div className="relative">
          <Avatar size="sm" name="مستخدم" src={undefined} />
        </div>
      </div>
    </nav>
  );
}
