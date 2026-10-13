import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Phone } from "lucide-react";

export function CTA() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative bg-gradient-to-br from-[#0F172A] via-[#0B1B33] to-[#1E293B] rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
          {/* تزئینات */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          {/* محتوا */}
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              همین امروز شروع کنید
            </span>

            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
              ویترین دیجیتال کسب‌وکار خود را
              <br />
              <span className="text-[#D4AF37]">همین امروز بسازید</span>
            </h2>

            <p className="mt-5 text-sm md:text-base text-white/70 leading-relaxed">
              در کمتر از یک روز، منوی آنلاین حرفه‌ای خود را داشته باشید. بدون
              نیاز به دانش فنی، بدون اشتراک ماهانه.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full sm:w-auto gap-2 font-black"
                >
                  شروع رایگان
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <a href="tel:09015754167">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  <Phone className="w-4 h-4" />
                  مشاوره تلفنی
                </Button>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/50">
              <span>✓ راه‌اندازی در یک روز</span>
              <span>✓ آپدیت رایگان</span>
              <span>✓ پشتیبانی فارسی</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}