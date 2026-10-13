import { UserPlus, Store, QrCode, ArrowLeft } from "lucide-react";

const steps = [
  {
    number: "۰۱",
    icon: UserPlus,
    title: "ثبت‌نام کنید",
    desc: "با ایمیل و رمز عبور، در کمتر از یک دقیقه حساب خود را بسازید. بدون نیاز به کارت بانکی.",
  },
  {
    number: "۰۲",
    icon: Store,
    title: "محصولات را وارد کنید",
    desc: "عکس، نام، قیمت و توضیحات محصولات خود را اضافه کنید. می‌توانید دسته‌بندی هم بسازید.",
  },
  {
    number: "۰۳",
    icon: QrCode,
    title: "QR را چاپ کنید",
    desc: "QR اختصاصی خود را دانلود و چاپ کنید. مشتری اسکن می‌کند و ویترین شما باز می‌شود.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#FAF7F2] py-10 md:py-14 relative overflow-hidden">
      {/* پس‌زمینه تزئینی */}
      <div className="absolute top-20 left-0 w-72 h-72 rounded-full bg-[#D4AF37]/5 blur-3xl" />
      <div className="absolute bottom-20 right-0 w-72 h-72 rounded-full bg-[#0F172A]/5 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* سرصفحه */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full mb-4">
            🚀 شروع سریع
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#0F172A] leading-tight">
            در سه مرحله ساده، ویترین شما آماده است
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#64748B] leading-relaxed">
            از ثبت‌نام تا انتشار، کمتر از یک روز طول می‌کشد. ما راه‌اندازی را به
            شما آموزش می‌دهیم.
          </p>
        </div>

        {/* مراحل */}
        <div className="relative">
          {/* خط اتصال دسکتاپ */}
          <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-0.5 bg-gradient-to-l from-[#D4AF37]/30 via-[#D4AF37]/50 to-[#D4AF37]/30" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 text-center hover:border-[#D4AF37] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 relative z-10">
                    {/* شماره */}
                    <div className="absolute -top-3 right-6 bg-[#0F172A] text-[#D4AF37] text-xs font-black px-3 py-1 rounded-full">
                      {step.number}
                    </div>

                    {/* آیکون */}
                    <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-[#D4AF37]" />
                    </div>

                    <h3 className="font-black text-lg text-[#0F172A] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* فلش بین مراحل در موبایل */}
                  {idx < steps.length - 1 && (
                    <div className="md:hidden flex justify-center py-2">
                      <ArrowLeft className="w-5 h-5 text-[#D4AF37] rotate-[-90deg]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* تایم‌لاین کوتاه */}
        <div className="mt-10 bg-white rounded-3xl border border-[#EDE8DF] p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-black text-[#D4AF37]">
                ۱ دقیقه
              </p>
              <p className="text-xs text-[#64748B] mt-1">ثبت‌نام</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-[#D4AF37]">
                ۲ ساعت
              </p>
              <p className="text-xs text-[#64748B] mt-1">وارد کردن محصولات</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-[#D4AF37]">
                ۵ دقیقه
              </p>
              <p className="text-xs text-[#64748B] mt-1">چاپ QR</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-[#2D6A4F]">
                آماده!
              </p>
              <p className="text-xs text-[#64748B] mt-1">ویترین شما فعال است</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}