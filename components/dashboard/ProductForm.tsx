"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  businessId: string;
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number | null;
    image_url?: string | null;
    category_id?: string | null;
    badge?: string | null;
    ingredients?: string[] | null;
    is_active: boolean;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({
  businessId,
  categories,
  initialData,
  onClose,
  onSuccess,
}: ProductFormProps) {
  const isEdit = !!initialData;
  const supabase = createClient();

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(
    initialData?.discount_price?.toString() || ""
  );
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [ingredients, setIngredients] = useState(
    initialData?.ingredients?.join(", ") || ""
  );
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const discountPercent = useMemo(() => {
    const p = parseInt(price);
    const d = parseInt(discountPrice);
    if (!p || !d || d >= p || d <= 0) return null;
    return Math.round(((p - d) / p) * 100);
  }, [price, discountPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const p = parseInt(price);
    const d = parseInt(discountPrice);

    if (discountPrice && (isNaN(d) || d <= 0)) {
      setError("قیمت تخفیف باید بزرگ‌تر از صفر باشد");
      setLoading(false);
      return;
    }

    if (discountPrice && d >= p) {
      setError("قیمت تخفیف باید کمتر از قیمت اصلی باشد");
      setLoading(false);
      return;
    }

    const ingredientsArray = ingredients
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const payload = {
      business_id: businessId,
      name,
      description: description || null,
      price: p,
      discount_price: discountPrice && !isNaN(d) ? d : null,
      image_url: imageUrl,
      category_id: categoryId || null,
      badge: badge || null,
      ingredients: ingredientsArray.length > 0 ? ingredientsArray : null,
      is_active: isActive,
    };

    let result;
    if (isEdit && initialData) {
      result = await supabase
        .from("products")
        .update(payload)
        .eq("id", initialData.id);
    } else {
      result = await supabase.from("products").insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#EDE8DF] px-5 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-bold text-navy">
            {isEdit ? "ویرایش محصول" : "افزودن محصول"}
          </h2>
          <button onClick={onClose} className="p-1 cursor-pointer">
            <X className="w-5 h-5 text-navy/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <ImageUpload value={imageUrl} onChange={setImageUrl} />

          <div>
            <label className="text-sm font-medium text-navy/70">
              نام محصول *
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
            <label className="text-sm font-medium text-navy/70">توضیحات</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              قیمت اصلی (تومان) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={0}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              قیمت با تخفیف (اختیاری)
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              min={0}
              placeholder="اگر تخفیف ندارد خالی بگذارید"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />

            {discountPercent && (
              <div className="mt-2 flex items-center gap-2 bg-[#FEF3C7] border border-[#FCD34D] rounded-xl px-3 py-2">
                <span className="text-[#92400E] text-xs font-bold">
                  ٪{discountPercent} تخفیف
                </span>
                <span className="text-[#92400E] text-xs">
                  قیمت اصلی: {parseInt(price).toLocaleString("fa-IR")} تومان
                </span>
                <span className="text-[#92400E] text-xs font-bold">
                  قیمت نهایی: {parseInt(discountPrice).toLocaleString("fa-IR")} تومان
                </span>
              </div>
            )}

            {discountPrice && !discountPercent && (
              <p className="mt-2 text-xs text-amber-600">
                قیمت تخفیف باید کمتر از قیمت اصلی باشد
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">دسته‌بندی</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
            >
              <option value="">بدون دسته</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">نشان</label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
            >
              <option value="">بدون نشان</option>
              <option value="ویژه">ویژه</option>
              <option value="محبوب">محبوب</option>
              <option value="جدید">جدید</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              مواد اولیه (با کاما جدا کنید)
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="شیر، اسپرسو، وانیل"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy">فعال</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-7 rounded-full transition-colors cursor-pointer ${
                isActive ? "bg-gold" : "bg-navy/20"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isActive ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="gold"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "در حال ذخیره..." : isEdit ? "ذخیره" : "افزودن"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}