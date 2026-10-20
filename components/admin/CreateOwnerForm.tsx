"use client";

import { useState } from "react";
import { createOwnerUser } from "@/app/admin/actions/create-user";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { DeliveryPack } from "./DeliveryPack";

export function CreateOwnerForm() {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessSlug, setBusinessSlug] = useState("");
  const [plan, setPlan] = useState("basic");
  const [loading, setLoading] = useState(false);

  const [createdSecret, setCreatedSecret] = useState<{
    email: string;
    password: string;
    slug?: string;
    businessName?: string;
    plan?: string;
    logoUrl?: string | null;
  } | null>(null);

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
      plan: plan,
    });

    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setCreatedSecret({
      email: result.email,
      password: result.password,
      slug: result.slug,
      businessName: businessName || undefined,
      plan: result.plan,
      logoUrl: result.logoUrl,
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
    setPlan("basic");
  }

  function closeAndReset() {
    setOpen(false);
    setCreatedSecret(null);
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
            <div className="sticky top-0 z-10 bg-white border-b border-[#EDE8DF] p-4 flex items-center justify-between print:hidden">
              <div>
                <h3 className="font-bold text-[#0F172A]">
                  {createdSecret ? "بسته تحویل" : "ساخت کاربر جدید"}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {createdSecret
                    ? "اطلاعات ورود و لینک ویترین"
                    : "کاربر به عنوان صاحب کسب‌وکار ساخته می‌شود"}
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
              <div className="p-5">
                <DeliveryPack
                  email={createdSecret.email}
                  password={createdSecret.password}
                  slug={createdSecret.slug}
                  businessName={createdSecret.businessName}
                  plan={createdSecret.plan}
                  logoUrl={createdSecret.logoUrl}
                />
                <div className="mt-5 print:hidden">
                  <button
                    onClick={closeAndReset}
                    className="w-full h-11 rounded-2xl bg-white border border-[#EDE8DF] text-[#0F172A] font-bold cursor-pointer hover:bg-[#EFE9DF] transition"
                  >
                    ساخت بعدی / بستن
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

                    <div>
                      <label className="text-sm font-medium text-[#0F172A]/70">
                        پکیج (پلن)
                      </label>
                      <select
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-[#D4AF37] bg-white"
                      >
                        <option value="basic">ویترین (پایه)</option>
                        <option value="pro">عملیات (حرفه‌ای)</option>
                        <option value="premium">برند (ویژه)</option>
                      </select>
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