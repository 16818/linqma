"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Settings,
  LogOut,
  Store,
  Sliders,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const menuGroups = [
  {
    title: "فروشگاه",
    items: [
      { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
      { href: "/dashboard/products", label: "محصولات", icon: Package },
      { href: "/dashboard/categories", label: "دسته‌بندی‌ها", icon: Tags },
    ],
  },
  {
    title: "تنظیمات",
    items: [
      {
        href: "/dashboard/settings",
        label: "اطلاعات کسب‌وکار",
        icon: Settings,
      },
      { href: "/dashboard/settings#qr", label: "QR و انتشار", icon: Sparkles },
    ],
  },
];

const mobileMenuItems = [
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "محصولات", icon: Package },
  { href: "/dashboard/categories", label: "دسته‌ها", icon: Tags },
  { href: "/dashboard/settings", label: "تنظیمات", icon: Sliders },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href.includes("#")) {
      return pathname === href.split("#")[0];
    }
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-[Vazirmatn] flex" dir="rtl">
      {/* سایدبار دسکتاپ */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0F172A] text-white">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center">
              <Store className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-[#D4AF37] leading-none">
                لینکیوما
              </h1>
              <p className="text-[10px] text-white/50 mt-1">پنل مدیریت</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer",
                        active
                          ? "bg-[#D4AF37] text-[#0F172A] shadow-md"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <p className="px-3 mb-2 text-[10px] font-bold text-white/40 uppercase tracking-wider">
              دسترسی سریع
            </p>
            <div className="space-y-1">
              <Link
                href="/dashboard/settings#qr"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>QR Code</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            خروج از حساب
          </button>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 overflow-auto">
        {/* هدر موبایل */}
        <div className="md:hidden sticky top-0 z-20 bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
              <Store className="w-4 h-4 text-[#0F172A]" />
            </div>
            <h1 className="font-bold text-[#D4AF37] text-sm">لینکیوما</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-white/70 cursor-pointer"
          >
            خروج
          </button>
        </div>

        <div className="p-4 md:p-8 pb-24 md:pb-8">{children}</div>
      </main>

      {/* منوی پایین موبایل */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDE8DF] flex justify-around py-2 z-30 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)]">
        {mobileMenuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-medium transition-colors cursor-pointer",
                active ? "text-[#D4AF37]" : "text-[#0F172A]/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}