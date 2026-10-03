"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { Download } from "lucide-react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  working_hours?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  is_published: boolean;
}

export function SettingsClient({ business }: { business: Business }) {
  const [name, setName] = useState(business.name);
  const [slug, setSlug] = useState(business.slug);
  const [description, setDescription] = useState(business.description || "");
  const [address, setAddress] = useState(business.address || "");
  const [phone, setPhone] = useState(business.phone || "");
  const [workingHours, setWorkingHours] = useState(business.working_hours || "");
  const [logoUrl, setLogoUrl] = useState<string | null>(business.logo_url);
  const [coverUrl, setCoverUrl] = useState<string | null>(business.cover_url);
  const [isPublished, setIsPublished] = useState(business.is_published);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const businessUrl = `${siteUrl}/business/${slug}`;

  useEffect(() => {
    QRCode.toDataURL(businessUrl, {
      width: 300,
      margin: 2,
      color: { dark: "#0F172A", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, [businessUrl]);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("businesses")
      .update({
        name,
        slug,
        description: description || null,
        address: address || null,
        phone: phone || null,
        working_hours: workingHours || null,
        logo_url: logoUrl,
        cover_url: coverUrl,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq("id", business.id);

    if (error) {
      setMessage("خطا: " + error.message);
    } else {
      setMessage("تغییرات با موفقیت ذخیره شد");
      router.refresh();
    }
    setLoading(false);
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.download = `qr-${slug}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-navy">تنظیمات کسب و کار</h1>
        <p className="text-navy/60 text-sm mt-1">
          اطلاعات و QR Code خود را مدیریت کنید
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات اصلی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy/70">نام کسب و کار</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">آدرس اختصاصی</label>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-sm text-navy/50 whitespace-nowrap">linqma.ir/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                className="flex-1 h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">توضیح کوتاه</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">آدرس</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">شماره تماس</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">ساعات کاری</label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="8:00 - 23:00"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-medium text-navy">وضعیت انتشار</p>
              <p className="text-sm text-navy/50">صفحه عمومی قابل مشاهده باشد</p>
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`w-12 h-7 rounded-full transition-colors ${
                isPublished ? "bg-gold" : "bg-navy/20"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isPublished ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>لوگو و کاور</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="logos" />
          <ImageUpload value={coverUrl} onChange={setCoverUrl} folder="covers" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QR Code کسب و کار</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="w-56 h-56 rounded-2xl border border-[#EDE8DF]"
            />
          ) : (
            <div className="w-56 h-56 bg-cream-dark rounded-2xl animate-pulse" />
          )}
          <p className="text-sm text-navy/60 text-center break-all">{businessUrl}</p>
          <Button variant="gold" className="gap-2" onClick={downloadQR}>
            <Download className="w-4 h-4" />
            دانلود QR Code
          </Button>
        </CardContent>
      </Card>

      {message && (
        <p
          className={`text-center text-sm ${
            message.includes("خطا") ? "text-red-500" : "text-emerald-600"
          }`}
        >
          {message}
        </p>
      )}

      <Button variant="primary" className="w-full" onClick={handleSave} disabled={loading}>
        {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </div>
  );
}