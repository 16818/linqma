"use client";

import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon?: string | null;
}

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  onChange: (id: string) => void;
}

export function CategoryTabs({
  categories,
  activeId,
  onChange,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EDE8DF]/80">
      <div className="max-w-6xl mx-auto px-3 py-2.5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => {
            const active = activeId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange(cat.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer",
                  active
                    ? "bg-[#0F172A] text-white shadow-md"
                    : "bg-white text-[#475569] border border-[#EDE8DF] hover:border-[#D4AF37] hover:text-[#0F172A]"
                )}
              >
                {cat.icon && <span className="text-sm leading-none">{cat.icon}</span>}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}