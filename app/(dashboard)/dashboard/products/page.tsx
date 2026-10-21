import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductsClient } from "./ProductsClient";
import { resolveDashboardBusiness } from "@/lib/dashboard-business";

export default async function ProductsPage({
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