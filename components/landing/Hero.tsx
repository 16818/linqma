import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, QrCode, Coffee, ArrowLeft } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F2] to-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* متن */}
          <div className="text-center lg:text-right">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              ویترین دیجیتال نسل جدید
            </span>

            <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-black text-[#0F172A] leading-[1.15] tracking-tight">
              ویترین دیجیتال
              <br />
              <span className="text-[#D4AF37]">کسب‌وکار شما</span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-[#64748B] leading-relaxed max-w-xl mx-auto lg:mx-0">
              منوی آنلاین، کاتالوگ محصولات و QR اختصاصی برای کافه، رستوران و
              فروشگاه. ساده، شیک، آماده فروش — در کمتر از ۵ دقیقه.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/signup">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full sm:w-auto gap-2 font-black text-base"
                >
                  شروع رایگان
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-bold"
                >
                  ورود به پنل
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start text-xs text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[10px] text-green-600">
                  ✓
                </span>
                بدون نیاز به دانش فنی
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[10px] text-green-600">
                  ✓
                </span>
                راه‌اندازی در یک روز
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[10px] text-green-600">
                  ✓
                </span>
                پشتیبانی فارسی
              </div>
            </div>
          </div>

          {/* قاب موبایل */}
          <div className="relative flex justify-center lg:justify-end pt-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37]/20 blur-3xl rounded-full scale-90" />

              <div className="relative w-[270px] sm:w-[300px] bg-[#0F172A] rounded-[3rem] p-3 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4),0_0_0_2px_rgba(212,175,55,0.15)]">
                <div className="absolute -left-1 top-24 w-1 h-12 bg-[#1E293B] rounded-l-md" />
                <div className="absolute -left-1 top-40 w-1 h-12 bg-[#1E293B] rounded-l-md" />
                <div className="absolute -right-1 top-32 w-1 h-16 bg-[#1E293B] rounded-r-md" />

                <div className="bg-[#FAF7F2] rounded-[2.4rem] overflow-hidden">
                  <div className="bg-[#0F172A] px-5 py-2.5 flex items-center justify-between">
                    <span className="text-[9px] text-white/70 font-medium">
                      ۹:۴۱
                    </span>
                    <div className="w-14 h-4 bg-black rounded-full" />
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-white/70 font-medium">
                        ۴G
                      </span>
                      <div className="w-4 h-2 border border-white/40 rounded-sm relative">
                        <div className="absolute inset-0.5 right-0 bg-white/70 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="relative h-24 bg-gradient-to-br from-[#3a1f0a] via-[#5c2e10] to-[#2a1505]">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_50%,#8b4513_0%,transparent_60%),radial-gradient(circle_at_70%_80%,#d4af37_0%,transparent_50%)]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <span className="absolute top-2.5 right-3 inline-flex items-center gap-1 text-[7px] font-bold bg-green-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      اکنون باز است
                    </span>
                  </div>

                  <div className="relative -mt-8 flex justify-center">
                    <div className="w-[68px] h-[68px] rounded-full border-[3px] border-white bg-[#0F172A] flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(0,0,0,0.3)]">
                      <Coffee
                        className="w-8 h-8 text-[#D4AF37]"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-center px-3">
                    <p className="text-[13px] font-black text-[#0F172A] tracking-tight">
                      کافئین پلاس ۲
                    </p>
                    <p className="text-[8px] text-[#64748B] mt-0.5">
                      طعمی به یاد ماندنی و خاطره‌ای خوش
                    </p>
                  </div>

                  <div className="flex gap-1 px-3 mt-3 overflow-hidden">
                    <span className="text-[8px] font-bold bg-[#0F172A] text-white px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-0.5">
                      <Coffee className="w-2 h-2" />
                      همه
                    </span>
                    <span className="text-[8px] font-medium bg-white border border-[#EDE8DF] text-[#475569] px-2.5 py-1 rounded-full whitespace-nowrap">
                      coffee
                    </span>
                    <span className="text-[8px] font-medium bg-white border border-[#EDE8DF] text-[#475569] px-2.5 py-1 rounded-full whitespace-nowrap">
                      cake
                    </span>
                  </div>

                  <div className="px-3 mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[8px] font-black text-[#0F172A] flex items-center gap-1">
                        ⭐ پیشنهاد امروز
                      </p>
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden border-2 border-[#D4AF37]">
                      <div className="flex items-center gap-2 p-1.5">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#a0522d] to-[#8b4513] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] font-bold text-[#0F172A] truncate">
                            قهوه اسپرسو ۷۰/۳۰
                          </p>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-[7px] text-[#94A3B8] line-through">
                              ۱۳۰,۰۰۰
                            </span>
                            <span className="text-[8px] font-black text-[#DC2626]">
                              ۱۰۹,۰۰۰
                            </span>
                          </div>
                        </div>
                        <span className="text-[7px] font-black bg-[#DC2626] text-white px-1.5 py-0.5 rounded-full shrink-0">
                          ٪۱۶
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 px-3 pt-2 pb-3">
                    <div className="bg-white rounded-lg overflow-hidden border border-[#EDE8DF]">
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#6b3410] via-[#a0522d] to-[#3a1f0a]" />
                      <div className="p-1.5">
                        <p className="text-[7px] font-bold text-[#0F172A] truncate">
                          کاپوچینو
                        </p>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[7px] font-black text-[#D4AF37]">
                            ۱۴۵,۰۰۰
                          </span>
                          <span className="w-3 h-3 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-[8px] font-black">
                            +
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg overflow-hidden border border-[#EDE8DF]">
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#d4af37] via-[#b8860b] to-[#8b6508]" />
                      <div className="p-1.5">
                        <p className="text-[7px] font-bold text-[#0F172A] truncate">
                          کیک شکلاتی
                        </p>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[7px] font-black text-[#D4AF37]">
                            ۸۰,۰۰۰
                          </span>
                          <span className="w-3 h-3 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-[8px] font-black">
                            +
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-2 -right-4 bg-white rounded-2xl shadow-xl border border-[#EDE8DF] p-2.5 flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#0F172A]">
                    QR منو
                  </p>
                  <p className="text-[8px] text-[#64748B]">آماده چاپ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}