export const RESERVATION_STATUSES = [
  { value: "pending",   label: "قيد الانتظار", color: "warning" },
  { value: "confirmed", label: "مؤكد",          color: "success" },
  { value: "completed", label: "مكتمل",         color: "primary" },
  { value: "cancelled", label: "ملغي",           color: "danger"  },
] as const;

export const STATUS_ACTIVE: Record<string, string> = {
  warning: "border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-300 ring-offset-1",
  success: "border-green-400 bg-green-50 text-green-700 ring-2 ring-green-300 ring-offset-1",
  primary: "border-blue-400  bg-blue-50  text-blue-700  ring-2 ring-blue-300  ring-offset-1",
  danger:  "border-red-400   bg-red-50   text-red-700   ring-2 ring-red-300   ring-offset-1",
};

export const STATUS_INACTIVE: Record<string, string> = {
  warning: "border-gray-200 bg-white hover:bg-amber-50 hover:border-amber-200 text-gray-500",
  success: "border-gray-200 bg-white hover:bg-green-50 hover:border-green-200 text-gray-500",
  primary: "border-gray-200 bg-white hover:bg-blue-50  hover:border-blue-200  text-gray-500",
  danger:  "border-gray-200 bg-white hover:bg-red-50   hover:border-red-200   text-gray-500",
};

export const getStatusColor = (status: string) =>
  RESERVATION_STATUSES.find((s) => s.value === status)?.color ?? "default";

export const BLANK_RESERVATION_FORM = () => ({
  client_id: "",
  client_phone: "",
  date_exploit: "",
  deposit: "",
  status: "pending",
});
