"use server";

import { createClient } from "@/lib/supabase/server";
import { resolveDashboardBusiness } from "@/lib/dashboard-business";

export type FindOrderResult =
  | { ok: true; order: Record<string, unknown> }
  | { ok: false; error: string };

export async function findOrderByCode(input: {
  code: string;
  businessQuery?: string | null;
}): Promise<FindOrderResult> {
  const cleanCode = input.code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  if (!cleanCode) {
    return { ok: false, error: "کد سفارش را وارد کنید" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "وارد نشده‌اید" };
  }

  const business = await resolveDashboardBusiness(
    Promise.resolve({
      business: input.businessQuery ?? undefined,
    })
  );

  if (!business?.id) {
    return {
      ok: false,
      error: "کسب‌وکار مشخص نیست. از پنل ادمین با لینک کسب‌وکار وارد صندوق شوید.",
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("business_id", business.id)
    .eq("short_code", cleanCode)
    .maybeSingle();

  if (error) {
    console.error("findOrderByCode", error);
    return { ok: false, error: "خطا در جستجو" };
  }

  if (!data) {
    return { ok: false, error: "سفارشی با این کد پیدا نشد" };
  }

  return { ok: true, order: data };
}