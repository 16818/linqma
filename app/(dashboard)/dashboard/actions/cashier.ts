"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanConfig } from "@/lib/plans";

function generateTempPassword(length = 10) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function createCashierAction(input: {
  email: string;
  password?: string;
  businessId?: string | null;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false as const, message: "لاگین لازم است." };
    }

    const email = (input.email || "").trim().toLowerCase();
    if (!email.includes("@")) {
      return { ok: false as const, message: "ایمیل معتبر وارد کنید." };
    }

    const password =
      input.password && input.password.trim().length >= 8
        ? input.password.trim()
        : generateTempPassword(10);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin =
      profile?.role === "admin" || profile?.role === "super_admin";

    let business: { id: string; plan: string } | null = null;

    if (isAdmin && input.businessId) {
      const admin = createAdminClient();
      const { data } = await admin
        .from("businesses")
        .select("id, plan")
        .eq("id", input.businessId)
        .maybeSingle();
      business = data;
    } else {
      const { data } = await supabase
        .from("businesses")
        .select("id, plan")
        .eq("owner_id", user.id)
        .maybeSingle();
      business = data;
    }

    if (!business) {
      return { ok: false as const, message: "کسب‌وکار یافت نشد." };
    }

    const plan = getPlanConfig(business.plan);
    if (!plan.hasCashier) {
      return {
        ok: false as const,
        message: "صندوق‌دار در پکیج شما فعال نیست.",
      };
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        ok: false as const,
        message: "SUPABASE_SERVICE_ROLE_KEY روی سرور تنظیم نشده است.",
      };
    }

    const admin = createAdminClient();

    const { data: listData, error: listErr } =
      await admin.auth.admin.listUsers({ perPage: 1000 });

    if (listErr) {
      console.error("[createCashier] listUsers", listErr);
      return {
        ok: false as const,
        message: "خطا در بررسی کاربران Auth.",
      };
    }

    const existing = listData?.users?.find(
      (u) => u.email?.toLowerCase() === email
    );

    if (existing) {
      const { data: existingProfile } = await admin
        .from("profiles")
        .select("role")
        .eq("id", existing.id)
        .maybeSingle();

      const role = existingProfile?.role;

      if (
        role === "admin" ||
        role === "super_admin" ||
        role === "business_owner"
      ) {
        return {
          ok: false as const,
          message: "این ایمیل قابل اختصاص به‌عنوان صندوق‌دار نیست.",
        };
      }

      const { data: sameStaff } = await admin
        .from("business_staff")
        .select("id, is_active, business_id")
        .eq("business_id", business.id)
        .eq("user_id", existing.id)
        .eq("role", "cashier")
        .maybeSingle();

      if (!sameStaff) {
        return {
          ok: false as const,
          message: "این ایمیل قبلاً ثبت شده و قابل استفاده نیست.",
        };
      }

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
          message: `به‌روزرسانی رمز ناموفق: ${updErr.message}`,
        };
      }

      await admin.from("profiles").upsert({
        id: existing.id,
        role: "cashier",
        email,
      });

      const { error: staffUpdErr } = await admin
        .from("business_staff")
        .update({
          is_active: true,
          email,
        })
        .eq("id", sameStaff.id);

      if (staffUpdErr) {
        return {
          ok: false as const,
          message: `ثبت staff ناموفق: ${staffUpdErr.message}`,
        };
      }

      return {
        ok: true as const,
        message: "صندوق‌دار قبلی فعال و رمز او به‌روز شد.",
        email,
        tempPassword: password,
        userId: existing.id,
      };
    }

    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createErr || !created?.user?.id) {
      console.error("[createCashier] createUser", createErr);
      return {
        ok: false as const,
        message: `ساخت Auth ناموفق: ${createErr?.message || "user خالی"}`,
      };
    }

    const authUserId = created.user.id;

    const { data: verified, error: verifyErr } =
      await admin.auth.admin.getUserById(authUserId);

    if (verifyErr || !verified?.user) {
      return {
        ok: false as const,
        message: "کاربر بعد از ساخت در Auth پیدا نشد.",
      };
    }

    await admin.from("profiles").upsert({
      id: authUserId,
      role: "cashier",
      email,
    });

    await admin
      .from("business_staff")
      .update({ is_active: false })
      .eq("business_id", business.id)
      .eq("role", "cashier")
      .eq("is_active", true);

    const { error: staffErr } = await admin.from("business_staff").insert({
      business_id: business.id,
      user_id: authUserId,
      role: "cashier",
      is_active: true,
      email,
    });

    if (staffErr) {
      console.error("[createCashier] staff insert", staffErr);
      return {
        ok: false as const,
        message: `Auth ساخته شد ولی staff ثبت نشد: ${staffErr.message}`,
      };
    }

    return {
      ok: true as const,
      message: "صندوق‌دار در Auth و staff ثبت شد.",
      email,
      tempPassword: password,
      userId: authUserId,
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