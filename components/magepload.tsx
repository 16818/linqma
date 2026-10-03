"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "images",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("حجم فایل نباید بیشتر از ۲ مگابایت باشد");
      return;
    }

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert("خطا در آپلود: " + error.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(fileName);

    onChange(publicUrl);
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-navy/70">تصویر محصول</label>

      {value ? (
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#EDE8DF]">
          <img src={value} alt="محصول" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow"
          >
            <X className="w-4 h-4 text-navy" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-[#EDE8DF]",
            "flex flex-col items-center justify-center gap-2 text-navy/50",
            "hover:border-gold hover:text-gold transition-colors",
            uploading && "opacity-60"
          )}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8" />
              <span className="text-sm">کلیک برای انتخاب تصویر</span>
              <span className="text-xs">حداکثر ۲ مگابایت</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}