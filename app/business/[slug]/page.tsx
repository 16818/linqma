"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { CategoryTabs } from "@/components/business/CategoryTabs";
import { ProductCard } from "@/components/business/ProductCard";
import { FloatingCart } from "@/components/business/FloatingCart";

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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function BusinessPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`linqma-cart-${slug}`);
    if (saved) setCart(JSON.parse(saved));
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(`linqma-cart-${slug}`, JSON.stringify(cart));
  }, [cart, slug]);

  const addToCart = (productId: string) => {
    const product = sampleProducts.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const filteredProducts =
    activeCategory === "all"
      ? sampleProducts
      : sampleProducts.filter((p) => p.categoryId === activeCategory);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-cream font-vazir pb-28">
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
              onAdd={addToCart}
            />
          ))}
        </div>
      </div>

      <FloatingCart
        itemCount={totalItems}
        totalPrice={totalPrice}
        onClick={() => router.push(`/business/${slug}/order`)}
      />
    </div>
  );
}