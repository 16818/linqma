"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { Download } from "lucide-react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  instagram?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  rubika?: string | null;
  eitaa?: string | null;
  bale?: string | null;
}

export function SettingsClient({ business }: { business: Business }) {
  const [name, setName] = useState(business.name ?? "");
  const [slug, setSlug] = useState(business.slug ?? "");
  const [description, setDescription] = useState(business.description || "");
  const [address, setAddress] = useState(business.address || "");
  const [phone, setPhone] = useState(business.phone || "");
  const [workingHours, setWorkingHours] = useState(business.working_hours || "");
  const [logoUrl, setLogoUrl] = useState<string | null>(business.logo_url ?? null);
  const [coverUrl, setCoverUrl] = useState<string | null>(business.cover_url ?? null);
  const [isPublished, setIsPublished] = useState(business.is_published);

  const [instagram, setInstagram] = useState(business.instagram || "");
  const [telegram, setTelegram] = useState(business.telegram || "");
  const [whatsapp, setWhatsapp] = useState(business.whatsapp || "");
  const [rubika, setRubika] = useState(business.rubika || "");
  const [eitaa, setEitaa] = useState(business.eitaa || "");
  const [bale, setBale] = useState(business.bale || "");

  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
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
        instagram: instagram.trim() || null,
        telegram: telegram.trim() || null,
        whatsapp: whatsapp.trim() || null,
        rubika: rubika.trim() || null,
        eitaa: eitaa.trim() || null,
        bale: bale.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", business.id);

    if (error) {
      toast.error("خطا در ذخیره تغییرات");
      setLoading(false);
      return;
    }

    toast.success("تغییرات ذخیره شد");
    setLoading(false);
    router.refresh();
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.download = `qr-${slug}.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success("QR Code دانلود شد");
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
            <label className="text-sm font-medium text-navy/70">
              نام کسب و کار
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              آدرس اختصاصی
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-sm text-navy/50 whitespace-nowrap">
                linqma.ir/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                  )
                }
                className="flex-1 h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              توضیح کوتاه
            </label>
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
            <label className="text-sm font-medium text-navy/70">
              شماره تماس
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              ساعات کاری
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="08:00-23:00"
              dir="ltr"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 text-left"
            />
            <p className="mt-1 text-xs text-navy/40">
              فرمت: 08:00-23:00 (ساعت شروع و پایان)
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-medium text-navy">وضعیت انتشار</p>
              <p className="text-sm text-navy/50">
                صفحه عمومی قابل مشاهده باشد
              </p>
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`w-12 h-7 rounded-full transition-colors cursor-pointer ${
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
          <CardTitle>شبکه‌های اجتماعی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-navy/50 leading-relaxed">
            می‌توانید نام کاربری (مثل <span dir="ltr">@username</span>) یا لینک
            کامل را وارد کنید. فقط موارد پر شده در ویترین نمایش داده می‌شوند.
          </p>

          <div>
            <label className="text-sm font-medium text-navy/70">
              اینستاگرام
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@username یا لینک کامل"
              dir="ltr"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 text-left"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              تلگرام
            </label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@username یا لینک کامل"
              dir="ltr"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 text-left"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              واتساپ
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="09123456789"
              dir="ltr"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 text-left"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              روبیکا
            </label>
            <input
              type="text"
              value={rubika}
              onChange={(e) => setRubika(e.target.value)}
              placeholder="نام کاربری یا لینک کامل"
              dir="ltr"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 text-left"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              ایتا
            </label>
            <input
              type="text"
              value={eitaa}
              onChange={(e) => setEitaa(e.target.value)}
              placeholder="نام کاربری یا لینک کامل"
              dir="ltr"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 text-left"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy/70">
              بله
            </label>
            <input
              type="text"
              value={bale}
              onChange={(e) => setBale(e.target.value)}
              placeholder="نام کاربری یا لینک کامل"
              dir="ltr"
              className="mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 text-left"
            />
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
          <p className="text-sm text-navy/60 text-center break-all">
            {businessUrl}
          </p>
          <Button variant="gold" className="gap-2" onClick={downloadQR}>
            <Download className="w-4 h-4" />
            دانلود QR Code
          </Button>
        </CardContent>
      </Card>

      <Button
        variant="primary"
        className="w-full"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </div>
  );
}