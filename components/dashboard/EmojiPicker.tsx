"use client";

import { useEffect, useRef, useState } from "react";
import { EMOJI_GROUPS } from "./emoji-data";

type Props = {
  value: string;
  onChange: (emoji: string) => void;
};

function emojiToTwemojiUrl(emoji: string): string {
  const codePoints = [...emoji]
    .map((char) => char.codePointAt(0)?.toString(16))
    .filter(Boolean);
  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${codePoints.join(
    "-"
  )}.svg`;
}

function EmojiImage({
  emoji,
  size = 24,
}: {
  emoji: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span style={{ fontSize: size * 0.8, lineHeight: 1 }}>{emoji}</span>
    );
  }

  return (
    <img
      src={emojiToTwemojiUrl(emoji)}
      alt={emoji}
      width={size}
      height={size}
      className="pointer-events-none select-none"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function EmojiPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string>(EMOJI_GROUPS[0].id);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const group =
    EMOJI_GROUPS.find((g) => g.id === activeGroup) ?? EMOJI_GROUPS[0];

  return (
    <div ref={rootRef} className="relative">
      <label className="text-sm font-medium text-navy/70">
        آیکون دسته‌بندی
      </label>

      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-11 min-w-[3rem] px-3 rounded-2xl border border-[#EDE8DF] bg-white flex items-center justify-center hover:border-[#D4AF37] transition cursor-pointer"
          aria-label="انتخاب ایموجی"
        >
          {value ? <EmojiImage emoji={value} size={24} /> : <span className="text-xl text-[#94A3B8]">➕</span>}
        </button>

        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-[#64748B] hover:text-red-500 cursor-pointer"
          >
            پاک کردن
          </button>
        ) : (
          <span className="text-xs text-[#64748B]">
            یک ایموجی انتخاب کنید
          </span>
        )}
      </div>

      {open && (
        <div
          className="absolute z-[60] mt-2 w-[min(100vw-2rem,20rem)] rounded-3xl border border-[#EDE8DF] bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] p-3"
          role="dialog"
          aria-label="انتخابگر ایموجی"
        >
          {/* تب دسته‌ها */}
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {EMOJI_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveGroup(g.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  activeGroup === g.id
                    ? "bg-[#0F172A] text-white"
                    : "bg-[#F7F6F3] text-[#64748B] hover:bg-[#EFE9DF]"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* گرید ایموجی */}
          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto pt-1">
            {group.emojis.map((emoji, idx) => (
              <button
                key={`${emoji}-${idx}`}
                type="button"
                onClick={() => {
                  onChange(emoji);
                  setOpen(false);
                }}
                className="h-10 rounded-xl hover:bg-[#F7F6F3] flex items-center justify-center transition cursor-pointer"
                title={emoji}
              >
                <EmojiImage emoji={emoji} size={24} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}