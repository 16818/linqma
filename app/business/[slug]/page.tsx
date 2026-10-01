"use client";

import { useState } from "react";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { CategoryTabs } from "@/components/business/CategoryTabs";
import { ProductCard } from "@/components/business/ProductCard";

const sampleBusiness = {
  name: "کافه لینقما",
  description: "تجربه‌ای گرم و لوکس",
  address: "تهران، خیابان ولیعصر",
  workingHours: "۸:۰۰ تا ۲۳:۰۰",
  phone: "۰۲۱-۱۲۳۴۵۶۷۸",
  coverUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
  logoUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200",
};

const sampleCategories = [
  { id: "all", name: "همه", icon: "🍽️" },
  { id: "hot", name: "نوشیدنی گرم", icon: "☕" },
  { id: "cold", name: "نوشیدنی سرد", icon: "🧊" },
  { id: "dessert", name: "دسر", icon: "🍰" },
];

const sampleProducts = [
  {
    id: "1",
    name: "لاته سلطنتی",
    description: "لاته‌ای گرم با اسپرسوی خاص و نت‌های وانیل",
    price: 88000,
    imageUrl: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400",
    badge: "ویژه" as const,
    ingredients: ["شیر تازه", "اسپرسو", "وانیل"],
    categoryId: "hot",
  },
  {
    id: "2",
    name: "کراسان بادام",
    description: "کراسان طلایی با لایه‌های ترد و مغز بادام",
    price: 128000,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    badge: "محبوب" as const,
    ingredients: ["بادام", "کره"],
    categoryId: "dessert",
  },
  {
    id: "3",
    name: "آیس لاته",
    description: "قهوه سرد با شیر و یخ",
    price: 78000,
    imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400",
    badge: null,
    ingredients: ["اسپرسو", "شیر", "یخ"],
    categoryId: "cold",
  },
];

export default function BusinessPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts =
    activeCategory === "all"
      ? sampleProducts
      : sampleProducts.filter((p) => p.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-cream font-vazir pb-24">
      <BusinessHeader {...sampleBusiness} />

      <CategoryTabs
        categories={sampleCategories}
        activeId={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAdd={(id) => console.log("اضافه شد:", id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}