"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Store,
  Settings,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  slug: string;
  is_published: boolean;
  plan?: string | null;
  phone?: string | null;
  created_at?: string;
  owner_id?: string;
}

interface BusinessWithStats extends Business {
  productsCount?: number;
  ordersCount?: number;
}

export function AdminBusinessesClient({
  initialBusinesses,
}: {
  initialBusinesses: Business[];
}) {
  const [items, setItems] = useState<BusinessWithStats[]>(initialBusinesses);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim().toLowerCase();
    return items.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.phone && b.phone.includes(q))
    );
  }, [items, searchQuery]);

  const togglePublish = async (b: Business) => {
    const { error } = await supabase
      .from("businesses")
      .update({ is_published: !b.is_published })
      .eq("id", b.id);

    if (error) {
      toast.error("خطا در تغییر وضعیت");
      return;
    }

    setItems((prev) =>
      prev.map((x) =>
        x.id === b.id ? { ...x, is_published: !b.is_published } : x
      )
    );
    toast.success(b.is_published ? "کسب‌وکار غیرفعال شد" : "کسب‌وکار منتشر شد");
    router.refresh();
  };

  const remove = async (id: string, businessName: string) => {
    if (
      !confirm(
        `حذف کسب‌وکار "${businessName}"؟\n\nهشدار: این کار همه محصولات، دسته‌ها و سفارش‌های این کسب‌وکار را حذف می‌کند.`
      )
    )
      return;

    const { error } = await supabase.from("businesses").delete().eq("id", id);

    if (error) {
      toast.error("خطا در حذف کسب‌وکار");
      return;
    }

    setItems((prev) => prev.filter((x) => x.id !== id));
    toast.success("کسب‌وکار حذف شد");
    router.refresh();
  };

  const createBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("ابتدا وارد شوید");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("businesses")
      .insert({
        owner_id: user.id,
        name,
        slug,
        is_published: false,
        plan: "basic",
      })
      .select()
      .single();

    if (error) {
      toast.error("خطا در ساخت کسب‌وکار");
      setLoading(false);
      return;
    }

    setItems((prev) => [data as Business, ...prev]);
    setName("");
    setSlug("");
    setShowForm(false);
    toast.success("کسب‌وکار ساخته شد");
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* نوار بالا */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#0F172A]/40 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی کسب‌وکار (نام، اسلاگ، تلفن)"
            className="w-full h-11 pr-9 pl-3 rounded-2xl border border-[#EDE8DF] bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="h-11 px-5 rounded-2xl bg-[#D4AF37] text-white font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[#C4A034] transition"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              بستن
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              کسب‌وکار جدید
            </>
          )}
        </button>
      </div>

      {/* فرم ساخت */}
      {showForm && (
        <form
          onSubmit={createBusiness}
          className="bg-white rounded-3xl border border-[#EDE8DF] p-5 space-y-3"
        >
          <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            افزودن کسب‌وکار جدید
          </h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام کسب‌وکار"
            required
            className="w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-[#D4AF37]"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#0F172A]/60 whitespace-nowrap">
              linqma.ir/
            </span>
            <input
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              placeholder="slug انگلیسی"
              required
              className="flex-1 h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name || !slug}
            className="h-11 px-6 rounded-2xl bg-[#D4AF37] text-white font-bold cursor-pointer hover:bg-[#C4A034] transition disabled:opacity-50"
          >
            {loading ? "در حال ساخت..." : "ایجاد"}
          </button>
        </form>
      )}

      {/* لیست کسب‌وکارها */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#0F172A]/50">
            {searchQuery
              ? "کسب‌وکاری با این جستجو پیدا نشد"
              : "هنوز کسب‌وکاری نیست"}
          </div>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-[#EDE8DF] p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between hover:border-[#D4AF37] transition"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-[#D4AF37]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#0F172A] truncate">
                    {b.name}
                  </div>
                  <div className="text-xs text-[#0F172A]/50 mt-1 flex items-center gap-2 flex-wrap">
                    <span>/business/{b.slug}</span>
                    <span className="text-[#0F172A]/20">•</span>
                    <span
                      className={`inline-flex items-center gap-1 ${
                        b.is_published ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {b.is_published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          منتشر
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          پیش‌نویس
                        </>
                      )}
                    </span>
                    <span className="text-[#0F172A]/20">•</span>
                    <span className="text-[#D4AF37] font-bold">
                      پلن: {b.plan || "basic"}
                    </span>
                    {b.phone && (
                      <>
                        <span className="text-[#0F172A]/20">•</span>
                        <span dir="ltr">{b.phone}</span>
                      </>
                    )}
                  </div>
                  {b.created_at && (
                    <div className="text-[10px] text-[#0F172A]/40 mt-1">
                      ساخته شده:{" "}
                      {new Date(b.created_at).toLocaleDateString("fa-IR")}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <Link
                  href={`/admin/business/${b.id}`}
                  className="h-9 px-3 rounded-xl bg-[#0B1B33] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#1E293B] transition"
                >
                  <Settings className="w-3.5 h-3.5" />
                  ورود به پنل
                </Link>
                <Link
                  href={`/business/${b.slug}`}
                  target="_blank"
                  className="h-9 px-3 rounded-xl border border-[#EDE8DF] text-xs font-bold flex items-center gap-1 hover:border-[#D4AF37] transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  مشاهده
                </Link>
                <button
                  onClick={() => togglePublish(b)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold cursor-pointer transition ${
                    b.is_published
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {b.is_published ? "غیرفعال" : "انتشار"}
                </button>
                <button
                  onClick={() => remove(b.id, b.name)}
                  className="h-9 px-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold cursor-pointer hover:bg-red-100 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}