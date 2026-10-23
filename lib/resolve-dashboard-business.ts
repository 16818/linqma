import { createClient } from "@/lib/supabase/server";

type Access = "owner" | "cashier" | "admin";

export async function resolveDashboardBusiness(options?: {
  businessId?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      business: null,
      access: null as Access | null,
    };
  }

  const requestedId = options?.businessId?.trim() || null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin =
    profile?.role === "admin" || profile?.role === "super_admin";

  // Admin + ?business=
  if (isAdmin && requestedId) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id, name, plan, slug")
      .eq("id", requestedId)
      .maybeSingle();

    if (business) {
      return {
        supabase,
        user,
        business,
        access: "admin" as Access,
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
    return { supabase, user, business: owned, access: "owner" as Access };
  }

  // Cashier
  const { data: staffRows, error: staffError } = await supabase
    .from("business_staff")
    .select("business_id")
    .eq("user_id", user.id)
    .eq("role", "cashier")
    .eq("is_active", true)
    .limit(1);

  if (staffError) {
    console.error("[resolveDashboardBusiness] staff", staffError.message);
  }

  const staffBusinessId = staffRows?.[0]?.business_id;
  if (staffBusinessId) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id, name, plan, slug")
      .eq("id", staffBusinessId)
      .maybeSingle();

    if (business) {
      return {
        supabase,
        user,
        business,
        access: "cashier" as Access,
      };
    }

    console.error(
      "[resolveDashboardBusiness] cashier staff without business",
      staffBusinessId
    );
  }

  return { supabase, user, business: null, access: null };
}