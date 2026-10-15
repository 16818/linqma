"use client";

import { useState } from "react";
import { createOwnerUser } from "@/app/admin/actions/create-user";
import { toast } from "sonner";
import { Plus, X, Copy, Check } from "lucide-react";

export function CreateOwnerForm() {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessSlug, setBusinessSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const [createdSecret, setCreatedSecret] = useState<{
    email: string;
    password: string;
    businessId?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setCreatedSecret(null);

    const result = await createOwnerUser({
      fullName,
      email,
      password: password || undefined,
      businessName: businessName || undefined,
      businessSlug: businessSlug || undefined,
    });

    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setCreatedSecret({
      email: result.email,
      password: result.password,
      businessId: result.businessId,
    });

    toast.success(
      result.businessId
        ? "کاربر و کسب‌وکار ساخته شد"
        : "کاربر ساخته شد — رمز را به مشتری بدهید"
    );

    // پاک کردن فرم
    setFullName("");
    setEmail("");
    setPassword("");
    setBusinessName("");
    setBusinessSlug("");
  }

  function copyCredentials() {
    if (!createdSecret) return;

    const text = `ایمیل: ${createdSecret.email}\nرمز: ${createdSecret.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("اطلاعات کپی شد");
    setTimeout(() => setCopied(false), 2000);
  }

  function closeAndReset() {
    setOpen(false);
    setCreatedSecret(null);
    setCopied(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-11 px-5 rounded-2xl bg-[#0B1B33] text-white font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[#1E293B] transition"
      >
        <Plus className="w-4 h-4" />
        ساخت کاربر و کسب‌وکار
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
          dir="rtl"
          onClick={() => !loading && closeAndReset()}
        >
          <div
            className="bg-white w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* هدر */}
            <div className="sticky top-0 z-10 bg-white border-b border-[#EDE8DF] p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#0F172A]">
                  ساخت کاربر جدید
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  کاربر به عنوان صاحب کسب‌وکار ساخته می‌شود
                </p>
              </div>
              <button
                onClick={closeAndReset}
                disabled={loading}
                className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center cursor-pointer hover:bg-[#EFE9DF]"
              >
                <X className="w-4 h-4 text-[#0F172A]" />
              </button>
            </div>

            {createdSecret ? (
              // نمایش اطلاعات ورود
              <div className="p-5 space-y-4">
                <div className="text-center py-3">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-7 h-7 text-green-600" strokeWidth={3} />
                  </div>
                  <p className="font-bold text-[#0F172A]">
                    کاربر با موفقیت ساخته شد
                  </p>
                  <p className="text-xs text-[#64748B] mt-1">
                    این اطلاعات را یک‌بار کپی کنید و به مشتری بدهید
                  </p>
                </div>

                <div className="bg-[#FAF7F2] rounded-2xl p-4 space-y-2">
                  <div>
                    <p className="text-[10px] text-[#64748B] mb-1">ایمیل</p>
                    <p
                      className="font-mono text-sm text-[#0F172A] break-all"
                      dir="ltr"
                    >
                      {createdSecret.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B] mb-1">رمز عبور</p>
                    <p
                      className="font-mono text-sm text-[#0F172A] break-all"
                      dir="ltr"
                    >
                      {createdSecret.password}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    ⚠️ این رمز دیگر نمایش داده نمی‌شود. الان کپی کنید.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copyCredentials}
                    className="flex-1 h-11 rounded-2xl bg-[#D4AF37] text-white font-bold cursor-pointer hover:bg-[#C4A034] transition flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        کپی شد
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        کپی اطلاعات
                      </>
                    )}
                  </button>
                  <button
                    onClick={closeAndReset}
                    className="flex-1 h-11 rounded-2xl bg-white border border-[#EDE8DF] text-[#0F172A] font-bold cursor-pointer hover:bg-[#EFE9DF] transition"
                  >
                    بستن
                  </button>
                </div>
              </div>
            ) : (
              // فرم ساخت
              <form onSubmit={onSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#0F172A]/70">
                    نام کامل *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="مثلاً علی رضایی"
                    className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#0F172A]/70">
                    ایمیل *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@example.com"
                    dir="ltr"
                    className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-[#D4AF37] text-left"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#0F172A]/70">
                    رمز عبور
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="خالی = رمز خودکار تولید می‌شود"
                    dir="ltr"
                    className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-[#D4AF37] text-left"
                  />
                  <p className="mt-1 text-xs text-[#64748B]">
                    اگر خالی باشد، رمز ۱۰ کاراکتری خودکار ساخته می‌شود
                  </p>
                </div>

                <div className="border-t border-[#EDE8DF] pt-4 mt-4">
                  <p className="text-sm font-bold text-[#0F172A] mb-1">
                    اطلاعات کسب‌وکار
                  </p>
                  <p className="text-xs text-[#64748B] mb-3">
                    اختیاری — اگر پر شود، کسب‌وکار هم ساخته می‌شود
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-[#0F172A]/70">
                        نام کسب‌وکار
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="مثلاً کافه روژان"
                        className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#0F172A]/70">
                        آدرس اختصاصی (slug)
                      </label>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-sm text-[#64748B] whitespace-nowrap">
                          linqma.ir/
                        </span>
                        <input
                          type="text"
                          value={businessSlug}
                          onChange={(e) =>
                            setBusinessSlug(
                              e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "")
                            )
                          }
                          placeholder="cafe-rozhan"
                          dir="ltr"
                          className="flex-1 h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-[#D4AF37] text-left"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-[#0F172A] text-white font-bold cursor-pointer hover:bg-[#1E293B] transition disabled:opacity-60"
                >
                  {loading ? "در حال ساخت..." : "ساخت کاربر"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}