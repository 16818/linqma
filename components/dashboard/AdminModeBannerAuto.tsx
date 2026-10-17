"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminModeBanner } from "./AdminModeBanner";

export function AdminModeBannerAuto() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("business");
  const [businessName, setBusinessName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!businessId) {
      setIsAdmin(false);
      return;
    }

    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        setIsAdmin(false);
        return;
      }

      const { data: business } = await supabase
        .from("businesses")
        .select("name")
        .eq("id", businessId)
        .maybeSingle();

      if (business) {
        setBusinessName(business.name);
        setIsAdmin(true);
      }
    })();
  }, [businessId]);

  if (!isAdmin || !businessId) return null;

  return (
    <AdminModeBanner
      businessName={businessName}
      businessId={businessId}
    />
  );
}