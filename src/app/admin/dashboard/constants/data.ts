export const CONSTANT_TYPES = [
  { value: "إيجار",           icon: "🏠", color: "indigo" },
  { value: "راتب ثابت موظف", icon: "👤", color: "green"  },
  { value: "اشتراك كهرباء",   icon: "💡", color: "yellow" },
  { value: "اشتراك مياه",     icon: "💧", color: "sky"    },
  { value: "اشتراك إنترنت",   icon: "🌐", color: "blue"   },
  { value: "تأمين",           icon: "🛡", color: "purple" },
  { value: "صيانة دورية",     icon: "🔧", color: "orange" },
  { value: "قرض / قسط",      icon: "🏦", color: "red"    },
  { value: "اشتراك خدمة",    icon: "📋", color: "gray"   },
  { value: "أخرى",            icon: "📦", color: "slate"  },
];

export const REPETATION_OPTIONS = [
  { value: "daily",   label: "يومي",      badge: "bg-blue-100 text-blue-700"     },
  { value: "weekly",  label: "أسبوعي",    badge: "bg-purple-100 text-purple-700" },
  { value: "monthly", label: "شهري",      badge: "bg-green-100 text-green-700"   },
  { value: "yearly",  label: "سنوي",      badge: "bg-amber-100 text-amber-700"   },
  { value: "once",    label: "مرة واحدة", badge: "bg-gray-100 text-gray-600"     },
];

export const COLOR_ACTIVE: Record<string, string> = {
  indigo: "border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-300 ring-offset-1",
  green:  "border-green-400 bg-green-50 text-green-700 ring-2 ring-green-300 ring-offset-1",
  yellow: "border-yellow-400 bg-yellow-50 text-yellow-700 ring-2 ring-yellow-300 ring-offset-1",
  sky:    "border-sky-400 bg-sky-50 text-sky-700 ring-2 ring-sky-300 ring-offset-1",
  blue:   "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-300 ring-offset-1",
  purple: "border-purple-400 bg-purple-50 text-purple-700 ring-2 ring-purple-300 ring-offset-1",
  orange: "border-orange-400 bg-orange-50 text-orange-700 ring-2 ring-orange-300 ring-offset-1",
  red:    "border-red-400 bg-red-50 text-red-700 ring-2 ring-red-300 ring-offset-1",
  gray:   "border-gray-400 bg-gray-100 text-gray-700 ring-2 ring-gray-300 ring-offset-1",
  slate:  "border-slate-400 bg-slate-100 text-slate-700 ring-2 ring-slate-300 ring-offset-1",
};

export const REP_ACTIVE: Record<string, string> = {
  daily:   "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-300 ring-offset-1",
  weekly:  "border-purple-400 bg-purple-50 text-purple-700 ring-2 ring-purple-300 ring-offset-1",
  monthly: "border-green-400 bg-green-50 text-green-700 ring-2 ring-green-300 ring-offset-1",
  yearly:  "border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-300 ring-offset-1",
  once:    "border-gray-400 bg-gray-100 text-gray-700 ring-2 ring-gray-300 ring-offset-1",
};

export function getTypeIcon(name: string) {
  return CONSTANT_TYPES.find((t) => t.value === name)?.icon ?? "📦";
}

export function getRepLabel(rep: string) {
  return REPETATION_OPTIONS.find((r) => r.value === rep)?.label ?? rep;
}

export function getRepBadge(rep: string) {
  return REPETATION_OPTIONS.find((r) => r.value === rep)?.badge ?? "bg-gray-100 text-gray-600";
}

export type ConstantFormData = {
  salon_id:    string;
  const_name:  string;
  const_value: string;
  repetation:  string;
  status:      string;
  started_at:  string;
};
