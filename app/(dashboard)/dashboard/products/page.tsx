import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductsClient } from "./ProductsClient";

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

  const { business: businessParam } = await searchParams;

  let business: {
    id: string;
    name: string;
    slug: string;
    is_published: boolean;
  } | null = null;

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
        .select("id, name, slug, is_published")
        .eq("id", businessParam)
        .maybeSingle();

      if (targetBusiness) {
        business = targetBusiness;
      }
    }
  }

  if (!business) {
    const { data: ownBusiness } = await supabase
      .from("businesses")
      .select("id, name, slug, is_published")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    business = ownBusiness;
  }

  if (!business) {
    redirect("/dashboard/onboarding");
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("business_id", business.id)
    .order("sort_order");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("business_id", business.id)
    .eq("is_active", true);

  return (
    <ProductsClient
      initialProducts={products || []}
      categories={categories || []}
      businessId={business.id}
    />
  );
}