"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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

export function AdminBusinessesClient({
  initialBusinesses,
}: {
  initialBusinesses: Business[];
}) {
  const [items, setItems] = useState(initialBusinesses);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const togglePublish = async (b: Business) => {
    const { error } = await supabase
      .from("businesses")
      .update({ is_published: !b.is_published })
      .eq("id", b.id);
    if (!error) {
      setItems((prev) =>
        prev.map((x) =>
          x.id === b.id ? { ...x, is_published: !b.is_published } : x
        )
      );
    } else {
      alert(error.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("حذف این کسب‌وکار؟")) return;
    const { error } = await supabase.from("businesses").delete().eq("id", id);
    if (!error) setItems((prev) => prev.filter((x) => x.id !== id));
    else alert(error.message);
  };

  const createBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("وارد شوید");
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

    if (error) alert(error.message);
    else if (data) {
      setItems((prev) => [data as Business, ...prev]);
      setName("");
      setSlug("");
    }
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={createBusiness}
        className="bg-white rounded-3xl border border-[#EDE8DF] p-5 space-y-3"
      >
        <h2 className="font-bold text-[#0F172A]">افزودن کسب‌وکار</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام کسب‌وکار"
          required
          className="w-full h-11 px-4 rounded-2xl border border-[#EDE8DF]"
        />
        <input
          value={slug}
          onChange={(e) =>
            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          placeholder="slug انگلیسی"
          required
          className="w-full h-11 px-4 rounded-2xl border border-[#EDE8DF]"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-11 px-5 rounded-2xl bg-[#D4AF37] text-[#0F172A] font-bold"
        >
          {loading ? "..." : "ایجاد"}
        </button>
      </form>

      <div className="space-y-3">
        {items.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-[#EDE8DF] p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between"
          >
            <div>
              <div className="font-bold text-[#0F172A]">{b.name}</div>
              <div className="text-xs text-[#0F172A]/50 mt-1">
                /business/{b.slug} · {b.plan || "basic"} ·{" "}
                {b.is_published ? "منتشر" : "پیش‌نویس"}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/business/${b.slug}`}
                target="_blank"
                className="h-9 px-3 rounded-xl border border-[#EDE8DF] text-sm flex items-center"
              >
                مشاهده
              </Link>
              <button
                onClick={() => togglePublish(b)}
                className="h-9 px-3 rounded-xl bg-[#F5F0E8] text-sm"
              >
                {b.is_published ? "غیرفعال" : "انتشار"}
              </button>
              <button
                onClick={() => remove(b.id)}
                className="h-9 px-3 rounded-xl bg-red-50 text-red-600 text-sm"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-[#0F172A]/50 py-10">
            هنوز کسب‌وکاری نیست
          </div>
        )}
      </div>
    </div>
  );
}