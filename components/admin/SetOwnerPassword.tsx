"use client";

import { useState } from "react";
import { setOwnerPasswordAction } from "@/app/admin/actions/set-owner-password";
import { toast } from "sonner";
import { Copy, KeyRound } from "lucide-react";

export function SetOwnerPassword({ businessId }: { businessId: string }) {
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [custom, setCustom] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setTempPassword(null);

    const res = await setOwnerPasswordAction({
      businessId,
      password: custom.trim() || undefined,
    });

    setLoading(false);

    if (!res.ok) {
      setError(res.message);
      toast.error(res.message);
      return;
    }

    setTempPassword(res.tempPassword);
    toast.success("رمز موقت با موفقیت تنظیم شد");
  }

  function copyPassword() {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    toast.success("رمز کپی شد");
  }

  return (
    <div className="rounded-3xl border border-[#EDE8DF] bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <KeyRound className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="font-bold text-[#0F172A]">تنظیم رمز عبور مالک</h3>
      </div>
      <p className="text-xs text-[#0F172A]/55 leading-relaxed">
        اگر مشتری به ایمیل خود دسترسی ندارد، می‌توانید یک رمز موقت برای او تنظیم
        کنید و تلفنی یا پیامکی به او بدهید. پس از ورود، از تنظیمات رمز را عوض
        کند.
      </p>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[#0F172A]/60">
          رمز دلخواه (اختیاری، حداقل ۸ کاراکتر)
        </label>
        <input
          type="text"
          placeholder="خالی = رمز تصادفی تولید می‌شود"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="w-full rounded-xl border border-[#EDE8DF] bg-[#FAF7F2] px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-2xl bg-[#0F172A] py-2.5 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer hover:bg-[#1E293B] transition"
      >
        {loading ? "در حال تنظیم..." : "تنظیم / تولید رمز موقت"}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {tempPassword && (
        <div className="rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-4 text-center space-y-2">
          <p className="text-xs text-[#0F172A]/60">
            رمز موقت (فقط همین‌جا نمایش داده می‌شود)
          </p>
          <p className="font-mono text-lg font-bold tracking-widest text-[#0F172A]">
            {tempPassword}
          </p>
          <button
            type="button"
            onClick={copyPassword}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            کپی رمز
          </button>
        </div>
      )}
    </div>
  );
}