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

type ServerItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
};

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
  if (input.website && input.website.trim() !== "") {
    return { ok: false as const, message: "درخواست نامعتبر." };
  }

  const supabase = await createClient();
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select(
      "id, plan, is_published, order_require_phone, order_max_per_window, order_window_seconds"
    )
    .eq("id", input.businessId)
    .maybeSingle();

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

  const rawItems = Array.isArray(input.items) ? input.items : [];
  const qtyByProduct = new Map<string, number>();

  for (const it of rawItems) {
    const rec = it as { id?: unknown; quantity?: unknown } | null;
    const pid = typeof rec?.id === "string" ? rec.id.trim() : "";
    const q = Math.floor(Number(rec?.quantity));
    if (!pid || !Number.isFinite(q) || q < 1) {
      return { ok: false as const, message: "اقلام سفارش نامعتبر است." };
    }
    const capped = Math.min(q, 99);
    qtyByProduct.set(pid, (qtyByProduct.get(pid) ?? 0) + capped);
  }

  const productIds = [...qtyByProduct.keys()];
  if (productIds.length === 0) {
    return { ok: false as const, message: "سبد خالی است." };
  }

  if (business.order_require_phone && !input.customerPhone?.trim()) {
    return { ok: false as const, message: "شماره تماس الزامی است." };
  }

  const { data: productRows, error: productError } = await supabase
    .from("products")
    .select("id, name, price, discount_price, image_url, is_available")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .in("id", productIds);

  if (productError) {
    console.error("[createOrder] products query", productError);
    return { ok: false as const, message: "خطا در خواندن محصولات." };
  }

  if (!productRows || productRows.length !== productIds.length) {
    return {
      ok: false as const,
      message: "یکی از محصولات معتبر نیست یا فعال نیست.",
    };
  }

  const productMap = new Map(productRows.map((p) => [p.id, p]));
  const serverItems: ServerItem[] = [];
  let subtotal = 0;

  for (const [pid, qty] of qtyByProduct) {
    const p = productMap.get(pid);
    if (!p) {
      return { ok: false as const, message: "یکی از محصولات معتبر نیست." };
    }
    if (p.is_available === false) {
      return {
        ok: false as const,
        message: `محصول «${p.name}» موجود نیست.`,
      };
    }
    const price = Number(p.price);
    const dp =
      p.discount_price == null ? null : Number(p.discount_price);
    const unit =
      dp != null && dp > 0 && dp < price ? dp : price;
    serverItems.push({
      id: p.id,
      name: p.name,
      price: unit,
      quantity: qty,
      imageUrl: p.image_url ?? null,
    });
    subtotal += unit * qty;
  }

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
      message:
        "تعداد سفارش‌ها از این دستگاه زیاد است. چند دقیقه بعد تلاش کنید.",
    };
  }

  let accessCodeId: string | null = null;
  let accessCodeText: string | null = null;
  let tableNo = input.tableNumber?.trim() || null;
  let discountPercent: number | null = null;
  let total = subtotal;

  const rawCode = input.orderCode?.trim().toUpperCase();

  if (rawCode) {
    const admin = createAdminClient();
    const { data: redeemed, error: redeemError } = await admin.rpc(
      "redeem_order_access_code",
      {
        p_business_id: business.id,
        p_code: rawCode,
      }
    );

    if (redeemError) {
      console.error("[createOrder] redeem rpc", redeemError);
      return {
        ok: false as const,
        message: "بررسی کد اشتراک ناموفق بود.",
      };
    }

    const row = Array.isArray(redeemed) ? redeemed[0] : redeemed;

    if (!row?.ok) {
      return {
        ok: false as const,
        message: row?.message || "کد نامعتبر است.",
      };
    }

    accessCodeId = row.code_id;
    accessCodeText = row.code_text;

    if (row.kind === "table" && row.table_no) {
      tableNo = row.table_no;
    }
    if (row.kind === "member" && row.discount_percent) {
      const pct = Number(row.discount_percent);
      discountPercent = pct;
      total = Math.round((subtotal * (100 - pct)) / 100);
    }
  }

  if (
    typeof input.total === "number" &&
    Math.abs(input.total - total) > 1
  ) {
    console.warn("[createOrder] client/server total mismatch", {
      client: input.total,
      server: total,
      businessId: business.id,
    });
  }

  const code = generateOrderCode();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      business_id: business.id,
      short_code: code,
      items: serverItems,
      total,
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