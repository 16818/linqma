import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#F7F6F3] font-[Vazirmatn] text-[#0F172A]"
      dir="rtl"
    >
      {/* هدر */}
      <header className="sticky top-0 z-50 border-b border-[#EDE8DF] bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* لوگو */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center">
              <span className="text-white font-black text-lg leading-none">
                L
              </span>
            </div>
            <div>
              <p className="font-black text-[#0F172A] text-base leading-none">
                LINQMA
              </p>
              <p className="text-[9px] text-[#64748B] mt-0.5 hidden sm:block">
                ویترین دیجیتال کسب‌وکار
              </p>
            </div>
          </Link>

          {/* منو */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a
              href="#features"
              className="text-[#64748B] hover:text-[#0F172A] transition font-medium"
            >
              امکانات
            </a>
            <a
              href="#how"
              className="text-[#64748B] hover:text-[#0F172A] transition font-medium"
            >
              چطور کار می‌کند
            </a>
            <a
              href="#pricing"
              className="text-[#64748B] hover:text-[#0F172A] transition font-medium"
            >
              قیمت‌ها
            </a>
            <a
              href="#faq"
              className="text-[#64748B] hover:text-[#0F172A] transition font-medium"
            >
              سؤالات متداول
            </a>
          </nav>

          {/* دکمه‌ها */}
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">
                ورود
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="gold" className="text-sm">
                شروع رایگان
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* بخش‌ها */}
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="how">
          <HowItWorks />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <div id="faq">
          <FAQ />
        </div>
        <CTA />
      </main>

      {/* فوتر */}
      <Footer />

      {/* دکمه بازگشت به بالا */}
      <ScrollToTop />
    </div>
  );
}