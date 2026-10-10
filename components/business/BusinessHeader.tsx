"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Phone, Instagram } from "lucide-react";

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

  return (
    <div className="w-full">
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-[#EDE8DF] overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#EDE8DF] to-[#D4C4A8]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 flex justify-center -mt-12 sm:-mt-14">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F7F6F3] text-[#D4AF37] font-black text-2xl">
              {name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 px-4 text-center max-w-xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-tight">
          {name}
        </h1>
        {description && (
          <p className="mt-1 text-[13px] text-[#64748B] line-clamp-2 leading-snug">
            {description}
          </p>
        )}

        {openStatus && (
          <div className="mt-2 flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${
                openStatus.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  openStatus.isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {openStatus.label}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 pb-4 px-4 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-2">
          {address && (
            <button
              type="button"
              onClick={() => toggle("address")}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                open === "address"
                  ? "bg-[#D4AF37] border-[#D4AF37] text-white shadow-md"
                  : "bg-white border-[#EDE8DF] text-[#0F172A] hover:border-[#D4AF37]"
              }`}
              aria-label="آدرس"
            >
              <MapPin className="w-4 h-4" />
            </button>
          )}
          {workingHours && (
            <button
              type="button"
              onClick={() => toggle("hours")}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                open === "hours"
                  ? "bg-[#D4AF37] border-[#D4AF37] text-white shadow-md"
                  : "bg-white border-[#EDE8DF] text-[#0F172A] hover:border-[#D4AF37]"
              }`}
              aria-label="ساعات کاری"
            >
              <Clock className="w-4 h-4" />
            </button>
          )}
          {phone && (
            <button
              type="button"
              onClick={() => toggle("phone")}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                open === "phone"
                  ? "bg-[#D4AF37] border-[#D4AF37] text-white shadow-md"
                  : "bg-white border-[#EDE8DF] text-[#0F172A] hover:border-[#D4AF37]"
              }`}
              aria-label="تلفن"
            >
              <Phone className="w-4 h-4" />
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
              className="w-10 h-10 rounded-full border border-[#EDE8DF] bg-white flex items-center justify-center hover:border-[#D4AF37] transition-colors cursor-pointer"
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
              className="w-10 h-10 rounded-full border border-[#EDE8DF] bg-white flex items-center justify-center text-[10px] font-bold hover:border-[#D4AF37] transition-colors cursor-pointer"
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
              className="w-10 h-10 rounded-full border border-[#EDE8DF] bg-white flex items-center justify-center text-[10px] font-bold hover:border-[#25D366] transition-colors cursor-pointer"
            >
              WA
            </a>
          )}
        </div>

        {detailText && (
          <div className="max-w-sm w-full text-center">
            {open === "phone" ? (
              <a
                href={`tel:${phone}`}
                className="inline-block text-sm font-medium text-[#0F172A] bg-[#F7F6F3] border border-[#EDE8DF] rounded-2xl px-4 py-2 cursor-pointer"
              >
                {detailText}
              </a>
            ) : (
              <p className="text-sm text-[#475569] bg-[#F7F6F3] border border-[#EDE8DF] rounded-2xl px-4 py-2">
                {detailText}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}