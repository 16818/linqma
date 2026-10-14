"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { UserPlus, X, Check, Search } from "lucide-react";
import { transferOwnership } from "@/app/admin/actions/transfer-ownership";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
}

export function TransferOwnershipButton({
  businessId,
  currentOwnerId,
}: {
  businessId: string;
  currentOwnerId: string;
}) {
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [search, setSearch] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .eq("role", "business_owner")
        .order("full_name", { ascending: true })
        .limit(100);

      setLoading(false);

      if (error) {
        toast.error("خطا در بارگذاری کاربران");
        return;
      }

      setProfiles(data || []);
    })();
  }, [open, supabase]);

  const filtered = useMemo(() => {
    if (!search.trim()) return profiles;
    const q = search.trim().toLowerCase();
    return profiles.filter(
      (p) =>
        (p.full_name && p.full_name.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        p.id.toLowerCase().includes(q)
    );
  }, [profiles, search]);

  const handleTransfer = async (
    newOwnerId: string,
    fullName: string | null
  ) => {
    if (!confirm(`واگذاری این کسب‌وکار به "${fullName || "بدون نام"}"؟`)) {
      return;
    }

    setTransferring(true);
    const result = await transferOwnership(businessId, newOwnerId);
    setTransferring(false);

    if (!result.ok) {
      toast.error(result.error || "خطا در واگذاری");
      return;
    }

    toast.success("کسب‌وکار با موفقیت واگذار شد");
    setOpen(false);
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-10 px-4 rounded-2xl bg-[#D4AF37] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#C4A034] transition cursor-pointer"
      >
        <UserPlus className="w-4 h-4" />
        واگذاری به مالک
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
          dir="rtl"
          onClick={() => !transferring && setOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#EDE8DF] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-[#0F172A]">
                  واگذاری کسب‌وکار به مالک
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  کاربر را از لیست انتخاب کنید
                </p>
              </div>
              <button
                onClick={() => !transferring && setOpen(false)}
                className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center cursor-pointer hover:bg-[#EFE9DF]"
              >
                <X className="w-4 h-4 text-[#0F172A]" />
              </button>
            </div>

            <div className="p-3 border-b border-[#EDE8DF] shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی نام یا ایمیل..."
                  className="w-full h-10 pr-9 pl-3 rounded-xl border border-[#EDE8DF] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="text-center py-8 text-[#64748B] text-sm">
                  در حال بارگذاری...
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-8 text-[#64748B] text-sm">
                  {search.trim()
                    ? "کاربری با این جستجو پیدا نشد"
                    : "هنوز کاربری ثبت‌نام نکرده"}
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((p) => {
                    const isCurrent = p.id === currentOwnerId;
                    return (
                      <button
                        key={p.id}
                        onClick={() =>
                          !isCurrent &&
                          !transferring &&
                          handleTransfer(p.id, p.full_name)
                        }
                        disabled={isCurrent || transferring}
                        className={`w-full text-right p-3 rounded-xl transition ${
                          isCurrent
                            ? "bg-green-50 border border-green-200 cursor-default"
                            : "bg-[#FAF7F2] hover:bg-[#F5F0E8] cursor-pointer"
                        } disabled:opacity-60`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#0F172A] truncate">
                              {p.full_name || "بدون نام"}
                            </p>
                            {p.email && (
                              <p
                                className="text-[11px] text-[#64748B] mt-0.5 truncate"
                                dir="ltr"
                              >
                                {p.email}
                              </p>
                            )}
                          </div>
                          {isCurrent ? (
                            <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-green-700">
                              <Check className="w-3 h-3" />
                              مالک فعلی
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] text-[#D4AF37] font-bold">
                              انتخاب
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}