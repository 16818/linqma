import { redirect, notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-admin";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ArrowRight,
  Store,
  Package,
  ShoppingBag,
  Tags,
  Settings,
  LogOut,
} from "lucide-react";
import { TransferOwnershipButton } from "@/components/admin/TransferOwnershipButton";

export const dynamic = "force-dynamic";

export default async function AdminBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { ok } = await requireAdmin();
  if (!ok) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!business) notFound();

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", business.owner_id)
    .maybeSingle();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, image_url, is_active, is_available")
    .eq("business_id", business.id)
    .order("sort_order");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, icon, is_active")
    .eq("business_id", business.id)
    .order("sort_order");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, short_code, total, status, created_at")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const pendingOrders = (orders || []).filter((o) => o.status === "pending");
  const totalRevenue = (orders || [])
    .filter((o) => o.status === "confirmed")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-[Vazirmatn]" dir="rtl">
      {/* نوار بالای صفحه — فقط برای مدیر */}
      <div className="sticky top-0 z-50 bg-[#0B1B33] text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37] flex items-center justify-center shrink-0">
              <Store className="w-4 h-4 text-[#0B1B33]" />
            </div>
            <span className="text-xs md:text-sm truncate">
              حالت مدیر — در حال مشاهده{" "}
              <span className="font-bold text-[#D4AF37]">{business.name}</span>
            </span>
          </div>
<div className="flex items-center gap-2 shrink-0">
  <Link
    href="/admin"
    className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition"
  >
    <ArrowRight className="w-3.5 h-3.5" />
    بازگشت به پنل مدیر
  </Link>
  <LogoutButton />
</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* اطلاعات کسب‌وکار */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-5">
          <div className="flex items-start gap-4 flex-wrap">
            {business.logo_url && (
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F5F0E8] shrink-0">
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-black text-[#0F172A]">
                {business.name}
              </h1>
              {business.description && (
                <p className="text-sm text-[#64748B] mt-1">
                  {business.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-lg bg-[#FAF7F2] text-[#0F172A]">
                  /business/{business.slug}
                </span>
                <span
                  className={`px-2 py-1 rounded-lg ${
                    business.is_published
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {business.is_published ? "منتشر" : "پیش‌نویس"}
                </span>
                <span className="px-2 py-1 rounded-lg bg-[#D4AF37]/15 text-[#B8860B] font-bold">
                  پلن: {business.plan || "basic"}
                </span>
                {business.phone && (
                  <span
                    className="px-2 py-1 rounded-lg bg-[#FAF7F2] text-[#0F172A]"
                    dir="ltr"
                  >
                    {business.phone}
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`/business/${business.slug}`}
              target="_blank"
              className="h-10 px-4 rounded-2xl bg-[#0F172A] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#1E293B] transition"
            >
              مشاهده ویترین
            </Link>
          </div>
        </div>

        {/* مالک کسب‌وکار */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">مالک فعلی</p>
                <p className="font-bold text-[#0F172A]">
                  {ownerProfile?.full_name || "بدون نام"}
                </p>
                <p
                  className="text-[10px] text-[#64748B] font-mono mt-0.5"
                  dir="ltr"
                >
                  {business.owner_id}
                </p>
              </div>
            </div>
            <TransferOwnershipButton
              businessId={business.id}
              currentOwnerId={business.owner_id}
            />
          </div>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-[#EDE8DF] p-4 text-center">
            <p className="text-2xl font-black text-[#0F172A]">
              {(products || []).length}
            </p>
            <p className="text-xs text-[#0F172A]/60 mt-1">کل محصولات</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EDE8DF] p-4 text-center">
            <p className="text-2xl font-black text-[#0F172A]">
              {(categories || []).length}
            </p>
            <p className="text-xs text-[#0F172A]/60 mt-1">دسته‌بندی</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EDE8DF] p-4 text-center">
            <p className="text-2xl font-black text-amber-600">
              {pendingOrders.length}
            </p>
            <p className="text-xs text-[#0F172A]/60 mt-1">سفارش در انتظار</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EDE8DF] p-4 text-center">
            <p className="text-lg font-black text-[#D4AF37]">
              {totalRevenue.toLocaleString("fa-IR")}
            </p>
            <p className="text-xs text-[#0F172A]/60 mt-1">فروش تأیید شده</p>
          </div>
        </div>

        {/* کارهای سریع */}
        <div className="bg-white rounded-3xl border border-[#EDE8DF] p-5">
          <h2 className="font-bold text-[#0F172A] mb-4">دسترسی سریع</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href={`/dashboard/products?business=${business.id}`}
              className="bg-[#FAF7F2] rounded-2xl border border-[#EDE8DF] p-4 flex flex-col items-center gap-2 hover:border-[#D4AF37] hover:bg-white transition group"
            >
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <Package className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-bold text-[#0F172A] text-center">
                مدیریت محصولات
              </span>
            </Link>

            <Link
              href={`/dashboard/categories?business=${business.id}`}
              className="bg-[#FAF7F2] rounded-2xl border border-[#EDE8DF] p-4 flex flex-col items-center gap-2 hover:border-[#D4AF37] hover:bg-white transition group"
            >
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <Tags className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-bold text-[#0F172A] text-center">
                مدیریت دسته‌ها
              </span>
            </Link>

            <Link
              href={`/dashboard/settings?business=${business.id}`}
              className="bg-[#FAF7F2] rounded-2xl border border-[#EDE8DF] p-4 flex flex-col items-center gap-2 hover:border-[#D4AF37] hover:bg-white transition group"
            >
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <Settings className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-bold text-[#0F172A] text-center">
                تنظیمات
              </span>
            </Link>

            <Link
              href={`/dashboard/orders?business=${business.id}`}
              className="bg-[#FAF7F2] rounded-2xl border border-[#EDE8DF] p-4 flex flex-col items-center gap-2 hover:border-[#D4AF37] hover:bg-white transition group"
            >
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs font-bold text-[#0F172A] text-center">
                مشاهده سفارش‌ها
              </span>
            </Link>
          </div>
        </div>

        {/* آخرین سفارش‌ها */}
        {orders && orders.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-5">
            <h2 className="font-bold text-[#0F172A] mb-4">
              آخرین سفارش‌ها
            </h2>
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-[#EDE8DF] last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-[#0F172A] tracking-widest">
                      {order.short_code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.status === "confirmed" ? "تأیید شده" : "در انتظار"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#0F172A]/50">
                      {new Date(order.created_at).toLocaleDateString("fa-IR")}
                    </span>
                    <span className="font-black text-sm text-[#D4AF37]">
                      {order.total.toLocaleString("fa-IR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function LogoutButton() {
  return (
    <form action="/auth/logout" method="post">
      <button
        type="submit"
        className="h-8 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        خروج
      </button>
    </form>
  );
}