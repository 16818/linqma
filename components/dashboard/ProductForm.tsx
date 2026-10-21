"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";
import { getProductLimit, getPlanLabel } from "@/lib/plans";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  is_active: boolean;
  is_available?: boolean;
  is_featured_today?: boolean;
  badge?: string | null;
  category_id?: string | null;
}

export function ProductForm({
  businessId,
  categories,
  initialData,
  plan,
  productCount,
  onClose,
  onSuccess,
}: {
  businessId: string;
  categories: Category[];
  initialData?: Product | null;
  plan: string;
  productCount: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const supabase = createClient();
  const isEdit = Boolean(initialData?.id);
  const limit = getProductLimit(plan);
  const planLabel = getPlanLabel(plan);

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(
    initialData?.price ? String(initialData.price) : ""
  );
  const [discountPrice, setDiscountPrice] = useState(
    initialData?.discount_price ? String(initialData.discount_price) : ""
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [isAvailable, setIsAvailable] = useState(
    initialData?.is_available ?? true
  );
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [isFeaturedToday, setIsFeaturedToday] = useState(
    initialData?.is_featured_today ?? false
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${businessId}/${Date.now()}.${fileExt}`;

    // استفاده از باکت products که پالیسی دارد
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error("خطا در آپلود عکس: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);

    setImageUrl(data.publicUrl);
    setUploading(false);
    toast.success("عکس آپلود شد");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!isEdit) {
      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("business_id", businessId);

      if (countError) {
        toast.error("خطا در بررسی سقف پکیج");
        setSaving(false);
        return;
      }

      if ((count ?? 0) >= limit) {
        toast.error(
          `سقف پکیج ${planLabel}: حداکثر ${limit} محصول. برای افزودن بیشتر ارتقا دهید.`
        );
        setSaving(false);
        return;
      }
    }

    const payload = {
      business_id: businessId,
      name: name.trim(),
      description: description.trim() || null,
      price: Number(price),
      discount_price: discountPrice ? Number(discountPrice) : null,
      category_id: categoryId || null,
      image_url: imageUrl || null,
      badge: badge || null,
      is_available: isAvailable,
      is_active: isActive,
      is_featured_today: isFeaturedToday,
    };

    if (isEdit && initialData?.id) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", initialData.id);

      if (error) {
        toast.error("خطا در ذخیره محصول");
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);

      if (error) {
        toast.error("خطا در ذخیره محصول");
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    toast.success(isEdit ? "محصول ویرایش شد" : "محصول اضافه شد");
    onSuccess();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[#EDE8DF] p-4 flex items-center justify-between">
          <h3 className="font-bold text-navy">
            {isEdit ? "ویرایش محصول" : "افزودن محصول جدید"}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center hover:bg-[#EFE9DF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-navy/70">عکس محصول</label>
            <div className="mt-1.5 flex items-center gap-3">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="پیش‌نمایش"
                  className="w-16 h-16 rounded-xl object-cover"
                />
              )}
              <label className="cursor-pointer h-11 px-4 rounded-xl bg-[#FAF7F2] text-navy font-medium text-sm flex items-center gap-2 hover:bg-[#EFE9DF]">
                <Upload className="w-4 h-4" />
                {uploading ? "در حال آپلود..." : "انتخاب عکس"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">نام محصول</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-navy/70">
                قیمت (تومان)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy/70">
                قیمت با تخفیف
              </label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                min="0"
                placeholder="اختیاری"
                className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              دسته‌بندی
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold bg-white"
            >
              <option value="">بدون دسته</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">نشان</label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#EDE8DF] focus:outline-none focus:border-gold bg-white"
            >
              <option value="">بدون نشان</option>
              <option value="ویژه">ویژه</option>
              <option value="محبوب">محبوب</option>
              <option value="جدید">جدید</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-navy">فعال</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-navy">موجود</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeaturedToday}
                onChange={(e) => setIsFeaturedToday(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-navy">⭐ پیشنهاد امروز</span>
            </label>
          </div>

          {!isEdit && productCount >= limit && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              ⚠️ به سقف پکیج {planLabel} رسیده‌اید ({limit} محصول). برای افزودن
              بیشتر، پکیج خود را ارتقا دهید.
            </div>
          )}

          <button
            type="submit"
            disabled={saving || uploading || (!isEdit && productCount >= limit)}
            className="w-full h-12 rounded-2xl bg-gold text-white font-bold cursor-pointer hover:bg-gold-dark transition disabled:opacity-60"
          >
            {saving ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن محصول"}
          </button>
        </form>
      </div>
    </div>
  );
}