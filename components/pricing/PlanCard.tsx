import { PLANS, whatsappOrderLink, type PlanId } from "@/lib/plans";

export function PlanCard({ planId }: { planId: PlanId }) {
  const plan = PLANS[planId];
  const href = whatsappOrderLink(planId);

  return (
    <article
      className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm ${
        plan.featured
          ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30 scale-[1.02] z-10"
          : "border-[#EDE8DF]"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-[#0F172A]">
          پیشنهاد ما
        </span>
      )}

      <h2 className="text-xl font-bold text-[#0F172A]">{plan.label}</h2>
      <p className="mt-1 text-sm text-[#0F172A]/60">{plan.tagline}</p>

      <p className="mt-6">
        <span className="text-3xl font-extrabold text-[#0F172A]">
          {plan.priceLabel}
        </span>
        <span className="mr-1 text-sm text-[#0F172A]/50">تومان</span>
      </p>
      <p className="mt-1 text-xs text-[#0F172A]/45">
        راه‌اندازی یک‌بار · هماهنگی دستی
      </p>

      <ul className="mt-6 flex-1 space-y-2 text-sm text-[#0F172A]/80">
        {plan.highlights.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-[#D4AF37]">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-8 block rounded-2xl py-3 text-center text-sm font-semibold transition hover:opacity-90 ${
          plan.featured
            ? "bg-[#D4AF37] text-[#0F172A]"
            : "bg-[#0F172A] text-white"
        }`}
      >
        {plan.ctaLabel}
      </a>
    </article>
  );
}