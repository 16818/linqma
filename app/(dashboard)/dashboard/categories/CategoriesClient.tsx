"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  icon?: string | null;
  is_active: boolean;
}

export function CategoriesClient({
  initialCategories,
  businessId,
}: {
  initialCategories: Category[];
  businessId: string;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const openAdd = () => {
    setEditing(null);
    setName("");
    setIcon("");
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setIcon(cat.icon || "");
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

      if (!error) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editing.id ? { ...c, name, icon: icon || null } : c
          )
        );
      }
    } else {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          business_id: businessId,
          name,
          icon: icon || null,
        })
        .select()
        .single();

      if (!error && data) {
        setCategories((prev) => [...prev, data]);
      }
    }

    setLoading(false);
    setShowForm(false);
    router.refresh();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("آیا از حذف این دسته بندی مطمئن هستید؟")) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (!error) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">دسته بندی ها</h1>
          <p className="text-navy/60 text-sm mt-1">
            {categories.length} دسته بندی
          </p>
        </div>
        <Button variant="gold" className="gap-2" onClick={openAdd}>
          <Plus className="w-5 h-5" />
          افزودن
        </Button>
      </div>

      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-navy/50">
            هنوز دسته بندی ای نساخته اید
          </div>
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
                    className="p-2 text-navy/40 hover:text-navy"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 text-navy/40 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-navy">
              {editing ? "ویرایش دسته بندی" : "افزودن دسته بندی"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-navy/70">نام *</label>
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
                  آیکون (اختیاری - ایموجی)
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="مثال: coffee"
                  className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  انصراف
                </Button>
                <Button type="submit" variant="gold" className="flex-1" disabled={loading}>
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