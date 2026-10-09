"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BusinessHeader } from "@/components/business/BusinessHeader";
import { CategoryTabs } from "@/components/business/CategoryTabs";
import { ProductCard } from "@/components/business/ProductCard";
import { FloatingCart } from "@/components/business/FloatingCart";

interface Business {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  working_hours?: string | null;
  phone?: string | null;
  cover_url?: string | null;
  logo_url?: string | null;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string | null;
}

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  badge?: "ویژه" | "محبوب" | "جدید" | null;
  ingredients?: string[] | null;
  category_id?: string | null;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export function BusinessClient({
  business,
  categories,
  products,
}: {
  business: Business;
  categories: Category[];
  products: Product[];
}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`linqma-cart-${business.slug}`);
    if (saved) setCart(JSON.parse(saved));
  }, [business.slug]);

  useEffect(() => {
    localStorage.setItem(`linqma-cart-${business.slug}`, JSON.stringify(cart));
  }, [cart, business.slug]);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
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
          imageUrl: product.image_url || undefined,
        },
      ];
    });
  };

  const allCategories = [
    { id: "all", name: "همه", icon: "☕" },
    ...categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon || "☕",
    })),
  ];

  const specialProducts = products.filter(
    (p) => p.badge === "ویژه" || p.badge === "محبوب" || p.badge === "جدید"
  );
  const specialIds = new Set(specialProducts.map((p) => p.id));

  const listProducts =
    activeCategory === "all"
      ? products.filter((p) => !specialIds.has(p.id))
      : products.filter((p) => p.category_id === activeCategory);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-[Vazirmatn] pb-28" dir="rtl">
      <BusinessHeader
        name={business.name}
        description={business.description || undefined}
        address={business.address || undefined}
        workingHours={business.working_hours || undefined}
        phone={business.phone || undefined}
        coverUrl={business.cover_url || undefined}
        logoUrl={business.logo_url || undefined}
      />

      <CategoryTabs
        categories={allCategories}
        activeId={activeCategory}
        onChange={setActiveCategory}
      />

      {activeCategory === "all" && specialProducts.length > 0 && (
        <div className="px-4 md:px-6 max-w-6xl mx-auto pt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1a1a1a] text-base">
              ✨ پیشنهادهای ویژه
            </h2>
            <span className="text-xs text-[#C4A574] font-medium">مشاهده همه</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {specialProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={`special-${product.id}`}
                id={product.id}
                name={product.name}
                description={product.description || undefined}
                price={product.price}
                imageUrl={product.image_url || undefined}
                badge={product.badge}
                onAdd={addToCart}
              />
            ))}
          </div>
        </div>
      )}

      <div className="px-4 md:px-6 max-w-6xl mx-auto pt-5 pb-6">
        <h2 className="font-bold text-[#1a1a1a] text-base mb-3">
          {activeCategory === "all"
            ? "همه محصولات"
            : allCategories.find((c) => c.id === activeCategory)?.name}
        </h2>

        {listProducts.length === 0 ? (
          <div className="text-center py-16 text-[#8B7355]/60">
            محصولی در این دسته وجود ندارد
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {listProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description || undefined}
                price={product.price}
                imageUrl={product.image_url || undefined}
                badge={product.badge}
                onAdd={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      <FloatingCart
        itemCount={totalItems}
        totalPrice={totalPrice}
        onClick={() => router.push(`/business/${business.slug}/order`)}
      />
    </div>
  );
}