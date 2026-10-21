import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireBusinessWithOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, plan, name")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) redirect("/dashboard/onboarding");

  return { supabase, user, business };
}