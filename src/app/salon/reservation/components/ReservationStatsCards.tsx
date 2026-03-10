"use client";
import { Card } from "@heroui/card";
import { Reservation } from "../types";
import { RESERVATION_STATUSES } from "../constants";

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
        <Card key={s.value} className="p-4">
          <div className="text-center">
            <p className="text-sm text-default-500">{s.label}</p>
            <p className={`text-2xl font-bold text-${s.color}`}>{s.count}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
