"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
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
  plan: string;
  instagram?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  rubika?: string | null;
  eitaa?: string | null;
  bale?: string | null;
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
  discount_price?: number | null;
  image_url?: string | null;
  badge?: "ویژه" | "محبوب" | "جدید" | null;
  ingredients?: string[] | null;
  category_id?: string | null;
  is_available?: boolean;
  is_featured_today?: boolean;
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

    const finalPrice =
      product.discount_price && product.discount_price < product.price
        ? product.discount_price
        : product.price;

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
          price: finalPrice,
          quantity: 1,
          imageUrl: product.image_url || undefined,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.id !== productId);
      }
      return prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const getQuantity = (productId: string) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const allCategories = [
    { id: "all", name: "همه", icon: "☕" },
    ...categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon || "☕",
    })),
  ];

  const featuredTodayIds = new Set(
    products.filter((p) => p.is_featured_today === true).map((p) => p.id)
  );

  const specialProducts = products.filter(
    (p) => p.badge === "ویژه" || p.badge === "محبوب" || p.badge === "جدید"
  );
  const specialIds = new Set([
    ...specialProducts.map((p) => p.id),
    ...featuredTodayIds,
  ]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [searchQuery, products]);

  const listProducts = searchQuery.trim()
    ? filteredProducts || []
    : activeCategory === "all"
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
        plan={business.plan}
        instagram={business.instagram || undefined}
        telegram={business.telegram || undefined}
        whatsapp={business.whatsapp || undefined}
        rubika={business.rubika || undefined}
        eitaa={business.eitaa || undefined}
        bale={business.bale || undefined}
      />

      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8DF]">
        <div className="max-w-6xl mx-auto px-3 py-2.5">
          {!searchOpen ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 overflow-hidden">
                <CategoryTabs
                  categories={allCategories}
                  activeId={activeCategory}
                  onChange={setActiveCategory}
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#EDE8DF] cursor-pointer hover:border-[#D4AF37]"
              >
                <Search className="w-4 h-4 text-[#0F172A]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در منو..."
                  autoFocus
                  className="w-full h-10 pr-9 pl-3 rounded-full border border-[#EDE8DF] bg-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#EDE8DF] cursor-pointer hover:border-[#D4AF37]"
              >
                <X className="w-4 h-4 text-[#0F172A]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {!searchQuery &&
        activeCategory === "all" &&
        specialProducts.length > 0 && (
          <div className="px-4 md:px-6 max-w-6xl mx-auto pt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[#1a1a1a] text-base">
                ✨ پیشنهادهای ویژه
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {specialProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={`special-${product.id}`}
                  id={product.id}
                  name={product.name}
                  description={product.description || undefined}
                  price={product.price}
                  discountPrice={product.discount_price}
                  imageUrl={product.image_url || undefined}
                  badge={product.badge}
                  isAvailable={product.is_available !== false}
                  isFeaturedToday={product.is_featured_today === true}
                  quantity={getQuantity(product.id)}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>
        )}

      <div className="px-4 md:px-6 max-w-6xl mx-auto pt-5 pb-6">
        <h2 className="font-bold text-[#1a1a1a] text-base mb-3">
          {searchQuery.trim()
            ? `نتایج جستجو (${listProducts.length})`
            : activeCategory === "all"
            ? "همه محصولات"
            : allCategories.find((c) => c.id === activeCategory)?.name}
        </h2>

        {listProducts.length === 0 ? (
          <div className="text-center py-16 text-[#8B7355]/60">
            {searchQuery.trim()
              ? `محصولی با "${searchQuery}" پیدا نشد`
              : "محصولی در این دسته وجود ندارد"}
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
                discountPrice={product.discount_price}
                imageUrl={product.image_url || undefined}
                badge={product.badge}
                isAvailable={product.is_available !== false}
                isFeaturedToday={product.is_featured_today === true}
                quantity={getQuantity(product.id)}
                onAdd={addToCart}
                onRemove={removeFromCart}
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