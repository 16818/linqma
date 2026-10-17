import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrdersClient } from "./OrdersClient";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ business?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { business: businessParam } = await searchParams;

  let business: { id: string; name: string } | null = null;

  // حالت مدیر: اگر پارامتر business هست
  if (businessParam) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";

    if (isAdmin) {
      const { data: targetBusiness } = await supabase
        .from("businesses")
        .select("id, name")
        .eq("id", businessParam)
        .maybeSingle();

      if (targetBusiness) {
        business = targetBusiness;
      }
    }
  }

  // حالت عادی: بدون businessParam
  if (!business) {
    const { data: ownBusiness } = await supabase
      .from("businesses")
      .select("id, name")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    business = ownBusiness;
  }

  if (!business) {
    redirect("/dashboard/onboarding");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return <OrdersClient initialOrders={orders || []} />;
}