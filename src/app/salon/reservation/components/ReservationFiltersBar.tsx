"use client";
import { RESERVATION_STATUSES } from "../constants";

interface ReservationFiltersBarProps {
  readonly filterStatus: string;
  readonly onChange: (status: string) => void;
}

export function ReservationFiltersBar({
  filterStatus,
  onChange,
}: ReservationFiltersBarProps) {
  return (
    <div className="mb-4">
      <label htmlFor="status-filter" className="block text-sm font-medium mb-2">
        تصفية حسب الحالة
      </label>
      <select
        id="status-filter"
        className="w-full md:w-64 px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        value={filterStatus}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">جميع الحجوزات</option>
        {RESERVATION_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
