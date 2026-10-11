import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrdersClient } from "./OrdersClient";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!business) redirect("/dashboard/onboarding");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return <OrdersClient initialOrders={orders || []} />;
}