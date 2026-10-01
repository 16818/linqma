"use client";

import Image from "next/image";
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
        "group relative bg-white rounded-3xl shadow-soft border border-[#EDE8DF] overflow-hidden transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1",
        className
      )}
    >
      {/* تصویر محصول */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/30 text-sm">
            بدون تصویر
          </div>
        )}

        {/* بج */}
        {badge && (
          <div className="absolute top-3 right-3">
            <Badge variant="crown" className="gap-1 px-2.5 py-1 text-[11px]">
              <span className="text-sm">👑</span>
              {badge}
            </Badge>
          </div>
        )}
      </div>

      {/* محتوای کارت */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-navy text-base leading-tight line-clamp-1">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-navy/60 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ingredients.slice(0, 4).map((item) => (
              <span
                key={item}
                className="text-[11px] text-navy/50 bg-cream-dark px-2 py-0.5 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gold">
              {price.toLocaleString("fa-IR")}
            </span>
            <span className="text-xs text-navy/50">تومان</span>
          </div>

          {onAdd && (
            <button
              onClick={() => onAdd(id)}
              className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center shadow-soft hover:bg-gold-dark transition-colors"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}