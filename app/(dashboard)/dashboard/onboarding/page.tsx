"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!name.trim()) {
      setError("نام کسب‌وکار را وارد کنید");
      setLoading(false);
      return;
    }

    if (!cleanSlug || cleanSlug.length < 2) {
      setError("آدرس باید انگلیسی باشد، مثلاً cafe-rozhan");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("لطفاً دوباره وارد شوید");
      setLoading(false);
      return;
    }

    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (existing) {
      setError("این آدرس قبلاً استفاده شده است");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("businesses").insert({
      owner_id: user.id,
      name: name.trim(),
      slug: cleanSlug,
      is_published: false,
      plan: "basic",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cream font-vazir flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ساخت کسب‌وکار شما</CardTitle>
          <p className="text-sm text-navy/60 mt-1">
            نام فارسی باشد؛ آدرس فقط انگلیسی
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-navy/70">
                نام کسب‌وکار *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="مثلاً کافه روژان"
                className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy/70">
                آدرس اختصاصی * (فقط انگلیسی)
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-sm text-navy/50">linqma.ir/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                  }
                  required
                  placeholder="cafe-rozhan"
                  className="flex-1 h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button type="submit" variant="gold" className="w-full" disabled={loading}>
              {loading ? "در حال ساخت..." : "ساخت کسب‌وکار"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}