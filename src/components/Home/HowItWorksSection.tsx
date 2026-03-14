import { HiUserPlus, HiCog6Tooth, HiRocketLaunch, HiChartBarSquare } from "react-icons/hi2";

const steps = [
  {
    icon: HiUserPlus,
    step: "01",
    title: "إنشاء الحساب",
    desc: "سجّل صالونك في دقيقتين فقط وابدأ الإعداد الأولي بدون تعقيد.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    icon: HiCog6Tooth,
    step: "02",
    title: "إعداد الصالون",
    desc: "أضف موظفيك، خدماتك، وعملائك بسهولة من خلال واجهة بسيطة وسلسة.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    icon: HiRocketLaunch,
    step: "03",
    title: "ابدأ الإدارة",
    desc: "سجّل الزيارات، اقبل الحجوزات، وتابع أداء فريقك بشكل يومي.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    icon: HiChartBarSquare,
    step: "04",
    title: "تابع النمو",
    desc: "استعرض التقارير والإحصائيات واتخذ قرارات مبنية على بيانات حقيقية.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="bg-gradient-to-b from-slate-50 to-white py-24 px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            كيف يعمل
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            أربع خطوات فقط للبدء
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            لا تحتاج لأي خبرة تقنية — المنصة صُممت لتكون بسيطة من اليوم الأول.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className={`relative flex gap-6 bg-white rounded-3xl p-8 border ${s.border} shadow-sm hover:shadow-lg transition-shadow duration-300`}
            >
              {/* Step number */}
              <span className="absolute top-6 left-6 text-6xl font-extrabold text-gray-100 leading-none select-none">
                {s.step}
              </span>
              {/* Icon */}
              <div className={`relative z-10 w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon className={`text-2xl ${s.color}`} />
              </div>
              {/* Text */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
