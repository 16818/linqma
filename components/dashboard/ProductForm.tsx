"use client";

import { useState } from "react";
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
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [ingredients, setIngredients] = useState(
    initialData?.ingredients?.join(", ") || ""
  );
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const ingredientsArray = ingredients
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const payload = {
      business_id: businessId,
      name,
      description: description || null,
      price: parseInt(price),
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
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-navy/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <ImageUpload value={imageUrl} onChange={setImageUrl} />

          <div>
            <label className="text-sm font-medium text-navy/70">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">Price (Toman) *</label>
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
            <label className="text-sm font-medium text-navy/70">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">Badge</label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
            >
              <option value="">None</option>
              <option value="ویژه">ویژه</option>
              <option value="محبوب">محبوب</option>
              <option value="جدید">جدید</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              Ingredients (comma separated)
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="milk, espresso, vanilla"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy">Active</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-7 rounded-full transition-colors ${
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

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}