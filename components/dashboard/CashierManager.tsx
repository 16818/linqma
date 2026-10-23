"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCashierAction,
  deactivateCashierAction,
} from "@/app/(dashboard)/dashboard/actions/cashier";
import { toast } from "sonner";
import { UserPlus, Copy, Check, UserX } from "lucide-react";

export function CashierManager({
  hasFeature,
  existingEmail,
}: {
  hasFeature: boolean;
  existingEmail?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoPassword, setAutoPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  if (!hasFeature) {
    return (
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        ⚠️ مدیریت صندوق‌دار در پکیج حرفه‌ای و ویژه فعال است. برای استفاده، پکیج
        خود را ارتقا دهید.
      </div>
    );
  }

  async function onCreate() {
    if (!email.trim()) {
      toast.error("ایمیل را وارد کنید");
      return;
    }
    setLoading(true);
    setTempPassword(null);
    const res = await createCashierAction({
      email,
      password: autoPassword ? undefined : password,
    });
    console.log("CREATE_CASHIER_RESULT", res);
    setLoading(false);

    if (!res.ok) {
      toast.error(res.message);
      return;
    }

    setTempPassword(res.tempPassword);
    setEmail("");
    setPassword("");
    toast.success("صندوق‌دار ساخته شد");
    router.refresh();
  }

  async function onDeactivate() {
    if (!confirm("آیا از غیرفعال‌سازی صندوق‌دار مطمئن هستید؟")) return;
    setLoading(true);
    const res = await deactivateCashierAction();
    setLoading(false);

    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("صندوق‌دار غیرفعال شد");
    router.refresh();
  }

  function copyPassword() {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    toast.success("رمز کپی شد");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-navy/55 leading-relaxed">
        صندوق‌دار فقط به صفحه صندوق دسترسی دارد: دیدن، ویرایش اقلام و مشخصات
        مشتری، و تأیید سفارش. او نمی‌تواند محصولات را ویرایش کند یا سفارش‌ها را
        حذف کند.
      </p>

      {existingEmail ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-[#FAF7F2] rounded-xl p-3">
            <div>
              <p className="text-xs text-navy/60 mb-0.5">صندوق‌دار فعال</p>
              <p className="font-mono text-sm text-[#0F172A]" dir="ltr">
                {existingEmail}
              </p>
            </div>
            <button
              type="button"
              onClick={onDeactivate}
              disabled={loading}
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
            >
              <UserX className="w-3.5 h-3.5" />
              غیرفعال
            </button>
          </div>
          <p className="text-[10px] text-navy/45">
            برای تغییر رمز، ابتدا صندوق‌دار را غیرفعال کنید و دوباره بسازید.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-navy/70">
              ایمیل صندوق‌دار
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cashier@example.com"
              dir="ltr"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-gold text-left"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoPassword}
              onChange={(e) => setAutoPassword(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-sm text-navy/70">تولید خودکار رمز</label>
          </div>

          {!autoPassword && (
            <div>
              <label className="text-sm font-medium text-navy/70">
                رمز دستی (حداقل ۸ کاراکتر)
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="حداقل ۸ کاراکتر"
                dir="ltr"
                className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-gold text-left font-mono"
              />
            </div>
          )}

          <button
            type="button"
            onClick={onCreate}
            disabled={
              loading ||
              !email.trim() ||
              (!autoPassword && password.trim().length < 8)
            }
            className="w-full h-11 rounded-2xl bg-[#0F172A] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1E293B] transition cursor-pointer disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "در حال ساخت..." : "ساخت صندوق‌دار"}
          </button>
        </div>
      )}

      {tempPassword && (
        <div className="rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-4 text-center space-y-2">
          <p className="text-xs text-navy/60">
            رمز موقت (فقط همین‌جا نمایش داده می‌شود)
          </p>
          <p className="font-mono text-lg font-black tracking-widest text-[#0F172A]">
            {tempPassword}
          </p>
          <button
            type="button"
            onClick={copyPassword}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            کپی رمز
          </button>
        </div>
      )}
    </div>
  );
}