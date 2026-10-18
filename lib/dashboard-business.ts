import { createClient } from "@/lib/supabase/server";

export type ResolvedBusiness = {
  id: string;
  name: string;
  slug: string;
  is_published: boolean;
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

  // ۱. حالت مدیر: اگر پارامتر business هست
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
        return targetBusiness;
      }
    }
  }

  // ۲. حالت عادی: کسب‌وکار خود کاربر
  const { data: ownBusiness } = await supabase
    .from("businesses")
    .select("id, name, slug, is_published")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return ownBusiness;
}