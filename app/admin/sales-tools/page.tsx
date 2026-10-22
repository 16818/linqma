import Link from "next/link";
import { PricingQR } from "@/components/admin/PricingQR";
import { requireAdmin } from "@/lib/auth-admin";
import { redirect } from "next/navigation";

export default async function AdminSalesToolsPage() {
  const { ok } = await requireAdmin();
  if (!ok) redirect("/login");

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const pricingUrl = `${base}/pricing`;

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 font-[Vazirmatn] text-[#0F172A]" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">ابزارهای فروش</h1>
        <p className="mt-2 text-sm text-[#0F172A]/60">
          لینک و QR صفحه قیمت‌گذاری برای کارت ویزیت، بروشور و ویزیت حضوری.
        </p>
      </div>

      <section className="rounded-3xl border border-[#EDE8DF] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">صفحه قیمت‌گذاری</h2>
        <p className="mt-1 break-all text-sm text-[#0F172A]/55" dir="ltr">
          {pricingUrl}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            target="_blank"
            className="rounded-2xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#C4A034] transition"
          >
            باز کردن /pricing
          </Link>
          <a
            href={pricingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-[#EDE8DF] px-4 py-2.5 text-sm text-[#0F172A] hover:border-[#D4AF37] transition"
          >
            باز کردن با دامنه سایت
          </a>
        </div>
      </section>

      <section className="rounded-3xl border border-[#EDE8DF] bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">QR Code صفحه قیمت</h2>
        <PricingQR url={pricingUrl} />
        <p className="mt-6 text-center text-xs text-[#0F172A]/45">
          پس از اسکن، مشتری سه پکیج را می‌بیند و از واتساپ سفارش می‌دهد.
        </p>
      </section>
    </div>
  );
}