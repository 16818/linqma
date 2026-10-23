import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireBusinessWithOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ۱) بررسی owner
  const { data: owned } = await supabase
    .from("businesses")
    .select("id, plan, name")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (owned) {
    return { supabase, user, business: owned };
  }

  // ۲) بررسی cashier
  const { data: staffRows, error: staffError } = await supabase
    .from("business_staff")
    .select("business_id")
    .eq("user_id", user.id)
    .eq("role", "cashier")
    .eq("is_active", true)
    .limit(1);

  if (staffError) {
    console.error("[requireBusinessWithOrders] staff", staffError.message);
  }

  const staff = staffRows?.[0];
  if (!staff?.business_id) {
    redirect("/dashboard/onboarding");
  }

  // ۳) خواندن business
  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select("id, plan, name")
    .eq("id", staff.business_id)
    .maybeSingle();

  if (bizError) {
    console.error("[requireBusinessWithOrders] business", bizError.message);
  }

  if (!business) {
    redirect("/dashboard/onboarding");
  }

  return { supabase, user, business };
}