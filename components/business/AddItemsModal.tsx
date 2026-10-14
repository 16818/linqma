"use client";

import { useState, useMemo } from "react";
import { X, Search, Plus, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  category_id?: string | null;
  is_available?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

interface AddItemsModalProps {
  products: Product[];
  cart: CartItem[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function AddItemsModal({
  products,
  cart,
  onAdd,
  onRemove,
  onClose,
}: AddItemsModalProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return products.filter((p) => p.is_available !== false);
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.is_available !== false &&
        (p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)))
    );
  }, [products, query]);

  const getQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const getFinalPrice = (product: Product) => {
    if (
      product.discount_price &&
      product.discount_price > 0 &&
      product.discount_price < product.price
    ) {
      return product.discount_price;
    }
    return product.price;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="p-4 border-b border-[#EDE8DF] flex items-center gap-3 shrink-0">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در منو..."
              autoFocus
              className="w-full h-11 pr-9 pl-3 rounded-2xl border border-[#EDE8DF] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-[#FAF7F2] flex items-center justify-center cursor-pointer hover:bg-[#EFE9DF] transition"
            aria-label="بستن"
          >
            <X className="w-5 h-5 text-[#0F172A]" />
          </button>
        </div>

        {/* لیست محصولات */}
        <div className="flex-1 overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#8B7355]/60 text-sm">
              محصولی پیدا نشد
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((product) => {
                const quantity = getQuantity(product.id);
                const finalPrice = getFinalPrice(product);
                const hasDiscount = finalPrice < product.price;

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5F0E8] transition"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F5F0E8] shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8B7355]/50">
                          —
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#0F172A] truncate">
                        {product.name}
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        {hasDiscount && (
                          <span className="text-[10px] text-[#94A3B8] line-through">
                            {product.price.toLocaleString("fa-IR")}
                          </span>
                        )}
                        <span
                          className={`text-xs font-bold ${
                            hasDiscount ? "text-[#DC2626]" : "text-[#8B7355]"
                          }`}
                        >
                          {finalPrice.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    </div>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-1 bg-[#0F172A] rounded-xl px-1 h-9">
                        <button
                          type="button"
                          onClick={() => onRemove(product.id)}
                          className="w-7 h-7 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 rounded-lg"
                          aria-label="کاهش"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-white text-sm font-bold min-w-[20px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onAdd(product.id)}
                          className="w-7 h-7 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 rounded-lg"
                          aria-label="افزایش"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAdd(product.id)}
                        className="h-9 px-4 rounded-xl bg-[#D4AF37] text-white text-xs font-bold cursor-pointer hover:bg-[#C4A034] transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        افزودن
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* دکمه پایین */}
        <div className="p-4 border-t border-[#EDE8DF] shrink-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-2xl bg-[#0F172A] text-white font-bold cursor-pointer hover:bg-[#1E293B] transition"
          >
            تمام
          </button>
        </div>
      </div>
    </div>
  );
}