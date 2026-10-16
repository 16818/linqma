"use client";

import { useEffect, useRef, useState } from "react";
import { EMOJI_GROUPS, type EmojiGroup } from "./emoji-data";

type Props = {
  value: string;
  onChange: (emoji: string) => void;
};

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

  const group: EmojiGroup =
    EMOJI_GROUPS.find((g: EmojiGroup) => g.id === activeGroup) ??
    EMOJI_GROUPS[0];

  return (
    <div ref={rootRef} className="relative">
      <label className="text-sm font-medium text-navy/70">
        آیکون دسته‌بندی
      </label>

      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-11 min-w-[3rem] px-3 rounded-2xl border border-[#EDE8DF] bg-white text-2xl flex items-center justify-center hover:border-[#D4AF37] transition cursor-pointer"
          aria-label="انتخاب ایموجی"
        >
          {value || "➕"}
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
          className="absolute z-[60] mt-2 w-[min(100%-0px,20rem)] max-w-[calc(100vw-2rem)] rounded-3xl border border-[#EDE8DF] bg-white shadow-lg p-3"
          role="dialog"
          aria-label="انتخابگر ایموجی"
        >
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {EMOJI_GROUPS.map((g: EmojiGroup) => (
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

          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto pt-1">
            {group.emojis.map((emoji: string, idx: number) => (
              <button
                key={`${emoji}-${idx}`}
                type="button"
                onClick={() => {
                  onChange(emoji);
                  setOpen(false);
                }}
                className="h-10 rounded-xl text-xl hover:bg-[#F7F6F3] flex items-center justify-center transition cursor-pointer"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}