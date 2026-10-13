import {
  QrCode,
  Palette,
  ShoppingBag,
  Search,
  Star,
  Clock,
  Sparkles,
  Layers,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "QR اختصاصی",
    desc: "هر کسب‌وکار یک QR منحصر به فرد دارد. مشتری اسکن می‌کند و منو باز می‌شود.",
    color: "from-[#D4AF37] to-[#B8860B]",
  },
  {
    icon: Palette,
    title: "ظاهر حرفه‌ای",
    desc: "ویترین شما شبیه یک وب‌سایت واقعی است، نه یک PDF ساده. قابل تنظیم و زیبا.",
    color: "from-[#0F172A] to-[#1E293B]",
  },
  {
    icon: ShoppingBag,
    title: "سبد خرید و سفارش",
    desc: "مشتری محصولات را انتخاب می‌کند و کد سفارش با QR به صندوق می‌دهد.",
    color: "from-[#C45C26] to-[#A64B2A]",
  },
  {
    icon: Search,
    title: "جستجو در منو",
    desc: "مشتری سریع محصول مورد نظرش را پیدا می‌کند، بدون گشتن در کل لیست.",
    color: "from-[#2D6A4F] to-[#1B4332]",
  },
  {
    icon: Star,
    title: "پیشنهاد امروز و تخفیف",
    desc: "محصولات خاص را برجسته کنید، تخفیف بگذارید و فروش را بالا ببرید.",
    color: "from-[#D4AF37] to-[#B8860B]",
  },
  {
    icon: Clock,
    title: "صندوق هوشمند",
    desc: "صندق‌دار با کد سفارش، اقلام را می‌بیند، ویرایش و تأیید می‌کند.",
    color: "from-[#0F172A] to-[#1E293B]",
  },
];

export function Features() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* سرصفحه */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            امکانات
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#0F172A] leading-tight">
            هر چیزی که برای فروش بیشتر نیاز دارید
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#64748B] leading-relaxed">
            LINQMA همه ابزارهایی را دارد که یک کسب‌وکار کوچک برای ویترین دیجیتال
            حرفه‌ای نیاز دارد.
          </p>
        </div>

        {/* گرید */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-[#FAF7F2] rounded-3xl border border-[#EDE8DF] p-5 hover:border-[#D4AF37] hover:bg-white hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-sm`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-base text-[#0F172A] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* نوار اعتماد */}
        <div className="mt-10 bg-[#0F172A] rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <p className="font-bold text-sm">راه‌اندازی در یک روز</p>
              <p className="text-xs text-white/60 mt-0.5">
                امروز ثبت‌نام، فردا ویترین آماده
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <p className="font-bold text-sm">آپدیت رایگان برای همه</p>
              <p className="text-xs text-white/60 mt-0.5">
                هر قابلیت جدید، رایگان برای شما
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <p className="font-bold text-sm">پشتیبانی فارسی</p>
              <p className="text-xs text-white/60 mt-0.5">
                آموزش راه‌اندازی و راهنماهای تصویری
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}