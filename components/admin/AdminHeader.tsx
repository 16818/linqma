"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function AdminHeader() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="h-11 px-5 rounded-2xl bg-white border border-[#EDE8DF] text-[#0F172A] text-sm font-bold flex items-center gap-2 cursor-pointer hover:border-red-300 hover:text-red-600 transition"
    >
      <LogOut className="w-4 h-4" />
      خروج از حساب
    </button>
  );
}