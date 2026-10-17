import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage({
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

  let business: any = null;

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
        .select("*")
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
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    business = ownBusiness;
  }

  if (!business || !business.name || !business.slug) {
    redirect("/dashboard/onboarding");
  }

  return <SettingsClient business={business} />;
}