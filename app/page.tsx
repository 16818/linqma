import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] font-[Vazirmatn] text-[#0F172A]" dir="rtl">
      <header className="border-b border-[#EDE8DF] bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-[#D4AF37]">LINQMA</span>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">ورود</Button>
            </Link>
            <Link href="/signup">
              <Button variant="gold">شروع رایگان</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-3xl md:text-5xl font-black leading-tight">
          ویترین دیجیتال کسب‌وکار شما
        </h1>
        <p className="mt-5 text-lg text-[#0F172A]/70 max-w-2xl mx-auto leading-relaxed">
          منوی آنلاین، کاتالوگ محصولات و QR اختصاصی برای کافه، رستوران و فروشگاه —
          ساده، شیک و آماده فروش.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup">
            <Button variant="gold" size="lg" className="w-full sm:w-auto">
              ساخت ویترین
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              ورود به پنل
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-4 text-right">
          {[
            {
              title: "QR اختصاصی",
              desc: "مشتری با اسکن، منو یا کاتالوگ را می‌بیند.",
            },
            {
              title: "مدیریت آسان",
              desc: "محصول، دسته و تنظیمات را از پنل مدیریت کنید.",
            },
            {
              title: "سفارش در باجه",
              desc: "سبد سفارش و QR برای نمایش به صندوق، بدون پرداخت آنلاین.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-sm"
            >
              <h3 className="font-bold text-lg text-[#0F172A]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#0F172A]/60 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#EDE8DF] py-8 text-center text-sm text-[#0F172A]/50">
        © {new Date().getFullYear()} LINQMA
      </footer>
    </div>
  );
}