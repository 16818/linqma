import type { Metadata } from "next";
import Link from "next/link";
import { PlanCard } from "@/components/pricing/PlanCard";
import { PLANS, SUPPORT_WHATSAPP, type PlanId } from "@/lib/plans";

export const metadata: Metadata = {
  title: "قیمت‌گذاری | LINQMA",
  description: "پکیج‌های پایه، حرفه‌ای و ویژه ویترین دیجیتال LINQMA",
};

const ORDER: PlanId[] = ["basic", "pro", "premium"];

export default function PricingPage() {
  const consult = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
    "سلام، درباره پکیج‌های LINQMA مشاوره می‌خواهم."
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-[Vazirmatn] text-[#0F172A]" dir="rtl">
      {/* هدر */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Link href="/" className="text-lg font-bold text-[#0F172A]">
          LINQMA
        </Link>
        <a
          href={consult}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#0F172A]/70 hover:text-[#D4AF37] transition"
        >
          مشاوره رایگان
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20">
        {/* عنوان */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold md:text-4xl">
            پکیج مناسب کسب‌وکار شما
          </h1>
          <p className="mt-3 text-[#0F172A]/65 leading-relaxed">
            ویترین موبایلی، QR روی میز، و در پکیج‌های بالاتر سفارش و صندوق — بدون
            پیچیدگی پرداخت آنلاین در سایت. راه‌اندازی با هماهنگی مستقیم تیم ما.
          </p>
        </div>

        {/* کارت‌ها */}
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
          {ORDER.map((id) => (
            <PlanCard key={id} planId={id} />
          ))}
        </div>

        {/* جدول مقایسه خلاصه */}
        <div className="mt-16 overflow-x-auto rounded-3xl border border-[#EDE8DF] bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead>
              <tr className="border-b border-[#EDE8DF] bg-[#FAF7F2]/80">
                <th className="p-4 font-semibold">امکانات</th>
                <th className="p-4 font-semibold">{PLANS.basic.label}</th>
                <th className="p-4 font-semibold text-[#D4AF37]">
                  {PLANS.pro.label}
                </th>
                <th className="p-4 font-semibold">{PLANS.premium.label}</th>
              </tr>
            </thead>
            <tbody className="text-[#0F172A]/80">
              <tr className="border-b border-[#EDE8DF]">
                <td className="p-4">سقف محصول</td>
                <td className="p-4">{PLANS.basic.productLimit}</td>
                <td className="p-4">{PLANS.pro.productLimit}</td>
                <td className="p-4">{PLANS.premium.productLimit}</td>
              </tr>
              <tr className="border-b border-[#EDE8DF]">
                <td className="p-4">سفارش و صندوق</td>
                <td className="p-4">—</td>
                <td className="p-4 text-[#D4AF37]">✓</td>
                <td className="p-4 text-[#D4AF37]">✓</td>
              </tr>
              <tr className="border-b border-[#EDE8DF]">
                <td className="p-4">آرشیو سفارش</td>
                <td className="p-4">—</td>
                <td className="p-4">{PLANS.pro.orderRetentionDays} روز</td>
                <td className="p-4">{PLANS.premium.orderRetentionDays} روز</td>
              </tr>
              <tr>
                <td className="p-4">حذف برند LINQMA</td>
                <td className="p-4">—</td>
                <td className="p-4">—</td>
                <td className="p-4 text-[#D4AF37]">✓</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-10 text-center text-sm text-[#0F172A]/50 leading-relaxed">
          پس از انتخاب پکیج، از طریق واتساپ هماهنگ می‌کنیم · پرداخت توافقی · تحویل
          لینک، QR و دسترسی پنل
        </p>
      </main>
    </div>
  );
}