"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
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
          <CardTitle className="text-2xl">
            <span className="font-black tracking-wider" dir="ltr">
              LINQMA
            </span>
          </CardTitle>
          <p className="text-xs text-navy/50 mt-0.5">لینکیوما</p>
          <p className="text-sm text-navy/60 mt-2">ساخت حساب جدید</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-navy/70">
                نام کامل
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy/70">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy/70">
                رمز عبور
              </label>
              <div className="mt-1.5 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-11 px-4 pl-11 rounded-2xl border border-[#EDE8DF] bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-navy/40 hover:text-navy cursor-pointer"
                  aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-navy/40">
                حداقل ۶ کاراکتر
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={loading}
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </Button>
          </form>

          <p className="text-center text-sm text-navy/60 mt-6">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              href="/login"
              className="text-gold font-medium hover:underline"
            >
              وارد شوید
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}