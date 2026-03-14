import Link from "next/link";
import { HiArrowLeft, HiCheckCircle } from "react-icons/hi2";

const perks = [
  "لا يلزم بطاقة ائتمانية",
  "إعداد في أقل من ٥ دقائق",
  "دعم فني مجاني",
  "بيانات آمنة ومشفّرة",
];

export function CTABanner() {
  return (
    <section className="px-6 py-24 bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 rounded-[2.5rem] p-12 md:p-16 text-center shadow-2xl shadow-violet-200 relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-400/20 blur-2xl" />

        <div className="relative">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            ابدأ اليوم
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            جاهز لتطوير صالونك؟
          </h2>
          <p className="text-violet-200 mb-8 text-base max-w-xl mx-auto leading-relaxed">
            انضم لأكثر من ٥٠٠ صالون يستخدمون M4U الآن. لا تعقيد، لا فوضى — فقط إدارة أذكى.
          </p>

          {/* Perks */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-10">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-2 text-violet-100 text-sm">
                <HiCheckCircle className="text-violet-300 text-base shrink-0" />
                {p}
              </div>
            ))}
          </div>

          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-extrabold px-10 py-4 rounded-2xl hover:bg-violet-50 transition-all text-base shadow-xl shadow-violet-900/30 hover:-translate-y-0.5"
          >
            ابدأ الآن مجاناً
            <HiArrowLeft className="text-lg" />
          </Link>
        </div>
      </div>
    </section>
  );
}
