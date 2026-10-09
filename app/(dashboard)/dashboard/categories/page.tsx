import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CategoriesClient } from "./CategoriesClient";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug, is_published")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!business) redirect("/dashboard/onboarding");

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order");

  return (
    <CategoriesClient
      initialCategories={categories || []}
      businessId={business.id}
    />
  );
}
