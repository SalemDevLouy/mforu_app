import Link from "next/link";

export function LandingNavbar() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 px-6 py-4 flex items-center justify-between" dir="rtl">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200">
          <span className="text-white font-extrabold text-base">M</span>
        </div>
        <span className="text-xl font-extrabold text-gray-800 tracking-tight">M4U</span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a href="#features" className="hover:text-violet-600 transition-colors">المميزات</a>
        <a href="#how" className="hover:text-violet-600 transition-colors">كيف يعمل</a>
        <a href="#stats" className="hover:text-violet-600 transition-colors">إحصائيات</a>
        <a href="#testimonials" className="hover:text-violet-600 transition-colors">آراء العملاء</a>
      </nav>

      <Link
        href="/auth/signin"
        className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm shadow-violet-200"
      >
        تسجيل الدخول
      </Link>
    </header>
  );
}
