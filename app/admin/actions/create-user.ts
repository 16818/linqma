"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateUserResult =
  | {
      ok: true;
      userId: string;
      email: string;
      password: string;
      businessId?: string;
      slug?: string;
      plan?: string;
      logoUrl?: string | null;
    }
  | { ok: false; error: string };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function createOwnerUser(input: {
  fullName: string;
  email: string;
  password?: string;
  businessName?: string;
  businessSlug?: string;
  plan?: string;
}): Promise<CreateUserResult> {
  const gate = await requireAdmin();
  if (!gate.ok || !gate.user) {
    return { ok: false, error: "دسترسی فقط برای مدیر" };
  }

  const fullName = input.fullName.trim();
  const email = normalizeEmail(input.email);
  const password =
    input.password?.trim() && input.password.trim().length >= 6
      ? input.password.trim()
      : generatePassword(10);

  if (!fullName) return { ok: false, error: "نام کامل الزامی است" };
  if (!email.includes("@")) return { ok: false, error: "ایمیل معتبر نیست" };

  const admin = createAdminClient();

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (createError || !created.user) {
    console.error(createError);
    if (createError?.message?.toLowerCase().includes("already")) {
      return { ok: false, error: "این ایمیل قبلاً ثبت شده" };
    }
    return { ok: false, error: createError?.message || "خطا در ساخت کاربر" };
  }

  const userId = created.user.id;

  await admin.from("profiles").upsert({
    id: userId,
    email,
    full_name: fullName,
    role: "business_owner",
  });

  let businessId: string | undefined;
  let savedSlug: string | undefined;
  let savedPlan: string | undefined;
  let savedLogoUrl: string | null | undefined;

  const businessName = input.businessName?.trim();
  const businessSlug = input.businessSlug
    ? normalizeSlug(input.businessSlug)
    : undefined;
  const plan = input.plan?.trim() || "basic";

  if (businessName && businessSlug) {
    const { data: biz, error: bizError } = await admin
      .from("businesses")
      .insert({
        owner_id: userId,
        name: businessName,
        slug: businessSlug,
        is_published: false,
        plan: plan,
      })
      .select("id, slug, plan, logo_url")
      .single();

    if (bizError) {
      console.error(bizError);
      revalidatePath("/admin");
      return {
        ok: true,
        userId,
        email,
        password,
        businessId: undefined,
      };
    }
    businessId = biz.id;
    savedSlug = biz.slug;
    savedPlan = biz.plan;
    savedLogoUrl = biz.logo_url;
  }

  revalidatePath("/admin");
  return {
    ok: true,
    userId,
    email,
    password,
    businessId,
    slug: savedSlug,
    plan: savedPlan,
    logoUrl: savedLogoUrl,
  };
}