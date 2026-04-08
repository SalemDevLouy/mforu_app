"use client";

import React from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/hooks/useAuth";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  readonly sectionTitle?: string;
  readonly isOpen?: boolean;
  readonly onClose?: () => void;
}

const defaultMenuItems: Record<string, MenuItem[]> = {
  admin: [
    { label: "لوحة التحكم", href: "/admin/dashboard" },
    { label: "إدارة المستخدمين", href: "/admin/dashboard/users" },
    { label: "الصالونات", href: "/admin/salons" },
    // { label: "إضافة صالون", href: "/admin/salons/addsalon" },
    { label: "الفئات", href: "/admin/dashboard/category" },
    { label: "الثوابت", href: "/admin/dashboard/constants" },
    { label: "الحسابات", href: "/admin/accounting" },
    { label: "الإعدادات", href: "/admin/settings" },
  
  ],
  salon: [
    {label:"الرئيسية", href:"/salon"},
    { label: "تسجيل خدمة", href: "/salon/{salonid}/addservice" },
    { label: "حجز موعد", href: "/salon/{salonid}/reservation" },
    { label: "العملاء", href: "/salon/{salonid}/clients" },
    // { label: "الديون", href: "/salon/{salonid}/debts" },
    { label: "المصاريف", href: "/salon/{salonid}/expenses" },
    { label: "الموظفين", href: "/salon/{salonid}/employees" },
    { label: "التقارير", href: "/salon/{salonid}/report" },
    { label: "الإعدادات", href: "/salon/{salonid}/settings" },
  ],
};

export default function Sidebar({ 
  sectionTitle = "القائمة",
  isOpen = false,
  onClose
}: SidebarProps) {
  // Get current user to determine which routes to show
  const user = getUser();
  const userRole = user?.role || "";
  const router = useRouter();

  // Admin routes - only for "admin of system" and "accounting man"
  const adminRoutes: MenuItem[] = [
    { label: "لوحة التحكم", href: "/admin/dashboard" },
    { label: "إدارة المستخدمين", href: "/admin/dashboard/users" },
    { label: "إدارة الفئات", href: "/admin/dashboard/category" },
    { label: "إدارة الثوابت", href: "/admin/dashboard/constants" },
    { label: "الحسابات", href: "/admin/dashboard/accounting" },
    // { label: "إضافة صالون", href: "/admin/dashboard/addsalon" },
  ];

  // Salon routes - for "salon owner" and "reception"
  const salonRoutes: MenuItem[] = [
    {label:"الرئيسية", href:"/salon"},
    { label: "تسجيل خدمة", href: "/salon/addservice" },
    { label: "العملاء", href: "/salon/clients" },
    // { label: "الديون", href: "/salon/debts" },
    { label: "الموظفين", href: "/salon/employees" },
    { label: "المصاريف", href: "/salon/expenses" },
    // { label: "الثوابت والالتزامات", href: "/salon/constants" },
    { label: "حجز موعد", href: "/salon/reservation" },
    { label: "عمليات السحب", href: "/salon/withdrawals" },
    // { label: "الإعدادات", href: "/salon/settings" },
  ];

  // Determine which routes to show based on role
  const isAdmin = userRole === "admin of system" || userRole === "accounting man";
  const isSalonUser = userRole === "salon owner" || userRole === "reception";

  const handleNavigation = (href: string) => {
    router.push(href);
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <>
      {/* Overlay for mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 right-0 h-full
          w-72 bg-white border-l shadow-2xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          z-50 lg:z-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-4">
          {/* Close button for mobile/tablet */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">القائمة</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="إغلاق القائمة"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <Card className="hidden lg:block">
            <div className="p-4">
              <h3 className="text-lg font-semibold">{sectionTitle}</h3>
              <p className="text-sm text-gray-600 mt-1">جميع المسارات</p>
              {user && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500">المستخدم</p>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.role}</p>
                </div>
              )}
            </div>
          </Card>
        
          <nav className="mt-4">
            {/* Admin Section - Only show for admin roles */}
            {isAdmin && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  إدارة النظام
                </h4>
                <ul className="space-y-1">
                  {adminRoutes.map((item) => (
                    <li key={item.href}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm"
                        onPress={() => handleNavigation(item.href)}
                      >
                        {item.icon && <span className="ml-2">{item.icon}</span>}
                        {item.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Salon Section - Only show for salon owner and reception */}
            {isSalonUser && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  إدارة الصالون
                </h4>
                <ul className="space-y-1">
                  {salonRoutes.map((item) => (
                    <li key={item.href}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm"
                        onPress={() => handleNavigation(item.href)}
                      >
                        {item.icon && <span className="ml-2">{item.icon}</span>}
                        {item.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>

          {/* Logout Button */}
          <div className="mt-6 p-4 border-t">
            <Button 
              color="danger" 
              variant="flat" 
              className="w-full"
              onPress={logout}
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export { defaultMenuItems };
export type { MenuItem, SidebarProps };
