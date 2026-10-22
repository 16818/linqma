"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Copy, Check, X } from "lucide-react";

interface AccessCode {
  id: string;
  business_id: string;
  code: string;
  kind: "store" | "table" | "member";
  label?: string | null;
  table_no?: string | null;
  discount_percent?: number | null;
  is_active: boolean;
  max_uses?: number | null;
  used_count: number;
  expires_at?: string | null;
  created_at: string;
}

export function AccessCodesClient({
  initialCodes,
  businessId,
}: {
  initialCodes: AccessCode[];
  businessId: string;
}) {
  const [codes, setCodes] = useState(initialCodes);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [newCode, setNewCode] = useState("");
  const [newKind, setNewKind] = useState<"store" | "table" | "member">("store");
  const [newLabel, setNewLabel] = useState("");
  const [newTableNo, setNewTableNo] = useState("");
  const [newDiscount, setNewDiscount] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      toast.error("کد را وارد کنید");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("order_access_codes")
      .insert({
        business_id: businessId,
        code: newCode.trim().toUpperCase(),
        kind: newKind,
        label: newLabel.trim() || null,
        table_no: newKind === "table" ? newTableNo.trim() || null : null,
        discount_percent: newKind === "member" && newDiscount ? Number(newDiscount) : null,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("این کد قبلاً ثبت شده است");
      } else {
        toast.error("خطا در ساخت کد");
      }
      return;
    }

    setCodes((prev) => [data, ...prev]);
    setNewCode("");
    setNewLabel("");
    setNewTableNo("");
    setNewDiscount("");
    setNewKind("store");
    setShowForm(false);
    toast.success("کد اضافه شد");
    router.refresh();
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`آیا از حذف کد «${code}» مطمئن هستید؟`)) return;

    const { error } = await supabase
      .from("order_access_codes")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("خطا در حذف کد");
      return;
    }

    setCodes((prev) => prev.filter((c) => c.id !== id));
    toast.success("کد حذف شد");
    router.refresh();
  };

  const handleToggle = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("order_access_codes")
      .update({ is_active: !current })
      .eq("id", id);

    if (error) {
      toast.error("خطا در تغییر وضعیت");
      return;
    }

    setCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c))
    );
    toast.success(current ? "کد غیرفعال شد" : "کد فعال شد");
    router.refresh();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success("کد کپی شد");
    setTimeout(() => setCopied(null), 1500);
  };

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/business?code=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(`link-${code}`);
    toast.success("لینک کپی شد");
    setTimeout(() => setCopied(null), 1500);
  };

  const kindLabels: Record<string, string> = {
    store: "کد فروشگاه",
    table: "کد میز",
    member: "کد باشگاه",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">کدهای اشتراک</h1>
          <p className="text-navy/60 text-sm mt-1">
            کدهای دسترسی برای سفارش آنلاین (مخصوص مشتریان حضوری)
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setNewCode(generateCode());
          }}
          className="h-11 px-5 rounded-2xl bg-[#D4AF37] text-white font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[#C4A034] transition"
        >
          <Plus className="w-4 h-4" />
          کد جدید
        </button>
      </div>

      {/* فرم ساخت */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-3xl border border-[#EDE8DF] p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#0F172A]">ساخت کد جدید</h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-8 h-8 rounded-lg bg-[#FAF7F2] flex items-center justify-center hover:bg-[#EFE9DF]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-navy/70">کد</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  dir="ltr"
                  required
                  className="flex-1 h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold text-left font-mono"
                />
                <button
                  type="button"
                  onClick={() => setNewCode(generateCode())}
                  className="h-11 px-3 rounded-xl bg-[#FAF7F2] text-navy text-xs font-bold hover:bg-[#EFE9DF] cursor-pointer"
                >
                  تصادفی
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-navy/70">نوع کد</label>
              <select
                value={newKind}
                onChange={(e) => setNewKind(e.target.value as any)}
                className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold bg-white"
              >
                <option value="store">کد فروشگاه (کلی)</option>
                <option value="table">کد میز</option>
                <option value="member">کد باشگاه (تخفیف)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-navy/70">
                برچسب (اختیاری)
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="مثلاً میز ۱۲ یا باشگاه طلایی"
                className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold"
              />
            </div>

            {newKind === "table" && (
              <div>
                <label className="text-sm font-medium text-navy/70">
                  شماره میز
                </label>
                <input
                  type="text"
                  value={newTableNo}
                  onChange={(e) => setNewTableNo(e.target.value)}
                  placeholder="مثلاً ۱۲"
                  maxLength={3}
                  className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold"
                />
              </div>
            )}

            {newKind === "member" && (
              <div>
                <label className="text-sm font-medium text-navy/70">
                  درصد تخفیف
                </label>
                <input
                  type="number"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  placeholder="مثلاً ۱۰"
                  min="0"
                  max="100"
                  className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#0F172A] text-white font-bold cursor-pointer hover:bg-[#1E293B] transition disabled:opacity-60"
          >
            {loading ? "در حال ساخت..." : "ساخت کد"}
          </button>
        </form>
      )}

      {/* لیست کدها */}
      {codes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-12 text-center">
          <p className="text-3xl mb-3">🎫</p>
          <p className="font-bold text-[#0F172A]">هنوز کدی نساخته‌اید</p>
          <p className="text-sm text-[#64748B] mt-1">
            با ساخت کد، مشتریان حضوری می‌توانند سفارش آنلاین ثبت کنند.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {codes.map((code) => (
            <div
              key={code.id}
              className="bg-white rounded-2xl border border-[#EDE8DF] p-4"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      code.is_active ? "bg-[#D4AF37]/15" : "bg-gray-100"
                    }`}
                  >
                    <span className="font-mono font-black text-sm text-[#0F172A]">
                      {code.code.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-lg text-[#0F172A] tracking-widest">
                        {code.code}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#64748B]">
                        {kindLabels[code.kind] || code.kind}
                      </span>
                      {!code.is_active && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                          غیرفعال
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
                      {code.label && <span>{code.label}</span>}
                      {code.table_no && <span>میز {code.table_no}</span>}
                      {code.discount_percent && (
                        <span className="text-green-600 font-bold">
                          {code.discount_percent}% تخفیف
                        </span>
                      )}
                      <span>
                        استفاده: {code.used_count}
                        {code.max_uses ? ` / ${code.max_uses}` : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyCode(code.code)}
                    className="h-9 px-3 rounded-xl bg-[#FAF7F2] text-[#0F172A] text-xs font-bold flex items-center gap-1.5 hover:bg-[#EFE9DF] transition cursor-pointer"
                  >
                    {copied === code.code ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    کد
                  </button>
                  <button
                    onClick={() => copyLink(code.code)}
                    className="h-9 px-3 rounded-xl bg-[#FAF7F2] text-[#0F172A] text-xs font-bold flex items-center gap-1.5 hover:bg-[#EFE9DF] transition cursor-pointer"
                  >
                    {copied === `link-${code.code}` ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    لینک
                  </button>
                  <button
                    onClick={() => handleToggle(code.id, code.is_active)}
                    className={`h-9 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      code.is_active
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {code.is_active ? "غیرفعال" : "فعال"}
                  </button>
                  <button
                    onClick={() => handleDelete(code.id, code.code)}
                    className="h-9 px-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}