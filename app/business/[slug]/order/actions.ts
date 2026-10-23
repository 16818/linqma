"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanConfig } from "@/lib/plans";

type ClientCartItem = {
  id?: string;
  product_id?: string;
  quantity?: number;
  qty?: number;
  name?: string;
  price?: number;
  imageUrl?: string | null;
};

function generateOrderCode(length = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function createOrderAction(input: {
  businessId: string;
  items: ClientCartItem[];
  orderCode?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerNote?: string | null;
  tableNo?: string | null;
  website?: string | null;
  total?: number;
}) {
  try {
    if (input.website && String(input.website).trim() !== "") {
      return { ok: false as const, message: "درخواست نامعتبر است." };
    }

    if (!input.businessId) {
      return {
        ok: false as const,
        message: "شناسه کسب‌وکار نامعتبر است.",
      };
    }

    const supabase = await createClient();
    const admin = createAdminClient();

    const { data: business, error: businessError } = await admin
      .from("businesses")
      .select(
        "id, plan, is_published, order_require_phone, order_max_per_window, order_window_seconds"
      )
      .eq("id", input.businessId)
      .maybeSingle();

    if (businessError) {
      console.error("[createOrder] business", businessError);
      return {
        ok: false as const,
        message: "خطا در خواندن اطلاعات فروشگاه.",
      };
    }

    if (!business) {
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

    if (
      business.order_require_phone &&
      !(input.customerPhone && String(input.customerPhone).trim())
    ) {
      return {
        ok: false as const,
        message: "شماره تماس الزامی است.",
      };
    }

    const raw = Array.isArray(input.items) ? input.items : [];
    if (raw.length === 0) {
      return { ok: false as const, message: "سبد خالی است." };
    }

    const qtyByProduct = new Map<string, number>();
    for (const it of raw) {
      const pid = (it.product_id || it.id || "").trim();
      const qRaw = it.quantity ?? it.qty ?? 0;
      const q = Math.floor(Number(qRaw));
      if (!pid || !Number.isFinite(q) || q < 1) {
        return { ok: false as const, message: "اقلام نامعتبر است." };
      }
      const capped = Math.min(q, 99);
      qtyByProduct.set(pid, (qtyByProduct.get(pid) ?? 0) + capped);
    }

    const productIds = [...qtyByProduct.keys()];

    const { data: products, error: pErr } = await admin
      .from("products")
      .select(
        "id, name, price, discount_price, image_url, is_available, business_id"
      )
      .eq("business_id", business.id)
      .in("id", productIds);

    if (pErr) {
      console.error("[createOrder] products", pErr);
      return {
        ok: false as const,
        message: "خطا در خواندن محصولات.",
      };
    }

    if (!products || products.length !== productIds.length) {
      return {
        ok: false as const,
        message: "یکی از محصولات معتبر نیست.",
      };
    }

    for (const p of products) {
      if (p.is_available === false) {
        return {
          ok: false as const,
          message: `محصول «${p.name}» موجود نیست.`,
        };
      }
    }

    const serverItems = products.map((p) => {
      const qty = qtyByProduct.get(p.id)!;
      const base = Number(p.price) || 0;
      const disc =
        p.discount_price != null ? Number(p.discount_price) : null;
      const unit =
        disc != null && disc > 0 && disc < base ? disc : base;

      return {
        id: p.id,
        name: p.name,
        price: unit,
        quantity: qty,
        imageUrl: p.image_url ?? null,
      };
    });

    let total = serverItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    if (
      typeof input.total === "number" &&
      Math.abs(input.total - total) > 0.5
    ) {
      console.warn("[createOrder] client/server total mismatch", {
        client: input.total,
        server: total,
      });
    }

    let accessCodeId: string | null = null;
    const rawCode = (input.orderCode || "").trim();

    if (rawCode) {
      const { data: redeemed, error: rpcErr } = await admin.rpc(
        "redeem_order_access_code",
        {
          p_business_id: business.id,
          p_code: rawCode,
        }
      );

      if (rpcErr) {
        console.error("[createOrder] redeem rpc", rpcErr);
        return {
          ok: false as const,
          message: "خطا در بررسی کد اشتراک.",
        };
      }

      const row = Array.isArray(redeemed) ? redeemed[0] : redeemed;

      if (!row?.ok) {
        return {
          ok: false as const,
          message: row?.message || "کد نامعتبر است.",
        };
      }

      accessCodeId = row.code_id ?? null;

      if (
        row.kind === "member" &&
        row.discount_percent != null &&
        Number(row.discount_percent) > 0
      ) {
        const pct = Math.min(100, Number(row.discount_percent));
        total = Math.max(0, Math.round(total * (1 - pct / 100)));
      }
    }

    const shortCode = generateOrderCode(4);

    const insertPayload: Record<string, unknown> = {
      business_id: business.id,
      short_code: shortCode,
      items: serverItems,
      total,
      status: "pending",
      customer_name: input.customerName?.trim() || null,
      customer_phone: input.customerPhone?.trim() || null,
      customer_note: input.customerNote?.trim() || null,
      table_number: input.tableNo?.trim() || null,
    };

    if (accessCodeId) {
      insertPayload.access_code_id = accessCodeId;
    }

    const { data: order, error: insErr } = await admin
      .from("orders")
      .insert(insertPayload)
      .select("id, short_code, total, items, status")
      .maybeSingle();

    if (insErr || !order) {
      console.error("[createOrder] insert", insErr);
      return {
        ok: false as const,
        message: insErr?.message || "ثبت سفارش ناموفق بود.",
      };
    }

    return {
      ok: true as const,
      order,
      shortCode: order.short_code as string,
      total: order.total as number,
    };
  } catch (e) {
    console.error("[createOrder] exception", e);
    return {
      ok: false as const,
      message: e instanceof Error ? e.message : "خطای ناشناخته",
    };
  }
}