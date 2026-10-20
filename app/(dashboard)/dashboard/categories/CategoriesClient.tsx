"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { getPlanConfig } from "@/lib/plans";

interface Category {
  id: string;
  name: string;
  icon?: string | null;
  is_active: boolean;
}

const EMOJI_GROUPS = {
  همه: [
    "☕", "🍵", "🍰", "🥐", "🍩", "🧁", "🍪", "🍫",
    "🍔", "🍕", "🍟", "🌭", "🥤", "🍗", "🥪", "🌮",
    "🍽️", "🍲", "🍜", "🥘", "🍱", "🥗", "🍖", "🍚",
    "🛒", "🛍️", "📦", "🏪", "⭐", "✨", "🔥", "❤️",
  ],
  کافه: ["☕", "🍵", "🍰", "🥐", "🍩", "🧁", "🍪", "🍫"],
  "فست‌فود": ["🍔", "🍕", "🍟", "🌭", "🥤", "🍗", "🥪", "🌮"],
  رستوران: ["🍽️", "🍲", "🍜", "🥘", "🍱", "🥗", "🍖", "🍚"],
  نوشیدنی: ["🥤", "🧃", "🥛", "☕", "🍵", "🍷", "🍹", "🧋"],
  دسر: ["🍰", "🍩", "🧁", "🍪", "🍫", "🍦", "🍮", "🎂"],
  فروشگاه: ["🛒", "🛍️", "📦", "🏪", "🧴", "🧺", "🥫", "🍯"],
  سایر: ["⭐", "✨", "🔥", "❤️", "💎", "🎁", "🌟", "💫"],
} as const;

type GroupKey = keyof typeof EMOJI_GROUPS;

export function CategoriesClient({
  initialCategories,
  businessId,
  plan,
  initialCategoryCount,
}: {
  initialCategories: Category[];
  businessId: string;
  plan: string;
  initialCategoryCount: number;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [categoryCount, setCategoryCount] = useState(initialCategoryCount);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [activeGroup, setActiveGroup] = useState<GroupKey>("همه");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const planConfig = useMemo(() => getPlanConfig(plan), [plan]);
  const limit = planConfig.categoryLimit;
  const atLimit = categoryCount >= limit;
  const planLabel = planConfig.label;

  const openAdd = () => {
    if (atLimit) return;
    setEditing(null);
    setName("");
    setIcon("");
    setActiveGroup("همه");
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setIcon(cat.icon || "");
    setActiveGroup("همه");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editing) {
      const { error } = await supabase
        .from("categories")
        .update({ name, icon: icon || null })
        .eq("id", editing.id);

      if (error) {
        toast.error("خطا در ذخیره دسته‌بندی");
        setLoading(false);
        return;
      }

      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id ? { ...c, name, icon: icon || null } : c
        )
      );
      toast.success("دسته‌بندی ویرایش شد");
    } else {
      // بررسی سقف دسته‌بندی در سرور
      const { count, error: countError } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("business_id", businessId);

      if (countError) {
        toast.error("خطا در بررسی سقف پکیج");
        setLoading(false);
        return;
      }

      if ((count ?? 0) >= limit) {
        toast.error(
          `سقف پکیج ${planLabel}: حداکثر ${limit} دسته‌بندی. برای افزودن بیشتر ارتقا دهید.`
        );
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("categories")
        .insert({
          business_id: businessId,
          name,
          icon: icon || null,
        })
        .select()
        .single();

      if (error || !data) {
        toast.error("خطا در ساخت دسته‌بندی");
        setLoading(false);
        return;
      }

      setCategories((prev) => [...prev, data]);
      setCategoryCount((c) => c + 1);
      toast.success("دسته‌بندی اضافه شد");
    }

    setLoading(false);
    setShowForm(false);
    router.refresh();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("آیا از حذف این دسته بندی مطمئن هستید؟")) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      toast.error("خطا در حذف دسته‌بندی");
      return;
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    setCategoryCount((c) => Math.max(0, c - 1));
    toast.success("دسته‌بندی حذف شد");
    router.refresh();
  };

  const groupKeys = Object.keys(EMOJI_GROUPS) as GroupKey[];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">دسته بندی ها</h1>
          <p className="text-navy/60 text-sm mt-1">
            {categoryCount} از {limit} دسته‌بندی (پکیج {planLabel})
          </p>
        </div>
        <Button
          variant="gold"
          className="gap-2"
          onClick={openAdd}
          disabled={atLimit}
        >
          <Plus className="w-5 h-5" />
          افزودن
        </Button>
      </div>

      {atLimit && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          ⚠️ به سقف پکیج {planLabel} رسیده‌اید ({limit} دسته‌بندی). برای افزودن
          بیشتر، پکیج خود را ارتقا دهید.
        </div>
      )}

      <div className="space-y-3">
        {categories.length === 0 ? (
          <EmptyState
            icon="📂"
            title="هنوز دسته‌بندی نساخته‌اید"
            description="دسته‌بندی به مشتری کمک می‌کند سریع‌تر محصول پیدا کند"
            action={{
              label: "+ ساخت اولین دسته",
              onClick: openAdd,
            }}
          />
        ) : (
          categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {cat.icon && <span className="text-xl">{cat.icon}</span>}
                  <h3 className="font-bold text-navy">{cat.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 text-navy/40 hover:text-navy cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 text-navy/40 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showForm && !atLimit && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#EDE8DF] px-5 py-4 rounded-t-3xl sm:rounded-t-3xl">
              <h2 className="text-lg font-bold text-navy">
                {editing ? "ویرایش دسته بندی" : "افزودن دسته بندی"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-navy/70">
                  نام *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-navy/70">
                  آیکون (اختیاری)
                </label>

                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="مثال: ☕"
                    maxLength={2}
                    className="flex-1 h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 text-center text-xl"
                  />
                  {icon && (
                    <button
                      type="button"
                      onClick={() => setIcon("")}
                      className="h-11 px-3 rounded-2xl bg-[#FAF7F2] border border-[#EDE8DF] text-xs font-bold text-navy/60 hover:bg-[#EFE9DF] cursor-pointer"
                    >
                      پاک
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-xs text-navy/50 mb-2">
                    انتخاب از میان پیشنهادها:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {groupKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveGroup(key)}
                        className={cn(
                          "h-8 px-3 rounded-lg text-[11px] font-bold transition cursor-pointer",
                          activeGroup === key
                            ? "bg-[#D4AF37] text-white shadow-sm"
                            : "bg-[#FAF7F2] text-navy/70 hover:bg-[#EFE9DF]"
                        )}
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-8 gap-1 bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl p-2">
                    {EMOJI_GROUPS[activeGroup].map((emoji, idx) => (
                      <button
                        key={`${activeGroup}-${idx}`}
                        type="button"
                        onClick={() => setIcon(emoji)}
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center text-lg transition cursor-pointer",
                          icon === emoji
                            ? "bg-[#D4AF37] shadow-sm"
                            : "hover:bg-white"
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {!editing && categoryCount >= limit && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  ⚠️ به سقف پکیج {planLabel} رسیده‌اید ({limit} دسته‌بندی). برای
                  افزودن بیشتر، پکیج خود را ارتقا دهید.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  className="flex-1"
                  disabled={loading || (!editing && categoryCount >= limit)}
                >
                  {loading ? "..." : editing ? "ذخیره" : "افزودن"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}