"use client";

import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  badge?: "ویژه" | "محبوب" | "جدید" | null;
  ingredients?: string[];
  isAvailable?: boolean;
  onAdd?: (id: string) => void;
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
  onAdd,
  className,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden shadow-sm",
        className
      )}
    >
      <div className="relative aspect-square bg-[#F5F0E8]">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#8B7355]/40">
            عکس
          </div>
        )}
        {badge && (
          <span
            className={cn(
              "absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full",
              badge === "محبوب"
                ? "bg-[#C45C26] text-white"
                : badge === "جدید"
                ? "bg-[#2D6A4F] text-white"
                : "bg-[#C4A574] text-white"
            )}
          >
            {badge}
          </span>
        )}
        {!isAvailable && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1a1a1a] text-white">
            تمام شد
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-bold text-[#1a1a1a] text-sm leading-tight line-clamp-1">
          {name}
        </h3>
        {description && (
          <p className="mt-1 text-[11px] text-[#6B6B6B] line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between gap-1">
          <div>
            <span className="font-black text-[#1a1a1a] text-sm">
              {price.toLocaleString("fa-IR")}
            </span>
            <span className="text-[10px] text-[#8B7355] mr-0.5">تومان</span>
          </div>
          {onAdd && (
            <button
              onClick={() => isAvailable && onAdd(id)}
              disabled={!isAvailable}
              className={cn(
                "h-8 px-2.5 rounded-lg text-[11px] font-bold",
                isAvailable
                  ? "bg-[#C4A574] text-white cursor-pointer"
                  : "bg-[#E5E0D8] text-[#8B7355] cursor-not-allowed"
              )}
            >
              {isAvailable ? "سفارش" : "ناموجود"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}