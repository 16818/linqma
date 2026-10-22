"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: "err", text: "رمز جدید حداقل ۸ کاراکتر باشد." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "err", text: "تکرار رمز جدید یکسان نیست." });
      return;
    }
    if (currentPassword === newPassword) {
      setMessage({ type: "err", text: "رمز جدید نباید با رمز فعلی یکی باشد." });
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      setMessage({ type: "err", text: "نشست معتبر نیست. دوباره وارد شوید." });
      setLoading(false);
      return;
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (reauthError) {
      setMessage({ type: "err", text: "رمز فعلی نادرست است." });
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (updateError) {
      setMessage({
        type: "err",
        text: updateError.message || "تغییر رمز انجام نشد.",
      });
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage({ type: "ok", text: "رمز عبور با موفقیت تغییر کرد." });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-navy">رمز فعلی</label>
        <input
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full rounded-2xl border border-[#EDE8DF] bg-cream px-4 py-2.5 text-navy outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-navy">رمز جدید</label>
        <input
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-2xl border border-[#EDE8DF] bg-cream px-4 py-2.5 text-navy outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-navy">تکرار رمز جدید</label>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-2xl border border-[#EDE8DF] bg-cream px-4 py-2.5 text-navy outline-none focus:border-gold"
        />
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === "ok" ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "در حال ذخیره..." : "تغییر رمز عبور"}
      </Button>
    </form>
  );
}