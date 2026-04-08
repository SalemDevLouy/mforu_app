"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { HiScissors, HiCalendarDays, HiUsers, HiBriefcase, HiBanknotes, HiBuildingLibrary, HiClipboardDocumentList } from 'react-icons/hi2';
import { useSalonId } from '@/hooks/useSalonId';

type SalonDashboardStats = {
  todayNetWallet: number;
  todayServicesIncome: number;
  todayDepositIncome: number;
  todayExpenses: number;
  todayWithdrawals: number;
  todayVisitsCount: number;
  todayReservationsCount: number;
  totalNetWallet: number;
  totalServicesIncome: number;
  totalDepositIncome: number;
  totalExpenses: number;
  totalWithdrawals: number;
  activeClientsCount: number;
};

const DEFAULT_STATS: SalonDashboardStats = {
  todayNetWallet: 0,
  todayServicesIncome: 0,
  todayDepositIncome: 0,
  todayExpenses: 0,
  todayWithdrawals: 0,
  todayVisitsCount: 0,
  todayReservationsCount: 0,
  totalNetWallet: 0,
  totalServicesIncome: 0,
  totalDepositIncome: 0,
  totalExpenses: 0,
  totalWithdrawals: 0,
  activeClientsCount: 0,
};

const salonLinks = [
  {
    href: '/salon/addservice',
    icon: HiScissors,
    title: 'تسجيل خدمة',
    desc: 'تسجيل الخدمات المقدمة للعملاء وربطها بالموظفين',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
  },
  {
    href: '/salon/reservation',
    icon: HiCalendarDays,
    title: 'حجز موعد',
    desc: 'إدارة جدول المواعيد والحجوزات بشكل مرتب',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
  },
  {
    href: '/salon/clients',
    icon: HiUsers,
    title: 'العملاء',
    desc: 'عرض وإدارة بيانات العملاء وسجل زياراتهم',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  {
    href: '/salon/employees',
    icon: HiBriefcase,
    title: 'الموظفون',
    desc: 'إدارة بيانات الموظفين وأدوارهم ومهامهم',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  {
    href: '/salon/expenses',
    icon: HiBanknotes,
    title: 'المصاريف',
    desc: 'تتبع نفقات الصالون اليومية والشهرية',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
  },
  {
    href: '/salon/withdrawals',
    icon: HiBuildingLibrary,
    title: 'عمليات السحب',
    desc: 'تسجيل ومتابعة عمليات سحب الأموال',
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
  },
];

export default function SalonPage() {
  const salonId = useSalonId();
  const [stats, setStats] = useState<SalonDashboardStats>(DEFAULT_STATS);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!salonId) return;

    const controller = new AbortController();

    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const response = await fetch(`/api/salon/dashboard?salon_id=${salonId}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          success?: boolean;
          stats?: SalonDashboardStats;
        };

        if (response.ok && data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Failed to load salon dashboard stats:', error);
        }
      } finally {
        setLoadingStats(false);
      }
    };

    void loadStats();

    return () => controller.abort();
  }, [salonId]);

  const formatMoney = useMemo(
    () =>
      new Intl.NumberFormat('ar-DZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  );

  const todayStats = [
    { label: 'صافي مدخول اليوم (المحفظة)', value: `${formatMoney.format(stats.todayNetWallet)} دج`, icon: HiBanknotes },
    { label: 'مدخول الخدمات اليوم', value: `${formatMoney.format(stats.todayServicesIncome)} دج`, icon: HiScissors },
    { label: 'مدخول العربون اليوم', value: `${formatMoney.format(stats.todayDepositIncome)} دج`, icon: HiCalendarDays },
    { label: 'مصاريف اليوم', value: `${formatMoney.format(stats.todayExpenses)} دج`, icon: HiClipboardDocumentList },
    { label: 'سحوبات اليوم', value: `${formatMoney.format(stats.todayWithdrawals)} دج`, icon: HiBuildingLibrary },
    { label: 'زيارات اليوم', value: stats.todayVisitsCount.toString(), icon: HiUsers },
    { label: 'مواعيد اليوم', value: stats.todayReservationsCount.toString(), icon: HiCalendarDays },
  ];

  const overallStats = [
    { label: 'إجمالي المحفظة', value: `${formatMoney.format(stats.totalNetWallet)} دج`, icon: HiBanknotes },
    { label: 'إجمالي مدخول الخدمات', value: `${formatMoney.format(stats.totalServicesIncome)} دج`, icon: HiScissors },
    { label: 'إجمالي مدخول العربون', value: `${formatMoney.format(stats.totalDepositIncome)} دج`, icon: HiCalendarDays },
    { label: 'إجمالي المصاريف', value: `${formatMoney.format(stats.totalExpenses)} دج`, icon: HiClipboardDocumentList },
    { label: 'إجمالي السحوبات', value: `${formatMoney.format(stats.totalWithdrawals)} دج`, icon: HiBuildingLibrary },
    { label: 'عدد العملاء', value: stats.activeClientsCount.toString(), icon: HiUsers },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl"><HiScissors /></div>
          <span className="text-emerald-100 text-sm font-medium">لوحة الصالون</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">مرحباً بك</h1>
        <p className="text-emerald-100 text-sm">
          إدارة عمليات الصالون اليومية — الخدمات، العملاء، الموظفين، والمصاريف.
        </p>
      </div>

      {/* Today Stats */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-4">إحصائيات اليوم</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {todayStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="text-2xl mb-1 flex justify-center text-gray-500"><stat.icon /></div>
              <div className="text-lg font-bold text-gray-700">{loadingStats ? '...' : stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Stats */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-4">إحصائيات عامة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {overallStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="text-2xl mb-1 flex justify-center text-gray-500"><stat.icon /></div>
              <div className="text-lg font-bold text-gray-700">{loadingStats ? '...' : stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-4">الوصول السريع</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {salonLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`w-11 h-11 rounded-xl ${link.bg} flex items-center justify-center text-2xl mb-4`}>
                <link.icon className={link.text} />
              </div>
              <h3 className={`font-bold text-sm ${link.text} mb-1 group-hover:underline`}>
                {link.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
