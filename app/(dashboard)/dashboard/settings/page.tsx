import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";
import { getDashboardContext } from "@/lib/dashboard-context";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ business?: string }>;
}) {
  const sp = await searchParams;
  const ctx = await getDashboardContext({ businessId: sp.business ?? null });

  if (!ctx?.user) redirect("/login");
  if (ctx.access === "cashier") redirect("/dashboard/pos");
  if (ctx.access !== "owner" && ctx.access !== "admin") {
    redirect("/dashboard/onboarding");
  }
  if (!ctx.business) redirect("/dashboard/onboarding");

  const businessId = ctx.business.id;

  // ادمین: bypass RLS فقط بعد از احراز نقش
  // مالک: همان session + RLS owner
  const db =
    ctx.access === "admin" ? createAdminClient() : await createClient();

  const { data: fullBusiness } = await db
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  if (!fullBusiness) {
    redirect("/dashboard/onboarding");
  }

  const { data: staffRows, error: staffError } = await db
    .from("business_staff")
    .select("id, user_id, email, is_active, role")
    .eq("business_id", businessId)
    .eq("role", "cashier")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1);

  if (staffError) {
    console.error("[settings] staff", staffError.message);
  }

  const cashierEmail = staffRows?.[0]?.email ?? null;

  return (
    <SettingsClient
      business={fullBusiness}
      cashierEmail={cashierEmail}
    />
  );
}