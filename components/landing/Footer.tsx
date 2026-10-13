import Link from "next/link";
import { Coffee, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* لوگو و توضیح */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center">
                <Coffee className="w-5 h-5 text-[#0F172A]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#D4AF37] leading-none">
                  LINQMA
                </p>
                <p className="text-[10px] text-white/50 mt-1">
                  ویترین دیجیتال کسب‌وکار
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-md">
              LINQMA به کافه‌ها، رستوران‌ها و کسب‌وکارهای کوچک کمک می‌کند تا
              ویترین دیجیتال حرفه‌ای خود را داشته باشند. ساده، سریع، آماده فروش.
            </p>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-white">دسترسی سریع</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/signup"
                  className="text-white/60 hover:text-[#D4AF37] transition"
                >
                  ثبت‌نام
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-white/60 hover:text-[#D4AF37] transition"
                >
                  ورود به پنل
                </Link>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-white/60 hover:text-[#D4AF37] transition"
                >
                  پلن‌ها و قیمت‌ها
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-white/60 hover:text-[#D4AF37] transition"
                >
                  سؤالات متداول
                </a>
              </li>
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-white">تماس با ما</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:09015754167"
                  className="flex items-center gap-2 text-white/60 hover:text-[#D4AF37] transition"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span dir="ltr">0901-575-4167</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/60">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span dir="ltr">info@linqma.ir</span>
              </li>
              <li className="flex items-start gap-2 text-white/60">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>ایران</span>
              </li>
            </ul>
          </div>
        </div>

        {/* خط جداکننده */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
            <p>
              © {new Date().getFullYear()} LINQMA — تمام حقوق محفوظ است
            </p>
            <p className="flex items-center gap-1.5">
              ساخته شده با
              <span className="text-[#D4AF37]">♥</span>
              برای کسب‌وکارهای ایرانی
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}