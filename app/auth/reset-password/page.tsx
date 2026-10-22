"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      else setMessage({ type: "err", text: "لینک نامعتبر یا منقضی است. دوباره درخواست دهید." });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: "err", text: "رمز حداقل ۸ کاراکتر باشد." });
      return;
    }
    if (newPassword !== confirm) {
      setMessage({ type: "err", text: "تکرار رمز یکسان نیست." });
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      setMessage({ type: "err", text: error.message || "ذخیره رمز ناموفق بود." });
      return;
    }

    setMessage({ type: "ok", text: "رمز جدید ذخیره شد. در حال انتقال..." });
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 font-[Vazirmatn]" dir="rtl">
      <div className="w-full max-w-md rounded-3xl border border-[#EDE8DF] bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-[#0F172A]">تنظیم رمز جدید</h1>

        {!ready && !message?.type ? (
          <p className="mt-4 text-sm text-[#0F172A]/60">در حال بررسی لینک...</p>
        ) : null}

        {ready && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-[#0F172A]">رمز جدید</label>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#EDE8DF] bg-[#FAF7F2] px-4 py-2.5 outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#0F172A]">تکرار رمز</label>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-2xl border border-[#EDE8DF] bg-[#FAF7F2] px-4 py-2.5 outline-none focus:border-[#D4AF37]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#0F172A] py-3 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer hover:bg-[#1E293B] transition"
            >
              {loading ? "در حال ذخیره..." : "ذخیره رمز جدید"}
            </button>
          </form>
        )}

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.type === "ok" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-[#0F172A]/50">
          <Link href="/forgot-password" className="text-[#D4AF37] hover:underline">
            درخواست مجدد لینک
          </Link>
        </p>
      </div>
    </div>
  );
}