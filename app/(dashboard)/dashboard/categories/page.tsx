import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CategoriesClient } from "./CategoriesClient";
import { resolveDashboardBusiness } from "@/lib/dashboard-business";

export default async function CategoriesPage({
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

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order");

  const { count } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id);

  return (
    <CategoriesClient
      initialCategories={categories || []}
      businessId={business.id}
      plan={business.plan}
      initialCategoryCount={count ?? 0}
    />
  );
}