import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Tags, Eye, EyeOff, QrCode, Plus, ExternalLink, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug, is_published")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!business) {
    redirect("/dashboard/onboarding");
  }

  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id);

  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id);

  const { count: availableCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id)
    .eq("is_available", true);

  const { count: featuredCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id)
    .eq("is_featured_today", true);

  const unavailableCount = (productsCount || 0) - (availableCount || 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-navy">
          سلام، {business.name} 👋
        </h1>
        <p className="text-navy/60 mt-1">
          از اینجا کسب‌وکار خود را مدیریت کنید
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span className="text-2xl font-black text-navy">
              {productsCount || 0}
            </span>
            <span className="text-xs text-navy/60">محصول</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <Tags className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span className="text-2xl font-black text-navy">
              {categoriesCount || 0}
            </span>
            <span className="text-xs text-navy/60">دسته‌بندی</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center gap-1.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                business.is_published ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {business.is_published ? (
                <Eye className="w-5 h-5 text-green-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-red-500" />
              )}
            </div>
            <span
              className={`text-sm font-bold ${
                business.is_published ? "text-green-600" : "text-red-500"
              }`}
            >
              {business.is_published ? "فعال" : "غیرفعال"}
            </span>
            <span className="text-xs text-navy/60">وضعیت انتشار</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span className="text-2xl font-black text-navy">
              {featuredCount || 0}
            </span>
            <span className="text-xs text-navy/60">پیشنهاد امروز</span>
          </CardContent>
        </Card>
      </div>

      {unavailableCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">
              {unavailableCount} محصول ناموجود است
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              به‌روزرسانی کنید تا مشتری‌ها سردرگم نشوند
            </p>
          </div>
          <Link href="/dashboard/products">
            <Button variant="outline" className="text-xs h-8">
              مشاهده
            </Button>
          </Link>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-navy/70 mb-3">کارهای سریع</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/dashboard/products">
            <div className="bg-white rounded-2xl border border-[#EDE8DF] p-4 flex flex-col items-center gap-2 hover:border-[#D4AF37] transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <Plus className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-bold text-navy text-center">
                افزودن محصول
              </span>
            </div>
          </Link>

          <Link href="/dashboard/categories">
            <div className="bg-white rounded-2xl border border-[#EDE8DF] p-4 flex flex-col items-center gap-2 hover:border-[#D4AF37] transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <Tags className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-bold text-navy text-center">
                مدیریت دسته‌ها
              </span>
            </div>
          </Link>

          <Link href="/dashboard/settings">
            <div className="bg-white rounded-2xl border border-[#EDE8DF] p-4 flex flex-col items-center gap-2 hover:border-[#D4AF37] transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <QrCode className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-bold text-navy text-center">
                QR و تنظیمات
              </span>
            </div>
          </Link>

          {business.is_published ? (
            <Link href={`/business/${business.slug}`} target="_blank">
              <div className="bg-[#0F172A] rounded-2xl border border-[#0F172A] p-4 flex flex-col items-center gap-2 hover:bg-[#1E293B] transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-white text-center">
                  مشاهده ویترین
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard/settings">
              <div className="bg-white rounded-2xl border border-dashed border-[#EDE8DF] p-4 flex flex-col items-center gap-2 hover:border-[#D4AF37] transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <span className="text-xs font-bold text-navy text-center">
                  انتشار ویترین
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {business.is_published && (
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Settings className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base mb-1">
                ویترین شما فعال است
              </h3>
              <p className="text-sm text-white/70 mb-4">
                لینک اختصاصی خود را با مشتری‌ها به اشتراک بگذارید
              </p>
              <Link href={`/business/${business.slug}`} target="_blank">
                <button className="bg-[#D4AF37] hover:bg-[#C4A034] text-[#0F172A] font-bold text-sm px-5 py-2.5 rounded-xl transition cursor-pointer">
                  مشاهده ویترین
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}