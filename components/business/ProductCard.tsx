"use client";

import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string;
  badge?: "ویژه" | "محبوب" | "جدید" | string | null;
  ingredients?: string[];
  isAvailable?: boolean;
  isFeaturedToday?: boolean;
  quantity?: number;
  onAdd?: (id: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
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
  quantity = 0,
  onAdd,
  onRemove,
  className,
}: ProductCardProps) {
  const inCart = quantity > 0;
  const hasDiscount =
    discountPrice != null && discountPrice > 0 && discountPrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice!) / price) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group bg-white rounded-3xl overflow-hidden relative",
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]",
        "transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-0.5",
        isFeaturedToday
          ? "border-2 border-[#D4AF37]"
          : "border border-[#EDE8DF]",
        !isAvailable && "opacity-75",
        className
      )}
    >
      <div className="relative aspect-[4/3] bg-[#F5F0E8] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-[#8B7355]/40">
            بدون تصویر
          </div>
        )}

        {badge && !isFeaturedToday && (
          <span
            className={cn(
              "absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm",
              badge === "محبوب"
                ? "bg-[#C45C26] text-white"
                : badge === "جدید"
                ? "bg-[#2D6A4F] text-white"
                : "bg-[#D4AF37] text-white"
            )}
          >
            {badge === "ویژه"
              ? "👑 ویژه"
              : badge === "محبوب"
              ? "🔥 محبوب"
              : badge === "جدید"
              ? "✨ جدید"
              : badge}
          </span>
        )}

        {isFeaturedToday && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#D4AF37] text-white shadow-md flex items-center gap-1">
            ⭐ پیشنهاد امروز
          </span>
        )}

        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 text-[11px] font-black px-2.5 py-1 rounded-full bg-[#DC2626] text-white shadow-md">
            ٪{discountPercent}
          </span>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/95 text-[#1a1a1a]">
              تمام شد
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-bold text-[#0F172A] text-[13px] leading-snug line-clamp-1">
          {name}
        </h3>

        {description && (
          <p className="mt-1 text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-[10px] text-[#94A3B8] line-through leading-tight">
                  {price.toLocaleString("fa-IR")}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-black text-[#DC2626] text-[15px] tracking-tight">
                    {discountPrice!.toLocaleString("fa-IR")}
                  </span>
                  <span className="text-[10px] text-[#8B7355] font-medium">
                    تومان
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-baseline gap-0.5">
                <span className="font-black text-[#0F172A] text-[15px] tracking-tight">
                  {price.toLocaleString("fa-IR")}
                </span>
                <span className="text-[10px] text-[#8B7355] font-medium">
                  تومان
                </span>
              </div>
            )}
          </div>

          {onAdd && (
            <>
              {!isAvailable ? (
                <button
                  type="button"
                  disabled
                  className="h-8 min-w-[72px] px-3 rounded-xl text-[11px] font-bold bg-[#EDE8DF] text-[#8B7355] cursor-not-allowed"
                >
                  ناموجود
                </button>
              ) : inCart ? (
                <div className="flex items-center gap-1.5 h-8 bg-[#0F172A] rounded-xl px-1">
                  <button
                    type="button"
                    onClick={() => onRemove?.(id)}
                    className="w-6 h-6 flex items-center justify-center text-white text-base font-bold cursor-pointer hover:bg-white/10 rounded-lg"
                  >
                    −
                  </button>
                  <span className="text-white text-[12px] font-bold min-w-[16px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAdd(id)}
                    className="w-6 h-6 flex items-center justify-center text-white text-base font-bold cursor-pointer hover:bg-white/10 rounded-lg"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onAdd(id)}
                  className="h-8 min-w-[72px] px-3 rounded-xl text-[11px] font-bold text-white active:scale-95 cursor-pointer shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C4A034]"
                >
                  + سفارش
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}