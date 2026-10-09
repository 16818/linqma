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

export function CategoryTabs({ categories, activeId, onChange }: CategoryTabsProps) {
  return (
    <div className="bg-white px-4 md:px-6 py-3 border-b border-[#F0EBE3]">
      <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const active = activeId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer",
                active
                  ? "bg-[#C4A574] text-white shadow-sm"
                  : "bg-[#F5F0E8] text-[#5C4A3A]"
              )}
            >
              <span className="text-base">{cat.icon || "☕"}</span>
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}