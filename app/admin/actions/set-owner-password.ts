"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

async function assertIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, message: "لاگین نیستید." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false as const, message: "دسترسی غیرمجاز." };
  }

  return { ok: true as const, adminId: user.id };
}

export async function setOwnerPasswordAction(input: {
  businessId: string;
  password?: string;
}) {
  const gate = await assertIsAdmin();
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { data: business, error } = await supabase
    .from("businesses")
    .select("id, owner_id, name")
    .eq("id", input.businessId)
    .single();

  if (error || !business?.owner_id) {
    return { ok: false as const, message: "کسب‌وکار یا مالک یافت نشد." };
  }

  const password =
    input.password && input.password.length >= 8
      ? input.password
      : generateTempPassword(10);

  const admin = createAdminClient();
  const { error: updError } = await admin.auth.admin.updateUserById(
    business.owner_id,
    { password }
  );

  if (updError) {
    return {
      ok: false as const,
      message: updError.message || "تغییر رمز در Auth ناموفق بود.",
    };
  }

  return {
    ok: true as const,
    message: "رمز موقت تنظیم شد. همین الان به مشتری بدهید.",
    tempPassword: password,
    businessName: business.name,
  };
}