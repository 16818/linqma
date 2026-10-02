"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

const sampleCategories = [
  { id: "1", name: "نوشیدنی گرم", productCount: 8 },
  { id: "2", name: "نوشیدنی سرد", productCount: 5 },
  { id: "3", name: "دسر", productCount: 4 },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">دسته‌بندی‌ها</h1>
          <p className="text-navy/60 text-sm mt-1">
            {sampleCategories.length} دسته‌بندی
          </p>
        </div>
        <Button variant="gold" className="gap-2">
          <Plus className="w-5 h-5" />
          افزودن دسته
        </Button>
      </div>

      <div className="space-y-3">
        {sampleCategories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-navy">{cat.name}</h3>
                <p className="text-sm text-navy/50">{cat.productCount} محصول</p>
              </div>
              <div className="flex gap-2">
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