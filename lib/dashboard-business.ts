import { createClient } from "@/lib/supabase/server";

export type ResolvedBusiness = {
  id: string;
  name: string;
  slug: string;
  is_published: boolean;
  plan: string;
} | null;

export async function resolveDashboardBusiness(
  searchParams: Promise<{ business?: string }>
): Promise<ResolvedBusiness> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { business: businessParam } = await searchParams;

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
        .select("id, name, slug, is_published, plan")
        .eq("id", businessParam)
        .maybeSingle();

      if (targetBusiness) {
        return targetBusiness;
      }
    }
  }

  const { data: ownBusiness } = await supabase
    .from("businesses")
    .select("id, name, slug, is_published, plan")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return ownBusiness;
}