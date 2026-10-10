"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  is_active: boolean;
  is_available?: boolean;
  is_featured_today?: boolean;
  badge?: string | null;
  category_id?: string | null;
  ingredients?: string[] | null;
  categories?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

export function ProductsClient({
  initialProducts,
  categories,
  businessId,
}: {
  initialProducts: Product[];
  categories: Category[];
  businessId: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const refresh = () => {
    router.refresh();
    toast.success("محصول ذخیره شد");
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !current })
      .eq("id", id);

    if (error) {
      toast.error("خطا در تغییر وضعیت");
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
    );
    toast.success(current ? "محصول غیرفعال شد" : "محصول فعال شد");
  };

  const toggleAvailable = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_available: !current })
      .eq("id", id);

    if (error) {
      toast.error("خطا در تغییر وضعیت");
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_available: !current } : p
      )
    );
    toast.success(current ? "محصول ناموجود شد" : "محصول موجود شد");
  };

  const toggleFeaturedToday = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_featured_today: !current })
      .eq("id", id);

    if (error) {
      toast.error("خطا در تغییر وضعیت");
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_featured_today: !current } : p
      )
    );
    toast.success(
      current ? "از پیشنهاد امروز حذف شد" : "به پیشنهاد امروز اضافه شد"
    );
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("خطا در حذف محصول");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("محصول حذف شد");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">محصولات</h1>
          <p className="text-navy/60 text-sm mt-1">
            {products.length} محصول ثبت شده
          </p>
        </div>
        <Button
          variant="gold"
          className="gap-2"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          <Plus className="w-5 h-5" />
          افزودن محصول
        </Button>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-16 text-navy/50">
            هنوز محصولی اضافه نکرده‌اید
          </div>
        ) : (
          products.map((product) => {
            const hasDiscount =
              product.discount_price != null &&
              product.discount_price > 0 &&
              product.discount_price < product.price;

            return (
              <Card key={product.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-cream-dark flex-shrink-0 overflow-hidden">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-navy truncate">
                        {product.name}
                      </h3>
                      {product.badge && (
                        <Badge variant="crown" className="text-[10px]">
                          {product.badge}
                        </Badge>
                      )}
                      {product.is_featured_today && (
                        <Badge className="text-[10px] bg-[#D4AF37] text-white">
                          ⭐ امروز
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-navy/50 mt-0.5">
                      {product.categories?.name || "بدون دسته"}
                    </p>

                    {hasDiscount ? (
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-navy/40 line-through">
                          {product.price.toLocaleString("fa-IR")}
                        </span>
                        <span className="text-gold font-bold">
                          {product.discount_price!.toLocaleString("fa-IR")} تومان
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600">
                          ٪
                          {Math.round(
                            ((product.price - product.discount_price!) /
                              product.price) *
                              100
                          )}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gold font-bold mt-1">
                        {product.price.toLocaleString("fa-IR")} تومان
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        toggleFeaturedToday(
                          product.id,
                          product.is_featured_today ?? false
                        )
                      }
                      title="پیشنهاد امروز"
                    >
                      <Badge
                        variant={
                          product.is_featured_today ? "crown" : "default"
                        }
                      >
                        ⭐ امروز
                      </Badge>
                    </button>
                    <button
                      onClick={() =>
                        toggleAvailable(
                          product.id,
                          product.is_available ?? true
                        )
                      }
                    >
                      <Badge
                        variant={
                          product.is_available === false
                            ? "default"
                            : "success"
                        }
                      >
                        {product.is_available === false ? "تمام شد" : "موجود"}
                      </Badge>
                    </button>
                    <button
                      onClick={() =>
                        toggleActive(product.id, product.is_active)
                      }
                    >
                      <Badge
                        variant={product.is_active ? "success" : "default"}
                      >
                        {product.is_active ? "فعال" : "غیرفعال"}
                      </Badge>
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="p-2 text-navy/40 hover:text-navy"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-navy/40 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {showForm && (
        <ProductForm
          businessId={businessId}
          categories={categories}
          initialData={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}