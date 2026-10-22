"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { Download, ChevronDown } from "lucide-react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getPlanConfig } from "@/lib/plans";
import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm";

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
  plan?: string;
  instagram?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  rubika?: string | null;
  eitaa?: string | null;
  bale?: string | null;
}

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-3xl border border-[#EDE8DF] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-right font-bold text-[#0F172A] hover:bg-[#FAF7F2] transition cursor-pointer"
      >
        {title}
        <ChevronDown
          className={`w-5 h-5 text-[#0F172A]/50 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="p-5 border-t border-[#EDE8DF] space-y-4">{children}</div>}
    </div>
  );
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

  const planConfig = useMemo(() => getPlanConfig(business.plan), [business.plan]);
  const socialLimit = planConfig.features.socialLinksLimit;

  const allSocials = [
    { key: "instagram", label: "اینستاگرام", value: instagram, setter: setInstagram, placeholder: "@username یا لینک کامل" },
    { key: "telegram", label: "تلگرام", value: telegram, setter: setTelegram, placeholder: "@username یا لینک کامل" },
    { key: "whatsapp", label: "واتساپ", value: whatsapp, setter: setWhatsapp, placeholder: "09123456789" },
    { key: "rubika", label: "روبیکا", value: rubika, setter: setRubika, placeholder: "نام کاربری یا لینک کامل" },
    { key: "eitaa", label: "ایتا", value: eitaa, setter: setEitaa, placeholder: "نام کاربری یا لینک کامل" },
    { key: "bale", label: "بله", value: bale, setter: setBale, placeholder: "نام کاربری یا لینک کامل" },
  ];

  const selectedCount = allSocials.filter((s) => s.value.trim() !== "").length;
  const isAtLimit = selectedCount >= socialLimit;

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
    if (selectedCount > socialLimit) {
      toast.error(
        `در پکیج ${planConfig.label}، فقط ${socialLimit} شبکه اجتماعی مجاز است.`
      );
      return;
    }

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

      <AccordionSection title="اطلاعات اصلی" defaultOpen>
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
      </AccordionSection>

      <AccordionSection
        title={`شبکه‌های اجتماعی (حداکثر ${socialLimit} مورد)`}
      >
        <p className="text-xs text-navy/50 leading-relaxed">
          می‌توانید حداکثر {socialLimit} شبکه اجتماعی را پر کنید. بقیه فیلدها
          غیرفعال می‌شوند. فقط موارد پر شده در ویترین نمایش داده می‌شوند.
        </p>

        {allSocials.map((social) => {
          const isDisabled = isAtLimit && social.value.trim() === "";
          return (
            <div key={social.key}>
              <label className="text-sm font-medium text-navy/70">
                {social.label}
              </label>
              <input
                type="text"
                value={social.value}
                onChange={(e) => social.setter(e.target.value)}
                placeholder={social.placeholder}
                dir="ltr"
                disabled={isDisabled}
                className={`mt-1.5 w-full h-11 px-4 rounded-2xl border border-[#EDE8DF] focus:outline-none focus:ring-2 focus:ring-gold/50 text-left ${
                  isDisabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""
                }`}
              />
            </div>
          );
        })}

        {socialLimit < allSocials.length && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            ⚠️ در پکیج {planConfig.label}، فقط {socialLimit} شبکه اجتماعی قابل
            ویرایش است. برای افزودن شبکه‌های بیشتر، پکیج خود را ارتقا دهید.
          </div>
        )}
      </AccordionSection>

      <AccordionSection title="لوگو و کاور">
        <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="logos" />
        <ImageUpload value={coverUrl} onChange={setCoverUrl} folder="covers" />
      </AccordionSection>

      <AccordionSection title="QR Code کسب و کار">
        <div className="flex flex-col items-center gap-4">
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
        </div>
      </AccordionSection>

      <AccordionSection title="امنیت حساب">
        <p className="mb-4 text-sm text-navy/60">
          رمز اولیه‌ای که از پشتیبانی گرفتید را اینجا عوض کنید.
        </p>
        <ChangePasswordForm />
      </AccordionSection>

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