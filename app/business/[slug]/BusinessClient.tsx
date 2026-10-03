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
    { id: "all", name: "همه", icon: "🍽️" },
    ...categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon || undefined,
    })),
  ];

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category_id === activeCategory);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-cream font-vazir pb-28">
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

      <div className="px-4 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-navy/50">
            محصولی در این دسته وجود ندارد
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description || undefined}
                price={product.price}
                imageUrl={product.image_url || undefined}
                badge={product.badge}
                ingredients={product.ingredients || []}
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