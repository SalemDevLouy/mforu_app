import Link from "next/link";
import { HiEnvelope, HiPhone } from "react-icons/hi2";

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-base">M</span>
              </div>
              <span className="text-xl font-extrabold text-white">M4U</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              منصة M4U هي نظام إدارة متكامل للصالونات، يجمع الحجوزات والمحاسبة وإدارة الفريق في مكان واحد.
            </p>
            {/* <div className="flex flex-col gap-2 mt-5 text-sm">
              <a href="mailto:support@m4u.sa" className="flex items-center gap-2 hover:text-white transition-colors">
                <HiEnvelope className="text-violet-400" />
                support@m4u.sa
              </a>
              <a href="tel:+966500000000" className="flex items-center gap-2 hover:text-white transition-colors">
                <HiPhone className="text-violet-400" />
                +966 50 000 0000
              </a>
            </div> */}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">المنصة</h4>
            <ul className="space-y-2 text-sm">
              {["المميزات", "كيف يعمل", "الأسعار", "التقارير"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm">الشركة</h4>
            <ul className="space-y-2 text-sm">
              {["من نحن", "التواصل", "سياسة الخصوصية", "شروط الاستخدام"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} M4U — جميع الحقوق محفوظة</p>
          <p className="text-gray-600">صُنع بـ ♥ للصالونات العربية</p>
        </div>
      </div>
    </footer>
  );
}
