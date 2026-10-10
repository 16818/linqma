"use client";

import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  badge?: "ویژه" | "محبوب" | "جدید" | string | null;
  ingredients?: string[];
  isAvailable?: boolean;
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
  imageUrl,
  badge,
  isAvailable = true,
  quantity = 0,
  onAdd,
  onRemove,
  className,
}: ProductCardProps) {
  const inCart = quantity > 0;

  return (
    <div
      className={cn(
        "group bg-white rounded-3xl border border-[#EDE8DF] overflow-hidden",
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]",
        "transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-0.5",
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

        {badge && (
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
            {badge === "ویژه" ? "👑 ویژه" : badge === "محبوب" ? "🔥 محبوب" : badge === "جدید" ? "✨ جدید" : badge}
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
          <div className="flex items-baseline gap-0.5">
            <span className="font-black text-[#0F172A] text-[15px] tracking-tight">
              {price.toLocaleString("fa-IR")}
            </span>
            <span className="text-[10px] text-[#8B7355] font-medium">تومان</span>
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
                  className="h-8 min-w-[72px] px-3 rounded-xl text-[11px] font-bold bg-[#D4AF37] text-white hover:bg-[#C4A034] active:scale-95 cursor-pointer shadow-sm transition-all"
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