"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "چقدر طول می‌کشد تا ویترین من آماده شود؟",
    a: "در کمتر از یک روز. ثبت‌نام یک دقیقه، وارد کردن محصولات حدود ۲ ساعت، و چاپ QR پنج دقیقه. اگر اطلاعات آماده باشد، همان روز می‌توانید ویترین را با مشتری‌ها به اشتراک بگذارید.",
  },
  {
    q: "آیا به دانش فنی نیاز دارم؟",
    a: "نه. پنل LINQMA کاملاً فارسی و ساده طراحی شده. فقط باید بتوانید از گوشی یا کامپیوتر استفاده کنید. یک ویدیوی آموزشی هم هنگام راه‌اندازی برایتان می‌فرستیم.",
  },
  {
    q: "مشتری‌ها چطور منو را می‌بینند؟",
    a: "دو راه: (۱) با اسکن QR اختصاصی که چاپ می‌کنید، (۲) با لینک کوتاه که برایتان ساخته می‌شود. QR را می‌توانید روی میز، منو، یا ویترین مغازه بچسبانید.",
  },
  {
    q: "اگر مشتری سفارش بدهد، پول چطور منتقل می‌شود؟",
    a: "LINQMA پرداخت آنلاین ندارد. مشتری محصولات را در سبد انتخاب می‌کند، کد سفارش می‌گیرد، و آن کد یا QR را به صندوق نشان می‌دهد. پرداخت همان‌جا در باجه انجام می‌شود.",
  },
  {
    q: "آیا می‌توانم محصولات را بعداً تغییر دهم؟",
    a: "بله، هر زمان. وارد پنل می‌شوید، محصول جدید اضافه می‌کنید یا محصول موجود را ویرایش می‌کنید. تغییرات بلافاصله در ویترین نمایش داده می‌شود.",
  },
  {
    q: "اگر بعداً بخواهم پلن را ارتقا بدهم چه می‌شود؟",
    a: "هر زمان می‌توانید ارتقا دهید. فقط تفاوت قیمت را می‌پردازید. محصولات، دسته‌ها و سفارش‌های شما حفظ می‌شوند و چیزی از دست نمی‌رود.",
  },
  {
    q: "آپدیت‌ها هزینه دارند؟",
    a: "نه. آپدیت‌ها برای همه پلن‌ها رایگان است. هر قابلیت جدیدی که به LINQMA اضافه شود، بدون هزینه اضافه در اختیار شما قرار می‌گیرد.",
  },
  {
    q: "اگر مشکلی پیش بیاید، چطور کمک می‌گیرم؟",
    a: "راهنما و ویدیوهای آموزشی در پنل شما موجود است. اگر مشکل فنی باشد، از طریق تماس تلفنی یا واتساپ پیگیری می‌کنیم. آموزش اولیه راه‌اندازی هم تلفنی یا حضوری انجام می‌شود.",
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-[#FAF7F2] py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4">
        {/* سرصفحه */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            سؤالات متداول
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#0F172A] leading-tight">
            هر سؤالی دارید، جوابش اینجاست
          </h2>
        </div>

        {/* لیست سؤالات */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-[#D4AF37] shadow-[0_8px_24px_-8px_rgba(212,175,55,0.25)]"
                    : "border-[#EDE8DF]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-right cursor-pointer"
                >
                  <span
                    className={`font-bold text-sm md:text-base transition-colors ${
                      isOpen ? "text-[#0F172A]" : "text-[#0F172A]/85"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isOpen
                        ? "bg-[#D4AF37] text-white rotate-180"
                        : "bg-[#FAF7F2] text-[#64748B]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 md:px-5 pb-5 text-sm text-[#64748B] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* دعوت به تماس */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#64748B]">
            سؤال دیگری دارید؟{" "}
            <a
              href="tel:09015754167"
              className="font-bold text-[#D4AF37] hover:underline"
              dir="ltr"
            >
              0901-575-4167
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}