import Link from "next/link";
import { Lock } from "lucide-react";

export function UpgradeGate({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-[#EDE8DF] bg-white p-8 text-center shadow-soft space-y-4">
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
        <Lock className="w-7 h-7 text-amber-600" />
      </div>
      <h1 className="text-xl font-bold text-navy">{title}</h1>
      <p className="text-sm text-navy/70 leading-relaxed">{description}</p>
      <Link
        href="/dashboard"
        className="inline-block rounded-2xl bg-[#0F172A] px-6 py-3 text-sm font-bold text-white hover:bg-[#1E293B] transition"
      >
        بازگشت به داشبورد
      </Link>
    </div>
  );
}