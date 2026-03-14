import { HiBeaker, HiUser, HiHome, HiLightBulb, HiWrenchScrewdriver, HiClipboardDocumentList, HiArchiveBox, HiSparkles } from "react-icons/hi2";

export const EXPENSE_CATEGORIES = [
  { value: "منتجات وأدوات",  icon: HiSparkles, color: "purple" },
  { value: "مواد خام",       icon: HiBeaker, color: "blue"   },
  { value: "مواد تنظيف",     icon: HiBeaker, color: "cyan"   },
  { value: "رواتب",          icon: HiUser, color: "green"  },
  { value: "إيجار",          icon: HiHome, color: "indigo" },
  { value: "كهرباء",         icon: HiLightBulb, color: "yellow" },
  { value: "مياه",           icon: HiBeaker, color: "sky"    },
  { value: "صيانة",          icon: HiWrenchScrewdriver, color: "orange" },
  { value: "مستلزمات مكتبية",icon: HiClipboardDocumentList, color: "gray"   },
  { value: "أخرى",           icon: HiArchiveBox, color: "slate"  },
] as const;

export const CATEGORY_ACTIVE: Record<string, string> = {
  purple: "border-purple-400 bg-purple-50 text-purple-700 ring-2 ring-purple-300 ring-offset-1",
  blue:   "border-blue-400   bg-blue-50   text-blue-700   ring-2 ring-blue-300   ring-offset-1",
  cyan:   "border-cyan-400   bg-cyan-50   text-cyan-700   ring-2 ring-cyan-300   ring-offset-1",
  green:  "border-green-400  bg-green-50  text-green-700  ring-2 ring-green-300  ring-offset-1",
  indigo: "border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-300 ring-offset-1",
  yellow: "border-yellow-400 bg-yellow-50 text-yellow-700 ring-2 ring-yellow-300 ring-offset-1",
  sky:    "border-sky-400    bg-sky-50    text-sky-700    ring-2 ring-sky-300    ring-offset-1",
  orange: "border-orange-400 bg-orange-50 text-orange-700 ring-2 ring-orange-300 ring-offset-1",
  gray:   "border-gray-400   bg-gray-100  text-gray-700   ring-2 ring-gray-300   ring-offset-1",
  slate:  "border-slate-400  bg-slate-100 text-slate-700  ring-2 ring-slate-300  ring-offset-1",
};

export const getCategoryIcon = (type: string) =>
  EXPENSE_CATEGORIES.find((c) => c.value === type)?.icon ?? HiArchiveBox;

export const BLANK_FORM = () => ({
  exp_type: "",
  exp_val: "",
  date: new Date().toISOString().split("T")[0],
  status: "paid",
  description: "",
});
