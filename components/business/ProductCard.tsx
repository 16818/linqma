"use client";

import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string;
  badge?: "ویژه" | "محبوب" | "جدید" | null;
  isAvailable?: boolean;
  isFeaturedToday?: boolean;
  quantity: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  showAddButton?: boolean; // <--- پراپ جدید
}

export function ProductCard({
  id,
  name,
  description,
  price,
  discountPrice,
  imageUrl,
  badge,
  isAvailable = true,
  isFeaturedToday = false,
  quantity,
  onAdd,
  onRemove,
  showAddButton = true, // <--- پیش‌فرض true
}: ProductCardProps) {
  const hasDiscount = discountPrice != null && discountPrice > 0 && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;

  return (
    <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-[#F5F0E8]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8B7355]/30 text-sm">
            بدون عکس
          </div>
        )}

        {badge && (
          <span className="absolute top-2 right-2 bg-[#D4AF37] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}

        {isFeaturedToday && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ⭐ امروز
          </span>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full">
              ناموجود
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-bold text-sm text-[#0F172A] truncate">{name}</h3>
        {description && (
          <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-[10px] text-[#8B7355] line-through">
                  {price.toLocaleString("fa-IR")}
                </span>
                <span className="text-sm font-black text-[#D4AF37]">
                  {finalPrice.toLocaleString("fa-IR")} تومان
                </span>
              </>
            ) : (
              <span className="text-sm font-black text-[#0F172A]">
                {finalPrice.toLocaleString("fa-IR")} تومان
              </span>
            )}
          </div>

          {showAddButton && isAvailable && (
            <div className="flex items-center gap-1">
              {quantity > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => onRemove(id)}
                    className="w-7 h-7 rounded-lg bg-[#F5F0E8] flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5 text-[#0F172A]" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAdd(id)}
                    className="w-7 h-7 rounded-lg bg-[#D4AF37] flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onAdd(id)}
                  className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center cursor-pointer hover:bg-[#C4A034] transition"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}