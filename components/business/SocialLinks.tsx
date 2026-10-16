"use client";

import { Instagram } from "lucide-react";
import { toSocialHref } from "@/lib/social";
import { useState } from "react";

type Props = {
  instagram?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  rubika?: string | null;
  eitaa?: string | null;
  bale?: string | null;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function LetterBadge({
  letter,
  className,
}: {
  letter: string;
  className?: string;
}) {
  return (
    <span className={`text-[11px] font-black leading-none ${className || ""}`}>
      {letter}
    </span>
  );
}

type Item = {
  key: string;
  href: string;
  label: string;
  bg: string;
  fg: string;
  icon: React.ReactNode;
};

export function SocialLinks(p: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const items: Item[] = [];

  const ig = toSocialHref("instagram", p.instagram);
  if (ig) {
    items.push({
      key: "instagram",
      href: ig,
      label: "اینستاگرام",
      bg: "bg-gradient-to-br from-purple-500 to-pink-500",
      fg: "text-white",
      icon: <Instagram className="w-4 h-4" />,
    });
  }

  const tg = toSocialHref("telegram", p.telegram);
  if (tg) {
    items.push({
      key: "telegram",
      href: tg,
      label: "تلگرام",
      bg: "bg-[#229ED9]",
      fg: "text-white",
      icon: <TelegramIcon className="w-4 h-4" />,
    });
  }

  const wa = toSocialHref("whatsapp", p.whatsapp);
  if (wa) {
    items.push({
      key: "whatsapp",
      href: wa,
      label: "واتساپ",
      bg: "bg-[#25D366]",
      fg: "text-white",
      icon: <WhatsAppIcon className="w-4 h-4" />,
    });
  }

  const ru = toSocialHref("rubika", p.rubika);
  if (ru) {
    items.push({
      key: "rubika",
      href: ru,
      label: "روبیکا",
      bg: "bg-[#E91E63]",
      fg: "text-white",
      icon: <LetterBadge letter="R" />,
    });
  }

  const ei = toSocialHref("eitaa", p.eitaa);
  if (ei) {
    items.push({
      key: "eitaa",
      href: ei,
      label: "ایتا",
      bg: "bg-[#F39C12]",
      fg: "text-white",
      icon: <LetterBadge letter="E" />,
    });
  }

  const ba = toSocialHref("bale", p.bale);
  if (ba) {
    items.push({
      key: "bale",
      href: ba,
      label: "بله",
      bg: "bg-[#00A651]",
      fg: "text-white",
      icon: <LetterBadge letter="ب" />,
    });
  }

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
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((it) => (
          <div key={it.key} className="flex items-center gap-1">
            <a
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={it.label}
              title={it.label}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${it.bg} ${it.fg} hover:opacity-90 transition`}
            >
              {it.icon}
            </a>
            <button
              type="button"
              onClick={() => copyLink(it.href, it.key)}
              className="w-7 h-7 rounded-full border border-[#EDE8DF] bg-white text-[10px] text-[#64748B] hover:border-[#D4AF37] hover:text-[#0F172A] cursor-pointer"
              aria-label={`کپی لینک ${it.label}`}
              title="کپی لینک"
            >
              {copied === it.key ? "✓" : "کپی"}
            </button>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[#64748B] text-center">
        برای باز شدن، روی آیکون بزنید · برای کپی، دکمه کنارش
      </p>
    </div>
  );
}