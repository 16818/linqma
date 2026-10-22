"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "";

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      setMessage({ type: "err", text: error.message || "ارسال ایمیل ناموفق بود." });
      return;
    }

    setMessage({
      type: "ok",
      text: "اگر این ایمیل ثبت شده باشد، لینک بازیابی ارسال شد. صندوق ورودی و اسپم را چک کنید.",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 font-[Vazirmatn]" dir="rtl">
      <div className="w-full max-w-md rounded-3xl border border-[#EDE8DF] bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-[#0F172A]">بازیابی رمز عبور</h1>
        <p className="mt-2 text-sm text-[#0F172A]/60">
          ایمیل حساب خود را وارد کنید تا لینک تنظیم رمز جدید برایتان ارسال شود.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[#0F172A]">ایمیل</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#EDE8DF] bg-[#FAF7F2] px-4 py-2.5 outline-none focus:border-[#D4AF37]"
            />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.type === "ok" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#0F172A] py-3 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer hover:bg-[#1E293B] transition"
          >
            {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#0F172A]/50">
          <Link href="/login" className="text-[#D4AF37] hover:underline">
            بازگشت به ورود
          </Link>
        </p>
      </div>
    </div>
  );
}