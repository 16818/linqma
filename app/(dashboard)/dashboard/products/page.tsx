"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

const sampleProducts = [
  {
    id: "1",
    name: "لاته سلطنتی",
    price: 88000,
    category: "نوشیدنی گرم",
    isActive: true,
    badge: "ویژه",
  },
  {
    id: "2",
    name: "کراسان بادام",
    price: 128000,
    category: "دسر",
    isActive: true,
    badge: "محبوب",
  },
];

export default function ProductsPage() {
  const [products] = useState(sampleProducts);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">محصولات</h1>
          <p className="text-navy/60 text-sm mt-1">
            {products.length} محصول ثبت شده
          </p>
        </div>
        <Button variant="gold" className="gap-2">
          <Plus className="w-5 h-5" />
          افزودن محصول
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cream-dark flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-navy truncate">{product.name}</h3>
                  {product.badge && (
                    <Badge variant="crown" className="text-[10px]">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-navy/50 mt-0.5">{product.category}</p>
                <p className="text-gold font-bold mt-1">
                  {product.price.toLocaleString("fa-IR")} تومان
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={product.isActive ? "success" : "default"}>
                  {product.isActive ? "فعال" : "غیرفعال"}
                </Badge>
                <button className="p-2 text-navy/40 hover:text-navy">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-2 text-navy/40 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}