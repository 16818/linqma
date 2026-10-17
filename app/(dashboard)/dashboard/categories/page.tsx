import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CategoriesClient } from "./CategoriesClient";

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