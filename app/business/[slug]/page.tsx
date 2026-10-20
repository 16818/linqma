import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BusinessClient } from "./BusinessClient";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!business) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, icon")
    .eq("business_id", business.id)
    .order("sort_order");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("sort_order");

  return (
    <BusinessClient
      business={business}
      categories={categories || []}
      products={products || []}
    />
  );
}