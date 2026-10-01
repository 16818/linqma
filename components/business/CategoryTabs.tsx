"use client";

import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon?: string;
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
    <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-md border-b border-[#EDE8DF]">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeId === cat.id
                ? "bg-navy text-white shadow-soft"
                : "bg-white text-navy/70 hover:bg-cream-dark border border-[#EDE8DF]"
            )}
          >
            {cat.icon && <span>{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}