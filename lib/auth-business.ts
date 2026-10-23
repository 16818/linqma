import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPlanConfig } from "@/lib/plans";

export async function getDashboardContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // بررسی اینکه آیا کاربر صاحب کسب‌وکار است؟
  const { data: owned } = await supabase
    .from("businesses")
    .select("id, plan, name")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (owned) {
    return {
      supabase,
      user,
      business: owned,
      access: "owner" as const,
      plan: getPlanConfig(owned.plan),
    };
  }

  // بررسی اینکه آیا کاربر صندوق‌دار است؟
  const { data: staff } = await supabase
    .from("business_staff")
    .select("business_id, businesses(id, plan, name)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .eq("role", "cashier")
    .maybeSingle();

  const business = staff?.businesses as
    | { id: string; plan: string; name: string }
    | null
    | undefined;

  if (business) {
    return {
      supabase,
      user,
      business,
      access: "cashier" as const,
      plan: getPlanConfig(business.plan),
    };
  }

  redirect("/login");
}