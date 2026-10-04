import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business || !business.name || !business.slug) {
    redirect("/dashboard/onboarding");
  }

  return (
    <SettingsClient
      business={{
        id: business.id,
        name: business.name,
        slug: business.slug,
        description: business.description,
        address: business.address,
        phone: business.phone,
        working_hours: business.working_hours,
        logo_url: business.logo_url,
        cover_url: business.cover_url,
        is_published: business.is_published ?? false,
      }}
    />
  );
}