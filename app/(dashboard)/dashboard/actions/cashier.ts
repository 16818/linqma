"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanConfig } from "@/lib/plans";

function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function createCashierAction(input: {
  email: string;
  password?: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false as const, message: "لاگین لازم است." };

    const { data: business } = await supabase
      .from("businesses")
      .select("id, plan")
      .eq("owner_id", user.id)
      .single();

    if (!business) {
      return { ok: false as const, message: "کسب‌وکار یافت نشد." };
    }

    const plan = getPlanConfig(business.plan);
    if (!plan.hasCashier) {
      return { ok: false as const, message: "صندوق‌دار در پکیج شما فعال نیست." };
    }

    const email = input.email.trim().toLowerCase();
    if (!email.includes("@")) {
      return { ok: false as const, message: "ایمیل معتبر وارد کنید." };
    }

    const password =
      input.password && input.password.trim().length >= 8
        ? input.password.trim()
        : generateTempPassword(10);

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        ok: false as const,
        message: "SUPABASE_SERVICE_ROLE_KEY روی سرور تنظیم نشده است.",
      };
    }

    const admin = createAdminClient();

    // بررسی اینکه آیا کاربر از قبل در Auth وجود دارد؟
    const { data: listData } = await admin.auth.admin.listUsers({
      perPage: 1000,
    });
    const existing = listData?.users?.find(
      (u) => u.email?.toLowerCase() === email
    );

    let authUserId: string;

    if (existing) {
      const { error: updErr } = await admin.auth.admin.updateUserById(
        existing.id,
        {
          password,
          email_confirm: true,
        }
      );
      if (updErr) {
        return {
          ok: false as const,
          message: `کاربر از قبل بود؛ به‌روزرسانی رمز: ${updErr.message}`,
        };
      }
      authUserId = existing.id;
    } else {
      const { data: created, error: createErr } =
        await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (createErr) {
        console.error("[createCashier] createUser", createErr);
        return {
          ok: false as const,
          message: `ساخت Auth ناموفق: ${createErr.message}`,
        };
      }
      if (!created?.user?.id) {
        return {
          ok: false as const,
          message: "ساخت Auth ناموفق: user خالی برگشت.",
        };
      }
      authUserId = created.user.id;
    }

    // تأیید قطعی در Auth
    const { data: verified, error: verifyErr } =
      await admin.auth.admin.getUserById(authUserId);

    if (verifyErr || !verified?.user) {
      return {
        ok: false as const,
        message: "کاربر بعد از ساخت در Auth پیدا نشد.",
      };
    }

    // ثبت در profiles
    const { error: profileErr } = await admin.from("profiles").upsert({
      id: authUserId,
      role: "cashier",
      email,
    });
    if (profileErr) {
      console.error("[createCashier] profiles", profileErr);
    }

    // غیرفعال کردن صندوق‌داران قبلی
    await admin
      .from("business_staff")
      .update({ is_active: false })
      .eq("business_id", business.id)
      .eq("role", "cashier");

    // ثبت در business_staff
    const { error: staffErr } = await admin.from("business_staff").upsert(
      {
        business_id: business.id,
        user_id: authUserId,
        role: "cashier",
        is_active: true,
        email,
      },
      { onConflict: "business_id,user_id" }
    );

    if (staffErr) {
      console.error("[createCashier] staff", staffErr);
      return {
        ok: false as const,
        message: `Auth ساخته شد ولی staff ثبت نشد: ${staffErr.message}`,
      };
    }

    return {
      ok: true as const,
      message: "صندوق‌دار در Auth و staff ثبت شد.",
      email,
      userId: authUserId,
      tempPassword: password,
    };
  } catch (e) {
    console.error("[createCashier] exception", e);
    return {
      ok: false as const,
      message: e instanceof Error ? e.message : "خطای ناشناخته",
    };
  }
}

export async function deactivateCashierAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, message: "لاگین لازم است." };

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) return { ok: false as const, message: "کسب‌وکار یافت نشد." };

  const { error } = await supabase
    .from("business_staff")
    .update({ is_active: false })
    .eq("business_id", business.id)
    .eq("role", "cashier");

  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const, message: "صندوق‌دار غیرفعال شد." };
}

export async function confirmOrderAsCashierAction(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, message: "دسترسی ندارید." };

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    const { data: staff } = await supabase
      .from("business_staff")
      .select("business_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!staff) return { ok: false as const, message: "دسترسی ندارید." };

    const { error } = await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", orderId)
      .eq("business_id", staff.business_id);

    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "confirmed" })
    .eq("id", orderId)
    .eq("business_id", business.id);

  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
}