import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";
import { getDashboardContext } from "@/lib/dashboard-context";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const business = ctx.business;

  const { data: fullBusiness } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", business.id)
    .single();

  if (!fullBusiness) {
    redirect("/dashboard/onboarding");
  }

  const { data: staffRows } = await supabase
    .from("business_staff")
    .select("id, user_id, email, is_active, role")
    .eq("business_id", business.id)
    .eq("role", "cashier")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1);

  const staff = staffRows?.[0] ?? null;

  let cashierEmail: string | null = null;

  if (staff) {
    if (staff.email) {
      cashierEmail = staff.email;
    } else {
      const { data: cashierProfile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", staff.user_id)
        .maybeSingle();
      cashierEmail = cashierProfile?.email ?? null;
    }
  }

  return (
    <SettingsClient
      business={fullBusiness}
      cashierEmail={cashierEmail}
    />
  );
}