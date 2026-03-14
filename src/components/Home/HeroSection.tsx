import Link from "next/link";
import { HiArrowLeft, HiSparkles } from "react-icons/hi2";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 px-6 pt-24 pb-32 flex flex-col items-center text-center"
      dir="rtl"
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-200 opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-indigo-200 opacity-30 blur-3xl" />

      {/* Badge */}
      <div className="relative inline-flex items-center gap-2 bg-white border border-violet-200 text-violet-700 text-sm font-bold px-5 py-2 rounded-full mb-8 shadow-sm">
        <HiSparkles className="text-violet-500" />
        منصة إدارة الصالونات الأذكى في المنطقة
      </div>

      {/* Headline */}
      <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6 max-w-4xl">
        أدِر صالونك بكفاءة
        <br />
        <span className="bg-gradient-to-l from-violet-600 to-indigo-500 bg-clip-text text-transparent">
          واحترافية حقيقية
        </span>
      </h1>

      {/* Sub */}
      <p className="relative text-xl text-gray-500 max-w-2xl mb-12 leading-relaxed">
        نظام متكامل يجمع الحجوزات، الموظفين، العملاء، المصاريف، السحوبات، والتقارير في لوحة تحكم واحدة سهلة الاستخدام — بدون تعقيد.
      </p>

      {/* CTAs */}
      <div className="relative flex flex-wrap gap-4 justify-center mb-16">
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-xl shadow-violet-300 hover:shadow-violet-400 hover:-translate-y-0.5"
        >
          ابدأ الآن مجاناً
          <HiArrowLeft className="text-lg" />
        </Link>
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-violet-300 text-gray-700 font-bold px-8 py-4 rounded-2xl text-base transition-all hover:shadow-md"
        >
          تسجيل الدخول
        </Link>
      </div>

      {/* Dashboard preview mockup */}
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100 border border-gray-100 overflow-hidden">
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="mx-auto flex-1 max-w-xs bg-white rounded-lg px-4 py-1 text-xs text-gray-400 text-center border border-gray-100">
              app.m4u.sa/salon/dashboard
            </div>
          </div>
          {/* Fake dashboard content */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-br from-slate-50 to-white" dir="rtl">
            {[
              { label: "إجمالي الزيارات", value: "1,248", color: "bg-violet-500" },
              { label: "الموظفون", value: "12", color: "bg-indigo-500" },
              { label: "العملاء", value: "340", color: "bg-emerald-500" },
              { label: "الإيرادات", value: "52,000 دج", color: "bg-amber-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className={`w-8 h-1.5 rounded-full ${stat.color} mb-3`} />
                <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 grid grid-cols-3 gap-4 bg-gradient-to-br from-slate-50 to-white" dir="rtl">
            {([{ label: "حجوزات اليوم", width: "65%" }, { label: "مدفوعات معلقة", width: "40%" }, { label: "مهام منتهية", width: "80%" }]).map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-20 flex items-end">
                <div className="w-full">
                  <div className="h-1.5 bg-violet-100 rounded-full mb-2">
                    <div className="h-1.5 bg-violet-400 rounded-full" style={{ width: item.width }} />
                  </div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Shadow glow */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-violet-300 blur-2xl opacity-30 rounded-full" />
      </div>
    </section>
  );
}
