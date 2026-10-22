import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { resolveDashboardBusiness } from "@/lib/dashboard-business";
import { AccessCodesClient } from "./AccessCodesClient";

export default async function AccessCodesPage({
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

  const { data: codes } = await supabase
    .from("order_access_codes")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <AccessCodesClient
      initialCodes={codes || []}
      businessId={business.id}
    />
  );
}