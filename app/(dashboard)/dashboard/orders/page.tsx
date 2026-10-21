import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrdersClient } from "./OrdersClient";
import { resolveDashboardBusiness } from "@/lib/dashboard-business";
import { getPlanConfig } from "@/lib/plans";
import { UpgradeGate } from "@/components/dashboard/UpgradeGate";

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

  const business = await resolveDashboardBusiness(searchParams);

  if (!business) {
    redirect("/dashboard/onboarding");
  }

  const plan = getPlanConfig(business.plan);

  if (!plan.hasOrders) {
    return (
      <UpgradeGate
        title="سفارش‌ها در پکیج پایه فعال نیست"
        description="با ارتقا به پکیج حرفه‌ای یا ویژه، امکان مدیریت سفارش‌ها را خواهید داشت."
      />
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return <OrdersClient initialOrders={orders || []} />;
}