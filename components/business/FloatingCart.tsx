"use client";

import { ShoppingBag } from "lucide-react";

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
  if (itemCount <= 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="max-w-lg mx-auto px-4 pb-5 pt-2">
        <button
          type="button"
          onClick={onClick}
          className="pointer-events-auto w-full flex items-center justify-between gap-3
            rounded-2xl bg-[#0F172A] text-white px-4 py-3.5
            shadow-[0_12px_40px_-8px_rgba(15,23,42,0.45)]
            active:scale-[0.98] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="absolute -top-1.5 -left-1.5 min-w-[20px] h-5 px-1 rounded-full bg-white text-[#0F172A] text-[11px] font-black flex items-center justify-center">
                {itemCount.toLocaleString("fa-IR")}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-white/60 font-medium leading-none">
                سبد سفارش
              </p>
              <p className="mt-1 text-sm font-bold leading-none">
                مشاهده و ادامه
              </p>
            </div>
          </div>

          <div className="text-left shrink-0">
            <p className="text-[11px] text-white/60 leading-none">جمع</p>
            <p className="mt-1 text-sm font-black text-[#D4AF37] leading-none">
              {totalPrice.toLocaleString("fa-IR")}
              <span className="text-[10px] font-medium text-white/70 mr-1">
                تومان
              </span>
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}