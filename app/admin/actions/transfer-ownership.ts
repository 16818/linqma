"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";

export async function transferOwnership(
  businessId: string,
  newOwnerId: string
): Promise<{ ok: boolean; error?: string }> {
  const { ok, user } = await requireAdmin();
  if (!ok || !user) {
    return { ok: false, error: "دسترسی غیرمجاز" };
  }

  if (!businessId || !newOwnerId) {
    return { ok: false, error: "اطلاعات ناقص" };
  }

  const supabase = await createClient();

  // چک کردن کاربر جدید
  const { data: newOwnerProfile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", newOwnerId)
    .maybeSingle();

  if (!newOwnerProfile) {
    return { ok: false, error: "کاربر مورد نظر پیدا نشد" };
  }

  // چک کردن اینکه کاربر نقش owner دارد (نه admin)
  if (newOwnerProfile.role === "admin") {
    return {
      ok: false,
      error: "نمی‌توان مالکیت را به یک مدیر منتقل کرد",
    };
  }

  // چک کردن اینکه کسب‌وکار وجود دارد
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, owner_id")
    .eq("id", businessId)
    .maybeSingle();

  if (!business) {
    return { ok: false, error: "کسب‌وکار پیدا نشد" };
  }

  // اگر مالک فعلی همان است، کاری نکن
  if (business.owner_id === newOwnerId) {
    return { ok: false, error: "این کاربر از قبل مالک این کسب‌وکار است" };
  }

  // واگذاری
  const { error: updateError } = await supabase
    .from("businesses")
    .update({ owner_id: newOwnerId })
    .eq("id", businessId);

  if (updateError) {
    return { ok: false, error: "خطا در واگذاری: " + updateError.message };
  }

  revalidatePath(`/admin/business/${businessId}`);
  revalidatePath("/admin");

  return { ok: true };
}