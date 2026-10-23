"use server";

import { resolveDashboardBusiness } from "@/lib/resolve-dashboard-business";

export type FindOrderResult =
  | { ok: true; order: Record<string, unknown> }
  | { ok: false; error: string };

export async function findOrderByCode(input: {
  code: string;
  businessQuery?: string | null;
}): Promise<FindOrderResult> {
  const code = input.code?.trim().toUpperCase();
  if (!code) {
    return { ok: false, error: "کد سفارش را وارد کنید." };
  }

  const { supabase, business, access } = await resolveDashboardBusiness({
    businessId: input.businessQuery ?? null,
  });

  if (!business) {
    return {
      ok: false,
      error:
        access === null
          ? "کسب‌وکار مشخص نیست. اگر ادمین هستید از لینک پنل ادمین وارد شوید."
          : "کسب‌وکار یافت نشد.",
    };
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("business_id", business.id)
    .eq("short_code", code)
    .maybeSingle();

  if (error) {
    console.error("[findOrderByCode]", error.message);
    return { ok: false, error: "خطا در جستجوی سفارش." };
  }

  if (!order) {
    return { ok: false, error: "سفارشی با این کد پیدا نشد." };
  }

  return { ok: true, order };
}