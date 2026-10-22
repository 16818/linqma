import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth-admin";
import { createClient } from "@/lib/supabase/server";
import { AdminBusinessesClient } from "./AdminBusinessesClient";
import { CreateOwnerForm } from "@/components/admin/CreateOwnerForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { ok } = await requireAdmin();
  if (!ok) redirect("/login");

  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, slug, is_published, plan, phone, created_at, owner_id")
    .order("created_at", { ascending: false });

  return (
    <div
      className="min-h-screen bg-[#F7F6F3] font-[Vazirmatn] p-4 md:p-8"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A]">
              پنل مدیر اصلی
            </h1>
            <p className="text-sm text-[#0F172A]/60 mt-1">
              مدیریت تمام کسب‌وکارها
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <CreateOwnerForm />
            <Link
              href="/admin/sales-tools"
              className="h-11 px-5 rounded-2xl bg-[#D4AF37] text-[#0F172A] font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-[#C4A034] transition"
            >
              <Sparkles className="w-4 h-4" />
              ابزارهای فروش
            </Link>
            <AdminHeader />
          </div>
        </div>
        <AdminBusinessesClient initialBusinesses={businesses || []} />
      </div>
    </div>
  );
}