import { createClient } from "@/lib/supabase/server";
import { getPlanConfig } from "@/lib/plans";

type Access = "owner" | "cashier" | "admin";

export async function getDashboardContext(options?: {
  businessId?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const requestedBusinessId = options?.businessId?.trim() || null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin =
    profile?.role === "admin" || profile?.role === "super_admin";

  // ادمین + business مشخص
  if (isAdmin && requestedBusinessId) {
    const { data: business, error } = await supabase
      .from("businesses")
      .select("id, name, plan, slug")
      .eq("id", requestedBusinessId)
      .maybeSingle();

    if (error) {
      console.error("[getDashboardContext] admin business", error.message);
    }

    if (business) {
      return {
        user,
        business,
        access: "admin" as Access,
        plan: getPlanConfig(business.plan),
      };
    }
  }

  // Owner
  const { data: owned } = await supabase
    .from("businesses")
    .select("id, name, plan, slug")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (owned) {
    return {
      user,
      business: owned,
      access: "owner" as Access,
      plan: getPlanConfig(owned.plan),
    };
  }

  // Cashier
  const { data: staffRows } = await supabase
    .from("business_staff")
    .select("business_id")
    .eq("user_id", user.id)
    .eq("role", "cashier")
    .eq("is_active", true)
    .limit(1);

  const staff = staffRows?.[0];
  if (staff?.business_id) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id, name, plan, slug")
      .eq("id", staff.business_id)
      .maybeSingle();

    if (business) {
      return {
        user,
        business,
        access: "cashier" as Access,
        plan: getPlanConfig(business.plan),
      };
    }
  }

  return { user, business: null, access: null, plan: null };
}