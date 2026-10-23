import { redirect } from "next/navigation";
import { CategoriesClient } from "./CategoriesClient";
import { getDashboardContext } from "@/lib/auth-business";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ business?: string }>;
}) {
  const ctx = await getDashboardContext();

  if (ctx.access !== "owner") {
    redirect("/dashboard/pos");
  }

  const { supabase, business } = ctx;

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