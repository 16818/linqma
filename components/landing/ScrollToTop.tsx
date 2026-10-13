"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="بازگشت به بالا"
      className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(0,0,0,0.3)] hover:bg-[#1E293B] transition-all duration-300 cursor-pointer"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}