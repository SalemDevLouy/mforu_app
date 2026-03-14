import { HiStar } from "react-icons/hi2";

const testimonials = [
  {
    name: "هتهات.ر",
    role: "مالك صالون rawan ",
    body: "قبل M4U كنت أستخدم دفتر ورقي لكل شيء. الآن أتابع إيراداتي ومصاريفي وموظفيني من هاتفي في ثوانٍ. فرق كبير جداً.",
    initials: "أز",
    color: "bg-violet-500",
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white py-24 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            آراء العملاء
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            ماذا يقول أصحاب الصالونات؟
          </h2>
          {/* <p className="text-lg text-gray-500 max-w-xl mx-auto">
            أكثر من  صالون يثقون في M4U لإدارة أعمالهم اليومية.
          </p> */}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                  <HiStar key={k} className="text-amber-400 text-base" />
                ))}
              </div>
              {/* Body */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1">&ldquo;{t.body}&rdquo;</p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-11 h-11 rounded-2xl ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
