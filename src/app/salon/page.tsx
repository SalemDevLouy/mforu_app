"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  HiScissors,
  HiCalendarDays,
  HiUsers,
  HiBriefcase,
  HiBanknotes,
  HiBuildingLibrary,
  HiClipboardDocumentList,
  HiCurrencyDollar,
  HiArrowTrendingDown,
  HiWallet,
  HiMiniPlus,
  HiMiniMinus,
} from 'react-icons/hi2';
import { useSalonId } from '@/hooks/useSalonId';

type SalonDashboardStats = {
  todayNetWallet: number;
  todayServicesIncome: number;
  todayDepositIncome: number;
  todayExpenses: number;
  todayWithdrawals: number;
  todayPendingDebts: number;
  todayCredits: number;
  todayVisitsCount: number;
  todayReservationsCount: number;
  totalNetWallet: number;
  totalServicesIncome: number;
  totalDepositIncome: number;
  totalExpenses: number;
  totalWithdrawals: number;
  totalPendingDebts: number;
  totalCredits: number;
  activeClientsCount: number;
  employeesCount: number;
};

const DEFAULT_STATS: SalonDashboardStats = {
  todayNetWallet: 0,
  todayServicesIncome: 0,
  todayDepositIncome: 0,
  todayExpenses: 0,
  todayWithdrawals: 0,
  todayPendingDebts: 0,
  todayCredits: 0,
  todayVisitsCount: 0,
  todayReservationsCount: 0,
  totalNetWallet: 0,
  totalServicesIncome: 0,
  totalDepositIncome: 0,
  totalExpenses: 0,
  totalWithdrawals: 0,
  totalPendingDebts: 0,
  totalCredits: 0,
  activeClientsCount: 0,
  employeesCount: 0,
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

type StatCard = {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconText: string;
  valueText: string;
  sub?: string;
};
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
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    []
  );

  const money = (amount: number) => `${formatMoney.format(amount)} دج`;

  const walletBreakdown = [
    {
      label: 'دخل الخدمات اليوم',
      value: money(stats.todayServicesIncome),
      sign: '+',
      text: 'text-emerald-400',
      icon: HiScissors,
    },
    {
      label: 'عربون الحجز المحصّل',
      value: money(stats.todayDepositIncome),
      sign: '+',
      text: 'text-sky-400',
      icon: HiCalendarDays,
    },
    {
      label: 'الفكة المستحقة للعملاء',
      value: money(stats.todayCredits),
      sign: '+',
      text: 'text-amber-400',
      icon: HiCurrencyDollar,
    },
    {
      label: 'دين مسجل اليوم',
      value: money(stats.todayPendingDebts),
      sign: '-',
      text: 'text-orange-400',
      icon: HiArrowTrendingDown,
    },
    {
      label: 'مصاريف اليوم',
      value: money(stats.todayExpenses),
      sign: '-',
      text: 'text-rose-400',
      icon: HiClipboardDocumentList,
    },
    {
      label: 'سحوبات اليوم',
      value: money(stats.todayWithdrawals),
      sign: '-',
      text: 'text-fuchsia-400',
      icon: HiBuildingLibrary,
    },
  ];
const todayStats: StatCard[] = [
    {
      label: 'دخل الخدمات اليوم',
      value: money(stats.todayServicesIncome),
      icon: HiScissors,
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      valueText: 'text-emerald-700',
      sub: `${stats.todayVisitsCount} زيارة`,
    },
    {
      label: 'عربون الحجز اليوم',
      value: money(stats.todayDepositIncome),
      icon: HiCalendarDays,
      iconBg: 'bg-sky-100',
      iconText: 'text-sky-600',
      valueText: 'text-sky-700',
      sub: `${stats.todayReservationsCount} حجز`,
    },
    {
      label: 'دين مسجل اليوم',
      value: money(stats.todayPendingDebts),
      icon: HiArrowTrendingDown,
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      valueText: 'text-orange-700',
      sub: 'مبالغ غير محصلة',
    },
    {
      label: 'فكة اليوم (مستحقة للعملاء)',
      value: money(stats.todayCredits),
      icon: HiCurrencyDollar,
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      valueText: 'text-amber-700',
      sub: 'أموال مستلمة زائدة',
    },
    {
      label: 'مصاريف اليوم',
      value: money(stats.todayExpenses),
      icon: HiClipboardDocumentList,
      iconBg: 'bg-rose-100',
      iconText: 'text-rose-600',
      valueText: 'text-rose-700',
    },
    {
      label: 'سحوبات اليوم',
      value: money(stats.todayWithdrawals),
      icon: HiBuildingLibrary,
      iconBg: 'bg-fuchsia-100',
      iconText: 'text-fuchsia-600',
      valueText: 'text-fuchsia-700',
    },
  ];

  const overallStats: StatCard[] = [
    {
      label: 'ديون العملاء المعلقة',
      value: money(stats.totalPendingDebts),
      icon: HiArrowTrendingDown,
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      valueText: 'text-orange-700',
      sub: 'مبالغ يجب تحصيلها',
    },
    {
      label: 'فكة مستحقة للعملاء',
      value: money(stats.totalCredits),
      icon: HiCurrencyDollar,
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      valueText: 'text-amber-700',
      sub: 'مبالغ يجب ردها',
    },
    {
      label: 'إجمالي دخل الخدمات',
      value: money(stats.totalServicesIncome),
      icon: HiScissors,
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      valueText: 'text-emerald-700',
    },
    {
      label: 'إجمالي العربون المحصّل',
      value: money(stats.totalDepositIncome),
      icon: HiCalendarDays,
      iconBg: 'bg-sky-100',
      iconText: 'text-sky-600',
      valueText: 'text-sky-700',
    },
    {
      label: 'إجمالي المصاريف',
      value: money(stats.totalExpenses),
      icon: HiClipboardDocumentList,
      iconBg: 'bg-rose-100',
      iconText: 'text-rose-600',
      valueText: 'text-rose-700',
    },
    {
      label: 'إجمالي السحوبات',
      value: money(stats.totalWithdrawals),
      icon: HiBuildingLibrary,
      iconBg: 'bg-fuchsia-100',
      iconText: 'text-fuchsia-600',
      valueText: 'text-fuchsia-700',
    },
    {
      label: 'عدد الموظفين',
      value: stats.employeesCount.toString(),
      icon: HiBriefcase,
      iconBg: 'bg-indigo-100',
      iconText: 'text-indigo-600',
      valueText: 'text-indigo-700',
    },
    {
      label: 'عدد العملاء',
      value: stats.activeClientsCount.toString(),
      icon: HiUsers,
      iconBg: 'bg-teal-100',
      iconText: 'text-teal-600',
      valueText: 'text-teal-700',
    },
  ];

  const renderStatCard = (stat: StatCard, index: number) => (
    <div
      key={`${stat.label}-${index}`}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex items-start gap-4"
    >
      <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center text-xl shrink-0`}>
        <stat.icon className={stat.iconText} />
      </div>
      <div className="min-w-0">
        <div className={`text-lg font-bold ${stat.valueText} truncate`}>{loadingStats ? '...' : stat.value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
        {stat.sub && <div className="text-[11px] text-gray-400 mt-0.5">{stat.sub}</div>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8" dir="rtl">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
            <HiScissors />
          </div>
          <div>
            <span className="text-emerald-100 text-sm font-medium">لوحة الصالون</span>
            <h1 className="text-2xl md:text-3xl font-bold">مرحباً بك</h1>
            <p className="text-emerald-100 text-sm mt-1">
              إدارة عمليات الصالون اليومية — الخدمات، العملاء، الموظفين، والمصاريف.
            </p>
          </div>
        </div>
        <div className="text-sm bg-white/10 rounded-xl px-4 py-3 backdrop-blur whitespace-nowrap">
          <span className="block text-emerald-100">
            {new Date().toLocaleDateString('ar-DZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="rounded-2xl bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-900 p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="lg:w-1/3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-2xl">
                <HiWallet />
              </div>
              <div>
                <p className="text-slate-300 text-xs font-medium">النقود في محفظة الصالون اليوم</p>
                <p className="text-3xl md:text-4xl font-extrabold text-emerald-300 mt-1">
                  {loadingStats ? '...' : money(stats.todayNetWallet)}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              الدخل اليومي + العربون + الفكة − المصاريف − السحوبات − الديون المسجلة
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {walletBreakdown.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`rounded-xl ${item.sign === '+' ? 'bg-emerald-500/10' : 'bg-rose-500/10'} border ${item.sign === '+' ? 'border-emerald-500/20' : 'border-rose-500/20'} px-4 py-3 flex items-center justify-between gap-2`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`text-sm shrink-0 ${item.text}`} />
                    <span className="text-xs text-slate-300 truncate">{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ${item.text}`}>
                    {item.sign} {loadingStats ? '...' : item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total wallet comparison */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 text-sm">
            <HiBanknotes className="text-emerald-400" />
            <span className="text-slate-300">إجمالي المحفظة منذ البداية</span>
          </div>
          <p className="text-xl font-bold text-emerald-300">{loadingStats ? '...' : money(stats.totalNetWallet)}</p>
        </div>
      </div>

      {/* Today Stats */}
      <div>
        <h2 className="text-base font-bold text-gray-700 flex items-center gap-2 mb-4">
          <HiMiniPlus className="text-emerald-500" />
          إحصائيات اليوم
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayStats.map((stat, i) => renderStatCard(stat, i))}
        </div>
      </div>

      {/* Overall Stats */}
      <div>
        <h2 className="text-base font-bold text-gray-700 flex items-center gap-2 mb-4">
          <HiMiniMinus className="text-sky-500" />
          إحصائيات عامة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overallStats.map((stat, i) => renderStatCard(stat, i))}
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