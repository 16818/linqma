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

  let isAdminMode = false;

  if (businessParam) {
    // چک کن کاربر مدیر است
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
        isAdminMode = true;
      }
    }
  }

  if (!business) {
    // حالت عادی — کسب‌وکار خود کاربر
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
    <>
      {isAdminMode && (
        <AdminModeBanner
          businessName={business.name}
          businessId={business.id}
        />
      )}
      <ProductsClient
        initialProducts={products || []}
        categories={categories || []}
        businessId={business.id}
      />
    </>
  );
}

function AdminModeBanner({
  businessName,
  businessId,
}: {
  businessName: string;
  businessId: string;
}) {
  return (
    <div
      className="bg-[#0B1B33] text-white rounded-2xl p-3 mb-4 flex items-center justify-between gap-3"
      dir="rtl"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
        <span className="text-xs md:text-sm truncate">
          حالت مدیر — در حال ویرایش{" "}
          <span className="font-bold text-[#D4AF37]">{businessName}</span>
        </span>
      </div>
      <a
        href={`/admin/business/${businessId}`}
        className="shrink-0 h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition"
      >
        بازگشت
      </a>
    </div>
  );
}