"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "محصولات", icon: Package },
  { href: "/dashboard/categories", label: "دسته‌بندی‌ها", icon: Tags },
  { href: "/dashboard/settings", label: "تنظیمات", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream font-vazir flex">
      {/* سایدبار دسکتاپ */}
      <aside className="hidden md:flex w-64 flex-col bg-navy text-white">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-gold">LINQMA</h1>
          <p className="text-xs text-white/60 mt-1">پنل مدیریت</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-gold text-navy"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-sm text-white/60 hover:text-white rounded-2xl hover:bg-white/10">
            <LogOut className="w-5 h-5" />
            خروج
          </button>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 overflow-auto">
        <div className="md:hidden sticky top-0 z-20 bg-navy text-white px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-gold">LINQMA</h1>
          <span className="text-sm text-white/70">پنل مدیریت</span>
        </div>

        <div className="p-4 md:p-8 pb-24 md:pb-8">{children}</div>
      </main>

      {/* منوی پایین موبایل */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDE8DF] flex justify-around py-2 z-30">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs",
                isActive ? "text-gold" : "text-navy/50"
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