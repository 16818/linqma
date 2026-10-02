"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("کافه لینقما");
  const [slug, setSlug] = useState("cafe-linqma");
  const [isPublished, setIsPublished] = useState(true);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-navy">تنظیمات کسب‌وکار</h1>
        <p className="text-navy/60 text-sm mt-1">
          اطلاعات و QR Code خود را مدیریت کنید
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات اصلی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy/70">نام کسب‌وکار</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">آدرس اختصاصی</label>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-sm text-navy/50">linqma.ir/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 h-11 px-4 rounded-2xl border border-[#EDE8DF] bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-medium text-navy">وضعیت انتشار</p>
              <p className="text-sm text-navy/50">صفحه عمومی قابل مشاهده باشد</p>
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`w-12 h-7 rounded-full transition-colors ${
                isPublished ? "bg-gold" : "bg-navy/20"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isPublished ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QR Code کسب‌وکار</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-cream-dark rounded-3xl flex items-center justify-center text-navy/30">
            QR Code
          </div>
          <p className="text-sm text-navy/60 text-center">
            این QR را چاپ کنید و در محل کسب‌وکار قرار دهید
          </p>
          <Button variant="gold" className="gap-2">
            <Download className="w-4 h-4" />
            دانلود QR Code
          </Button>
        </CardContent>
      </Card>

      <Button variant="primary" className="w-full">
        ذخیره تغییرات
      </Button>
    </div>
  );
}