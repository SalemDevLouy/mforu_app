import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      {/* Navbar */}
      <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold text-gray-800">M4U</span>
        </div>
        <Link
          href="/auth/signin"
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
        >
          تسجيل الدخول
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-violet-500"></span>
          منصة إدارة الصالونات الذكية
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          أدِر صالونك بكفاءة
          <span className="text-violet-600"> واحترافية</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          نظام متكامل لإدارة الصالونات — الحجوزات، الموظفين، العملاء، المصاريف، والتقارير في مكان واحد.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/auth/signin"
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-7 py-3 rounded-xl text-base transition-colors shadow-lg shadow-violet-200"
          >
            ابدأ الآن
          </Link>
          <Link
            href="/auth/signin"
            className="bg-white border border-gray-200 hover:border-violet-300 text-gray-700 font-semibold px-7 py-3 rounded-xl text-base transition-colors"
          >
            تسجيل الدخول
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: '📅', title: 'إدارة الحجوزات', desc: 'جدولة المواعيد وتتبع الحجوزات بكل سهولة ويسر.' },
          { icon: '👥', title: 'إدارة العملاء', desc: 'سجل بيانات عملائك وتاريخ زياراتهم وديونهم.' },
          { icon: '💼', title: 'إدارة الموظفين', desc: 'تتبع أداء الموظفين وتوزيع المهام والرواتب.' },
          { icon: '💰', title: 'المحاسبة والمصاريف', desc: 'راقب إيرادات ومصاريف صالونك في الوقت الحقيقي.' },
          { icon: '📊', title: 'التقارير والإحصائيات', desc: 'احصل على تقارير تفصيلية لدعم قرارات أعمالك.' },
          { icon: '🔐', title: 'إدارة الصلاحيات', desc: 'تحكم في صلاحيات كل مستخدم بدقة وأمان.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-600 mx-4 mb-16 rounded-3xl p-10 text-center text-white max-w-4xl lg:mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">جاهز لتطوير صالونك؟</h2>
        <p className="text-violet-100 mb-6 text-sm">انضم الآن وابدأ رحلتك نحو إدارة أذكى وأكثر احترافية.</p>
        <Link
          href="/auth/signin"
          className="inline-block bg-white text-violet-700 font-bold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors"
        >
          تسجيل الدخول
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-6 border-t">
        © {new Date().getFullYear()} M4U — جميع الحقوق محفوظة
      </footer>
    </div>
  );
}
