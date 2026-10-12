"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Phone, Instagram, Share2 } from "lucide-react";

interface BusinessHeaderProps {
  name: string;
  description?: string;
  address?: string;
  workingHours?: string;
  phone?: string;
  coverUrl?: string;
  logoUrl?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
}

type DetailKey = "address" | "hours" | "phone" | null;

function getOpenStatus(workingHours?: string): {
  isOpen: boolean;
  label: string;
} | null {
  if (!workingHours) return null;

  const match = workingHours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const startH = parseInt(match[1], 10);
  const startM = parseInt(match[2], 10);
  const endH = parseInt(match[3], 10);
  const endM = parseInt(match[4], 10);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  if (endMinutes === 0) endMinutes = 24 * 60;

  let isOpen = false;
  if (endMinutes > startMinutes) {
    isOpen = currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    isOpen = currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }

  return {
    isOpen,
    label: isOpen ? "اکنون باز است" : "اکنون بسته است",
  };
}

export function BusinessHeader({
  name,
  description,
  address,
  workingHours,
  phone,
  coverUrl,
  logoUrl,
  instagram,
  telegram,
  whatsapp,
}: BusinessHeaderProps) {
  const [open, setOpen] = useState<DetailKey>(null);
  const [openStatus, setOpenStatus] = useState<{
    isOpen: boolean;
    label: string;
  } | null>(null);

  useEffect(() => {
    setOpenStatus(getOpenStatus(workingHours));
    const interval = setInterval(() => {
      setOpenStatus(getOpenStatus(workingHours));
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [workingHours]);

  const toggle = (key: DetailKey) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  const detailText =
    open === "address"
      ? address
      : open === "hours"
      ? workingHours
      : open === "phone"
      ? phone
      : null;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: description || `ویترین ${name}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("لینک کپی شد");
      } catch {}
    }
  };

  return (
    <div className="w-full">
      {/* کاور */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 bg-[#EDE8DF] overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#EDE8DF] to-[#D4C4A8]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

        {/* دکمه اشتراک‌گذاری */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="اشتراک‌گذاری"
          className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md cursor-pointer hover:bg-white transition z-20"
        >
          <Share2 className="w-4 h-4 text-[#0F172A]" />
        </button>
      </div>

      {/* کارت اصلی */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] border border-[#EDE8DF]/60 p-5 sm:p-8">
          {/* لوگو */}
          <div className="flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[5px] border-white bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.25)] overflow-hidden -mt-20 sm:-mt-24 ring-1 ring-[#EDE8DF]">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F7F6F3] text-[#D4AF37] font-black text-3xl">
                  {name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* نام + وضعیت */}
          <div className="mt-4 text-center">
            <h1 className="text-[22px] sm:text-[28px] font-black text-[#0F172A] tracking-tight leading-tight">
              {name}
            </h1>

            {description && (
              <p className="mt-2 text-[13px] sm:text-[14px] text-[#64748B] leading-relaxed max-w-md mx-auto">
                {description}
              </p>
            )}

            {openStatus && (
              <div className="mt-3 flex justify-center">
                <span
                  className={`inline-flex items-center gap-2 text-[11px] font-bold px-3.5 py-1.5 rounded-full ${
                    openStatus.isOpen
                      ? "bg-[#DCFCE7] text-[#166534]"
                      : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      openStatus.isOpen
                        ? "bg-[#22C55E] animate-pulse"
                        : "bg-[#EF4444]"
                    }`}
                  />
                  {openStatus.label}
                </span>
              </div>
            )}
          </div>

          {/* دکمه‌های تماس */}
          <div className="mt-6 pt-5 border-t border-[#EDE8DF]/70 flex flex-wrap items-center justify-center gap-2">
            {address && (
              <button
                type="button"
                onClick={() => toggle("address")}
                className={`flex items-center gap-2 h-10 px-4 rounded-full border text-[12px] font-bold transition-all cursor-pointer ${
                  open === "address"
                    ? "bg-[#D4AF37] border-[#D4AF37] text-white shadow-md"
                    : "bg-[#FAF7F2] border-[#EDE8DF] text-[#0F172A] hover:border-[#D4AF37] hover:bg-white"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>آدرس</span>
              </button>
            )}
            {workingHours && (
              <button
                type="button"
                onClick={() => toggle("hours")}
                className={`flex items-center gap-2 h-10 px-4 rounded-full border text-[12px] font-bold transition-all cursor-pointer ${
                  open === "hours"
                    ? "bg-[#D4AF37] border-[#D4AF37] text-white shadow-md"
                    : "bg-[#FAF7F2] border-[#EDE8DF] text-[#0F172A] hover:border-[#D4AF37] hover:bg-white"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>ساعات</span>
              </button>
            )}
            {phone && (
              <button
                type="button"
                onClick={() => toggle("phone")}
                className={`flex items-center gap-2 h-10 px-4 rounded-full border text-[12px] font-bold transition-all cursor-pointer ${
                  open === "phone"
                    ? "bg-[#D4AF37] border-[#D4AF37] text-white shadow-md"
                    : "bg-[#FAF7F2] border-[#EDE8DF] text-[#0F172A] hover:border-[#D4AF37] hover:bg-white"
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>تماس</span>
              </button>
            )}

            {instagram && (
              <a
                href={
                  instagram.startsWith("http")
                    ? instagram
                    : `https://instagram.com/${instagram.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#EDE8DF] bg-[#FAF7F2] flex items-center justify-center hover:border-[#D4AF37] hover:bg-white transition-colors cursor-pointer"
                aria-label="اینستاگرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {telegram && (
              <a
                href={
                  telegram.startsWith("http")
                    ? telegram
                    : `https://t.me/${telegram.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#EDE8DF] bg-[#FAF7F2] flex items-center justify-center text-[10px] font-bold hover:border-[#D4AF37] hover:bg-white transition-colors cursor-pointer"
                aria-label="تلگرام"
              >
                TG
              </a>
            )}
            {whatsapp && (
              <a
                href={
                  whatsapp.startsWith("http")
                    ? whatsapp
                    : `https://wa.me/${whatsapp.replace(/\D/g, "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#EDE8DF] bg-[#FAF7F2] flex items-center justify-center text-[10px] font-bold hover:border-[#25D366] hover:bg-white transition-colors cursor-pointer"
                aria-label="واتساپ"
              >
                WA
              </a>
            )}
          </div>

          {/* نمایش جزئیات */}
          {detailText && (
            <div className="mt-4">
              {open === "phone" ? (
                <a
                  href={`tel:${phone}`}
                  className="block text-center text-sm font-medium text-[#0F172A] bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl px-4 py-3 cursor-pointer hover:bg-[#EFE9DF] transition"
                >
                  📞 {detailText}
                </a>
              ) : (
                <div className="text-center text-sm text-[#475569] bg-[#FAF7F2] border border-[#EDE8DF] rounded-2xl px-4 py-3 leading-relaxed">
                  {open === "address" && "📍 "}
                  {open === "hours" && "🕐 "}
                  {detailText}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}