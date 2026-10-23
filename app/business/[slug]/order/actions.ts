"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanConfig } from "@/lib/plans";

function generateOrderCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < 2; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 4; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return code;
}

function hashKey(s: string) {
  return s.slice(0, 64);
}

async function consumeRateLimit(opts: {
  businessId: string;
  clientKey: string;
  max: number;
  windowSec: number;
}) {
  const admin = createAdminClient();
  const since = new Date(Date.now() - opts.windowSec * 1000).toISOString();

  const { data: rows } = await admin
    .from("order_rate_limits")
    .select("id, order_count, window_start")
    .eq("business_id", opts.businessId)
    .eq("client_key", opts.clientKey)
    .gte("window_start", since)
    .order("window_start", { ascending: false })
    .limit(1);

  const row = rows?.[0];
  if (!row) {
    await admin.from("order_rate_limits").insert({
      business_id: opts.businessId,
      client_key: opts.clientKey,
      order_count: 1,
    });
    return true;
  }
  if (row.order_count >= opts.max) return false;
  await admin
    .from("order_rate_limits")
    .update({ order_count: row.order_count + 1 })
    .eq("id", row.id);
  return true;
}

export async function createOrderAction(input: {
  businessId: string;
  items: unknown[];
  customerName?: string;
  customerPhone?: string;
  customerNote?: string;
  tableNumber?: string;
  total: number;
  website?: string;
  orderCode?: string;
}) {
  // 1) Honeypot
  if (input.website && input.website.trim() !== "") {
    return { ok: false as const, message: "درخواست نامعتبر." };
  }

  // 2) بررسی کسب‌وکار
  const supabase = await createClient();
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select(
      "id, plan, is_published, order_require_phone, order_max_per_window, order_window_seconds"
    )
    .eq("id", input.businessId)
    .maybeSingle();

  console.log("[createOrder]", {
    businessId: input.businessId,
    business,
    businessError,
  });

  if (businessError) {
    console.error("[createOrder] business query", businessError);
    return {
      ok: false as const,
      message: "خطا در خواندن اطلاعات فروشگاه.",
    };
  }

  if (!business) {
    console.error("[createOrder] business not found or RLS blocked", {
      businessId: input.businessId,
    });
    return {
      ok: false as const,
      message: "فروشگاه یافت نشد یا قابل مشاهده نیست.",
    };
  }

  if (!business.is_published) {
    return { ok: false as const, message: "ویترین فعال نیست." };
  }

  const plan = getPlanConfig(business.plan);
  if (!plan.hasOrders) {
    return {
      ok: false as const,
      message: "ثبت سفارش در این پکیج فعال نیست.",
    };
  }

  // 3) Validation
  if (!input.items?.length) {
    return { ok: false as const, message: "سبد خالی است." };
  }

  if (business.order_require_phone && !input.customerPhone?.trim()) {
    return { ok: false as const, message: "شماره تماس الزامی است." };
  }

  // 4) Rate limit
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const clientKey = hashKey(ip);

  const max = business.order_max_per_window ?? 5;
  const windowSec = business.order_window_seconds ?? 300;

  const allowed = await consumeRateLimit({
    businessId: business.id,
    clientKey,
    max,
    windowSec,
  });

  if (!allowed) {
    return {
      ok: false as const,
      message: "تعداد سفارش‌ها از این دستگاه زیاد است. چند دقیقه بعد تلاش کنید.",
    };
  }

  // 5) بررسی کد اشتراک
  let accessCodeId: string | null = null;
  let accessCodeText: string | null = null;
  let tableNo = input.tableNumber?.trim() || null;
  let discountPercent: number | null = null;

  const rawCode = input.orderCode?.trim().toUpperCase();

  if (business.order_require_phone && !rawCode) {
    // این شرط در کد اصلی شما نبود، اما اگر نیاز به اجبار کد دارید، اینجا اعمال کنید
  }

  if (rawCode) {
    const { data: codeRow } = await supabase
      .from("order_access_codes")
      .select("*")
      .eq("business_id", business.id)
      .eq("code", rawCode)
      .eq("is_active", true)
      .maybeSingle();

    if (!codeRow) {
      return { ok: false as const, message: "کد نامعتبر است." };
    }
    if (codeRow.expires_at && new Date(codeRow.expires_at) < new Date()) {
      return { ok: false as const, message: "کد منقضی شده است." };
    }
    if (codeRow.max_uses != null && codeRow.used_count >= codeRow.max_uses) {
      return { ok: false as const, message: "سقف استفاده از این کد پر شده است." };
    }

    accessCodeId = codeRow.id;
    accessCodeText = codeRow.code;
    if (codeRow.kind === "table" && codeRow.table_no) {
      tableNo = codeRow.table_no;
    }
    if (codeRow.kind === "member" && codeRow.discount_percent) {
      discountPercent = codeRow.discount_percent;
    }

    await supabase
      .from("order_access_codes")
      .update({ used_count: codeRow.used_count + 1 })
      .eq("id", codeRow.id);
  }

  // 6) Insert
  const code = generateOrderCode();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      business_id: business.id,
      short_code: code,
      items: input.items,
      total: input.total,
      status: "pending",
      customer_name: input.customerName?.trim() || null,
      customer_phone: input.customerPhone?.trim() || null,
      customer_note: input.customerNote?.trim() || null,
      table_number: tableNo,
      access_code_id: accessCodeId,
      access_code_text: accessCodeText,
    })
    .select("id, short_code")
    .single();

  if (error) {
    console.error("Order insert error:", error);
    return { ok: false as const, message: error.message || "خطا در ثبت سفارش" };
  }

  return { ok: true as const, order: data, discountPercent };
}