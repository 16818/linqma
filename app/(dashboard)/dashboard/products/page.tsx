import { redirect } from "next/navigation";
import { ProductsClient } from "./ProductsClient";
import { getDashboardContext } from "@/lib/dashboard-context";
import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage({
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

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("business_id", business.id)
    .order("sort_order");

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id);

  return (
    <ProductsClient
      initialProducts={products || []}
      categories={categories || []}
      businessId={business.id}
      plan={business.plan}
      initialProductCount={count ?? 0}
    />
  );
}