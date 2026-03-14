import {
  HiCalendarDays,
  HiUsers,
  HiBriefcase,
  HiBanknotes,
  HiChartBar,
  HiLockClosed,
  HiCurrencyDollar,
  HiListBullet,
  HiDocumentText,
} from "react-icons/hi2";

const features = [
  {
    icon: HiCalendarDays,
    title: "إدارة الحجوزات",
    desc: "جدولة المواعيد وتتبع الحجوزات في الوقت الحقيقي مع إشعارات فورية للموظفين والعملاء.",
    color: "bg-violet-500",
    light: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    icon: HiUsers,
    title: "إدارة العملاء",
    desc: "سجل كامل بيانات عملائك وتاريخ زياراتهم وديونهم والخدمات المفضلة لديهم.",
    color: "bg-indigo-500",
    light: "bg-indigo-50",
    text: "text-indigo-600",
  },
  {
    icon: HiBriefcase,
    title: "إدارة الموظفين",
    desc: "تتبع أداء كل موظف، توزيع المهام، حساب النسب والإنتاجية اليومية.",
    color: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    icon: HiBanknotes,
    title: "المصاريف والتكاليف",
    desc: "سجّل جميع مصاريف الصالون وصنّفها بدقة لمعرفة أين تذهب أموالك.",
    color: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: HiCurrencyDollar,
    title: "السحوبات والمدفوعات",
    desc: "إدارة سحوبات الأرباح والمدفوعات للموظفين مع سجل مالي شفاف وكامل.",
    color: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    icon: HiChartBar,
    title: "التقارير والإحصائيات",
    desc: "تقارير تفصيلية يومية وشهرية وسنوية تساعدك في اتخاذ قرارات أذكى.",
    color: "bg-rose-500",
    light: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    icon: HiListBullet,
    title: "إدارة الخدمات",
    desc: "أضف وعدّل قائمة خدمات صالونك مع التسعير والمدة الزمنية لكل خدمة.",
    color: "bg-cyan-500",
    light: "bg-cyan-50",
    text: "text-cyan-600",
  },
  {
    icon: HiDocumentText,
    title: "سجل الزيارات",
    desc: "تاريخ كامل لكل زيارة — الخدمات، الموظف المسؤول، المبلغ المدفوع، والملاحظات.",
    color: "bg-pink-500",
    light: "bg-pink-50",
    text: "text-pink-600",
  },
  {
    icon: HiLockClosed,
    title: "إدارة الصلاحيات",
    desc: "تحكم دقيق في صلاحيات كل مستخدم — أدمن، مدير، موظف — بأمان تام.",
    color: "bg-slate-600",
    light: "bg-slate-50",
    text: "text-slate-600",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            المميزات
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            كل ما تحتاجه في مكان واحد
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            صُمّمت منصة M4U لتغطية كل جانب من جوانب إدارة صالونك دون الحاجة لأدوات متعددة.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.light} flex items-center justify-center mb-5`}>
                <f.icon className={`text-2xl ${f.text}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              {/* Hover accent */}
              <div className={`absolute bottom-0 right-0 w-1 h-0 group-hover:h-full ${f.color} opacity-60 rounded-r-3xl transition-all duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
