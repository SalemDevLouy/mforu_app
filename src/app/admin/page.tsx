import Link from 'next/link';

const adminLinks = [
  {
    href: '/admin/dashboard',
    icon: '🏠',
    title: 'لوحة التحكم',
    desc: 'نظرة عامة على النظام والإحصائيات الرئيسية',
    color: 'from-violet-500 to-indigo-500',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
  },
  {
    href: '/admin/dashboard/users',
    icon: '👤',
    title: 'إدارة المستخدمين',
    desc: 'إضافة وتعديل وحذف مستخدمي النظام',
    color: 'from-sky-500 to-blue-500',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
  },
  {
    href: '/admin/dashboard/category',
    icon: '🏷️',
    title: 'إدارة الفئات',
    desc: 'إدارة فئات الخدمات وأسعارها',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  {
    href: '/admin/dashboard/constants',
    icon: '⚙️',
    title: 'الثوابت والإعدادات',
    desc: 'ضبط الثوابت والقيم الافتراضية للنظام',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  {
    href: '/admin/dashboard/accounting',
    icon: '💰',
    title: 'الحسابات',
    desc: 'متابعة الإيرادات والمصاريف والتقارير المالية',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
  },
  {
    href: '/admin/dashboard/reports',
    icon: '📊',
    title: 'التقارير',
    desc: 'تقارير تفصيلية حول أداء الصالونات والموظفين',
    color: 'from-fuchsia-500 to-purple-500',
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8" dir="rtl">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🛡️</div>
          <span className="text-violet-200 text-sm font-medium">لوحة الإدارة</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">مرحباً، المدير</h1>
        <p className="text-violet-200 text-sm">
          تحكم كامل في النظام، المستخدمين، الصالونات، والإعدادات من هنا.
        </p>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-4">الوصول السريع</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`w-11 h-11 rounded-xl ${link.bg} flex items-center justify-center text-2xl mb-4`}>
                {link.icon}
              </div>
              <h3 className={`font-bold text-sm ${link.text} mb-1 group-hover:underline`}>
                {link.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Footer */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'إصدار النظام', value: '1.0.0' },
          { label: 'البيئة', value: 'إنتاج' },
          { label: 'اللغة', value: 'العربية' },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs text-gray-500 shadow-sm">
            <span className="font-semibold text-gray-700">{item.label}: </span>{item.value}
          </div>
        ))}
      </div>
    </div>
  );
}
