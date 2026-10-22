"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  Settings,
  LogOut,
  Store,
  ShoppingCart,
  Receipt,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { getPlanConfig } from "@/lib/plans";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const businessId = searchParams.get("business");
  const qs = businessId ? `?business=${businessId}` : "";

  const [plan, setPlan] = useState<string>("basic");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let finalBusinessId = businessId;

      if (!finalBusinessId) {
        const { data: ownBusiness } = await supabase
          .from("businesses")
          .select("id")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (ownBusiness) finalBusinessId = ownBusiness.id;
      }

      if (finalBusinessId) {
        const { data: business } = await supabase
          .from("businesses")
          .select("plan")
          .eq("id", finalBusinessId)
          .maybeSingle();
        if (business?.plan) setPlan(business.plan);
      }
    })();
  }, [businessId, supabase]);

  const planConfig = getPlanConfig(plan);
  const hasAccessCodes = plan === "premium";

  const menuGroups = [
    {
      title: "فروشگاه",
      items: [
        { href: `/dashboard${qs}`, label: "داشبورد", icon: LayoutDashboard },
        { href: `/dashboard/products${qs}`, label: "محصولات", icon: Package },
        { href: `/dashboard/categories${qs}`, label: "دسته‌بندی‌ها", icon: Tags },
      ],
    },
    {
      title: "عملیات",
      items: [
        { href: `/dashboard/pos${qs}`, label: "صندوق", icon: ShoppingCart },
        { href: `/dashboard/orders${qs}`, label: "سفارش‌ها", icon: Receipt },
        ...(hasAccessCodes
          ? [{ href: `/dashboard/access-codes${qs}`, label: "کدهای اشتراک", icon: Ticket }]
          : []),
      ],
    },
    {
      title: "مدیریت",
      items: [
        {
          href: `/dashboard/settings${qs}`,
          label: "تنظیمات و QR",
          icon: Settings,
        },
      ],
    },
  ];

  const mobileMenuItems = [
    { href: `/dashboard${qs}`, label: "داشبورد", icon: LayoutDashboard },
    { href: `/dashboard/pos${qs}`, label: "صندوق", icon: ShoppingCart },
    { href: `/dashboard/orders${qs}`, label: "سفارش‌ها", icon: Receipt },
    { href: `/dashboard/products${qs}`, label: "محصولات", icon: Package },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    return pathname === href.split("?")[0];
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-[Vazirmatn] flex" dir="rtl">
      <aside className="hidden md:flex w-64 flex-col bg-[#0F172A] text-white">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <h1 className="text-base font-black text-[#D4AF37] leading-none">
                لینکیوما
              </h1>
              <p className="text-[9px] text-white/40 tracking-widest mt-1">
                LINQMA
              </p>
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
                      key={item.label}
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

      <main className="flex-1 overflow-auto">
        <div className="md:hidden sticky top-0 z-20 bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
              <Store className="w-4 h-4 text-[#0F172A]" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-[#D4AF37] text-sm leading-none">
                لینکیوما
              </h1>
              <span className="text-[8px] text-white/40 tracking-widest mt-0.5">
                LINQMA
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-white/70 cursor-pointer"
          >
            خروج
          </button>
        </div>

        <div className="p-4 md:p-8 pb-24 md:p-8">{children}</div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDE8DF] flex justify-around py-2 z-30 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)]">
        {mobileMenuItems.map((item) => {
          const active = pathname === item.href.split("?")[0];
          return (
            <Link
              key={item.label}
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