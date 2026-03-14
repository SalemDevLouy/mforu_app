const stats = [
  { value: "+2", label: "صالون يستخدم المنصة", sub: "في مختلف المدن" },
  { value: "+500", label: "حجز تم إدارته", sub: "بشكل تلقائي" },
  { value: "98%", label: "رضا العملاء", sub: "بناءً على التقييمات" },
  { value: "24/7", label: "دعم فني متواصل", sub: "عبر الواتساب والإيميل" },
];

export function StatsSection() {
  return (
    <section id="stats" className="bg-gradient-to-r from-violet-600 to-indigo-600 py-20 px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            أرقام تتحدث عن نفسها
          </h2>
          <p className="text-violet-200 text-base">منصة موثوقة تنمو كل يوم مع مئات الصالونات</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-colors"
            >
              <p className="text-4xl font-extrabold text-white mb-2">{s.value}</p>
              <p className="text-sm font-bold text-violet-100 mb-1">{s.label}</p>
              <p className="text-xs text-violet-300">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
