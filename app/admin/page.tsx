import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-admin";
import { createClient } from "@/lib/supabase/server";
import { AdminBusinessesClient } from "./AdminBusinessesClient";

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
    <div className="min-h-screen bg-[#F7F6F3] font-[Vazirmatn] p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A]">پنل مدیر اصلی</h1>
          <p className="text-sm text-[#0F172A]/60 mt-1">
            مدیریت تمام کسب‌وکارها
          </p>
        </div>
        <AdminBusinessesClient initialBusinesses={businesses || []} />
      </div>
    </div>
  );
}