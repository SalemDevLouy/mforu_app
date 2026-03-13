import Link from 'next/link';

const salonLinks = [
  {
    href: '/salon/addservice',
    icon: '✂️',
    title: 'تسجيل خدمة',
    desc: 'تسجيل الخدمات المقدمة للعملاء وربطها بالموظفين',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
  },
  {
    href: '/salon/reservation',
    icon: '📅',
    title: 'حجز موعد',
    desc: 'إدارة جدول المواعيد والحجوزات بشكل مرتب',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
  },
  {
    href: '/salon/clients',
    icon: '👥',
    title: 'العملاء',
    desc: 'عرض وإدارة بيانات العملاء وسجل زياراتهم',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  {
    href: '/salon/employees',
    icon: '💼',
    title: 'الموظفون',
    desc: 'إدارة بيانات الموظفين وأدوارهم ومهامهم',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  {
    href: '/salon/expenses',
    icon: '💸',
    title: 'المصاريف',
    desc: 'تتبع نفقات الصالون اليومية والشهرية',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
  },
  {
    href: '/salon/withdrawals',
    icon: '🏦',
    title: 'عمليات السحب',
    desc: 'تسجيل ومتابعة عمليات سحب الأموال',
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
  },
];

export default function SalonPage() {
  return (
    <div className="space-y-8" dir="rtl">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">✂️</div>
          <span className="text-emerald-100 text-sm font-medium">لوحة الصالون</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">مرحباً بك</h1>
        <p className="text-emerald-100 text-sm">
          إدارة عمليات الصالون اليومية — الخدمات، العملاء، الموظفين، والمصاريف.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'زيارات اليوم', value: '—', icon: '📋' },
          { label: 'عملاء نشطون', value: '—', icon: '👥' },
          { label: 'مواعيد اليوم', value: '—', icon: '📅' },
          { label: 'إيراد اليوم', value: '—', icon: '💰' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-lg font-bold text-gray-700">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
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
    </div>
  );
}
