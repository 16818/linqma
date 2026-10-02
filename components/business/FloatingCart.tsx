"use client";

import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingCartProps {
  itemCount: number;
  totalPrice: number;
  onClick: () => void;
}

export function FloatingCart({
  itemCount,
  totalPrice,
  onClick,
}: FloatingCartProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6">
      <button
        onClick={onClick}
        className={cn(
          "w-full max-w-md mx-auto flex items-center justify-between",
          "bg-navy text-white rounded-2xl px-5 py-4 shadow-soft-lg",
          "active:scale-[0.98] transition-transform"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-navy text-xs font-bold rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span className="font-medium">مشاهده سفارش</span>
        </div>

        <div className="font-bold text-gold">
          {totalPrice.toLocaleString("fa-IR")} تومان
        </div>
      </button>
    </div>
  );
}