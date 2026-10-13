import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Star } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "پایه",
    tagline: "برای شروع",
    price: "۷.۹",
    icon: Star,
    popular: false,
    features: [
      "ویترین با آدرس اختصاصی",
      "تا ۳۰ محصول",
      "تا ۵ دسته‌بندی",
      "سبد خرید و صفحه سفارش",
      "QR اختصاصی قابل چاپ",
      "دکمه‌های تماس و شبکه‌ها",
      "وضعیت باز/بسته",
      "وضعیت ناموجود محصول",
      "پنل مدیریت ساده",
      "دانلود سفارش‌ها Excel",
      "آموزش راه‌اندازی",
      "آپدیت رایگان",
    ],
    notIncluded: [
      "پیشنهاد امروز",
      "جستجو در منو",
      "صفحه صندوق",
      "تخفیف و قیمت ویژه",
    ],
  },
  {
    id: "pro",
    name: "حرفه‌ای",
    tagline: "برای رشد",
    price: "۱۲.۹",
    icon: Sparkles,
    popular: true,
    features: [
      "همه امکانات پلن پایه",
      "تا ۱۰۰ محصول",
      "تا ۱۵ دسته‌بندی",
      "پیشنهاد امروز",
      "جستجو در منو",
      "تخفیف و قیمت ویژه",
      "صفحه صندوق",
      "ویرایش اقلام سفارش در صندوق",
      "تأیید و حذف سفارش",
    ],
    notIncluded: [],
  },
  {
    id: "premium",
    name: "ویژه",
    tagline: "برای برتری",
    price: "۱۸.۹",
    icon: Crown,
    popular: false,
    features: [
      "همه امکانات پلن حرفه‌ای",
      "محصولات نامحدود",
      "دسته‌های نامحدود",
      "آموزش اختصاصی راه‌اندازی",
      "پشتیبانی اولویت‌دار",
      "به‌روزرسانی آینده رایگان",
      "دسترسی زودتر به قابلیت‌های جدید",
    ],
    notIncluded: [],
  },
];

export function Pricing() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* سرصفحه */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full mb-4">
            💰 پلن‌ها
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#0F172A] leading-tight">
            پلنی که مناسب کسب‌وکار شماست
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#64748B] leading-relaxed">
            پرداخت یک‌بار. بدون اشتراک ماهانه. هر پلن، همه چیزهایی که برای شروع
            نیاز دارید را دارد.
          </p>
        </div>

        {/* کارت‌های قیمت */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-[#FAF7F2] rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-[#D4AF37] shadow-[0_20px_60px_-15px_rgba(212,175,55,0.35)] bg-white"
                    : "border-[#EDE8DF] hover:border-[#D4AF37]/50"
                }`}
              >
                {/* بج پیشنهاد */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-[#D4AF37] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                      <Sparkles className="w-3 h-3" />
                      پیشنهاد ویژه
                    </span>
                  </div>
                )}

                {/* سرصفحه پلن */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      plan.popular
                        ? "bg-[#D4AF37] text-white"
                        : "bg-[#D4AF37]/10 text-[#D4AF37]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#0F172A]">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#64748B]">{plan.tagline}</p>
                  </div>
                </div>

                {/* قیمت */}
                <div className="mb-5 pb-5 border-b border-[#EDE8DF]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#0F172A] tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm text-[#64748B]">میلیون تومان</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    پرداخت یک‌بار، بدون اشتراک
                  </p>
                </div>

                {/* ویژگی‌ها */}
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check
                          className="w-2.5 h-2.5 text-green-600"
                          strokeWidth={3}
                        />
                      </span>
                      <span className="text-[#0F172A]">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li
                      key={`not-${idx}`}
                      className="flex items-start gap-2 text-sm opacity-40"
                    >
                      <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-gray-400 text-[8px]">✕</span>
                      </span>
                      <span className="text-[#64748B] line-through">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* دکمه */}
                <Link href="/signup" className="block">
                  <Button
                    variant={plan.popular ? "gold" : "outline"}
                    className="w-full h-11 font-bold"
                  >
                    شروع با {plan.name}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* متن پایین */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#64748B]">
            نیاز به راهنمایی دارید؟{" "}
            <a
              href="tel:09015754167"
              className="font-bold text-[#D4AF37] hover:underline"
              dir="ltr"
            >
              0901-575-4167
            </a>
          </p>
          <p className="text-xs text-[#64748B]/60 mt-2">
            خدمات اضافی: دامنه اختصاصی، اتصال پیامک، طراحی اختصاصی — با قیمت
            جداگانه
          </p>
        </div>
      </div>
    </section>
  );
}