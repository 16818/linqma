"use client";

import { toSocialHref } from "@/lib/social";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  instagram?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  rubika?: string | null;
  eitaa?: string | null;
  bale?: string | null;
};

type SocialKey = "instagram" | "telegram" | "whatsapp" | "rubika" | "eitaa" | "bale";

const SOCIAL_CONFIG: Record<
  SocialKey,
  { labelEn: string; bg: string; letter: string }
> = {
  instagram: { labelEn: "Instagram", bg: "bg-gradient-to-br from-purple-500 to-pink-500", letter: "I" },
  telegram: { labelEn: "Telegram", bg: "bg-[#229ED9]", letter: "T" },
  whatsapp: { labelEn: "WhatsApp", bg: "bg-[#25D366]", letter: "W" },
  rubika: { labelEn: "Rubika", bg: "bg-[#E91E63]", letter: "R" },
  eitaa: { labelEn: "Eitaa", bg: "bg-[#F39C12]", letter: "E" },
  bale: { labelEn: "Bale", bg: "bg-[#00A651]", letter: "B" },
};

export function SocialLinks(p: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const items = [
    { key: "instagram", href: toSocialHref("instagram", p.instagram) },
    { key: "telegram", href: toSocialHref("telegram", p.telegram) },
    { key: "whatsapp", href: toSocialHref("whatsapp", p.whatsapp) },
    { key: "rubika", href: toSocialHref("rubika", p.rubika) },
    { key: "eitaa", href: toSocialHref("eitaa", p.eitaa) },
    { key: "bale", href: toSocialHref("bale", p.bale) },
  ].filter((item) => !!item.href) as { key: SocialKey; href: string }[];

  if (!items.length) return null;

  async function copyLink(href: string, key: string) {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt("لینک را کپی کنید:", href);
    }
  }

  return (
    <div className="flex flex-wrap items-start justify-center gap-5">
      {items.map((item) => {
        const config = SOCIAL_CONFIG[item.key];
        return (
          <div key={item.key} className="flex flex-col items-center gap-1.5">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm hover:scale-105 transition-transform ${config.bg}`}
              aria-label={config.labelEn}
            >
              {config.letter}
            </a>
            <span className="text-[10px] font-medium text-[#64748B]" dir="ltr">
              {config.labelEn}
            </span>
            <button
              type="button"
              onClick={() => copyLink(item.href, item.key)}
              className="flex items-center gap-1 text-[9px] text-[#94A3B8] hover:text-[#0F172A] transition cursor-pointer"
            >
              {copied === item.key ? (
                <>
                  <Check className="w-3 h-3" />
                  کپی شد
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  کپی لینک
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}