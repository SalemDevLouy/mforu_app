"use client";
import { DashCard } from "@/components/common/DashCard";
import { Reservation } from "../types";
import { RESERVATION_STATUSES } from "../constants";
import { HiCalendarDays } from "react-icons/hi2";

interface ReservationStatsCardsProps {
  readonly reservations: Reservation[];
}

export function ReservationStatsCards({ reservations }: ReservationStatsCardsProps) {
  const counts = RESERVATION_STATUSES.map((s) => ({
    ...s,
    count: reservations.filter((r) => r.status === s.value).length,
  }));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {counts.map((s) => (
        <DashCard
          key={s.value}
          title={s.label}
          value={s.count}
          icon={<HiCalendarDays className="text-blue-500" />}
        />
      ))}
    </div>
  );
}
