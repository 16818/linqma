"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  badge?: "ویژه" | "محبوب" | "جدید" | null;
  ingredients?: string[];
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
  ingredients = [],
  onAdd,
  className,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-3xl border border-[#EDE8DF] overflow-hidden shadow-sm",
        className
      )}
    >
      {/* تصویر */}
      <div className="relative w-full h-48 bg-[#EFE9DF] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/30 text-sm">
            بدون تصویر
          </div>
        )}

        {badge && (
          <div className="absolute top-3 right-3">
            <Badge variant="crown" className="gap-1 px-2.5 py-1 text-[11px]">
              👑 {badge}
            </Badge>
          </div>
        )}
      </div>

      {/* محتوا */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-[#0F172A] text-base">{name}</h3>

        {description && (
          <p className="text-sm text-[#0F172A]/60 leading-relaxed">
            {description}
          </p>
        )}

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ingredients.map((item) => (
              <span
                key={item}
                className="text-[11px] text-[#0F172A]/50 bg-[#EFE9DF] px-2 py-0.5 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[#D4AF37]">
              {price.toLocaleString("fa-IR")}
            </span>
            <span className="text-xs text-[#0F172A]/50">تومان</span>
          </div>

          {onAdd && (
            <button
              onClick={() => onAdd(id)}
              className="w-9 h-9 rounded-full bg-[#D4AF37] text-[#0F172A] flex items-center justify-center hover:opacity-90"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}