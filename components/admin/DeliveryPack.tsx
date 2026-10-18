"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Printer, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";

interface DeliveryPackProps {
  email: string;
  password: string;
  slug?: string;
  businessName?: string;
  siteUrl?: string;
}

export function DeliveryPack({
  email,
  password,
  slug,
  businessName,
  siteUrl,
}: DeliveryPackProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedAll, setCopiedAll] = useState(false);

  const site = siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const storefrontUrl = slug ? `${site}/business/${slug}` : "";
  const loginUrl = `${site}/login`;

  useEffect(() => {
    if (storefrontUrl) {
      QRCode.toDataURL(storefrontUrl, {
        margin: 1,
        width: 256,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Error", err));
    }
  }, [storefrontUrl]);

  const copyText = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    toast.success(label ? `${label} کپی شد` : "کپی شد");
  };

  const copyAll = () => {
    const text = [
      storefrontUrl ? `ویترین: ${storefrontUrl}` : null,
      `ورود: ${loginUrl}`,
      `ایمیل: ${email}`,
      `رمز: ${password}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast.success("همه اطلاعات کپی شد");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EDE8DF] overflow-hidden shadow-sm max-w-lg mx-auto print:border-0 print:shadow-none" dir="rtl">
      {/* هدر */}
      <div className="bg-[#0B1B33] text-white p-5 text-center print:bg-white print:text-black print:border-b print:border-gray-200">
        <h2 className="font-bold text-lg">بسته تحویل لینکیوما</h2>
        {businessName && (
          <p className="text-sm text-white/70 mt-1 print:text-gray-500">
            {businessName}
          </p>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* ویترین و QR */}
        {slug && (
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#FAF7F2] rounded-2xl print:bg-white print:border print:border-gray-200">
            {qrDataUrl && (
              <div className="bg-white p-2 rounded-xl border border-[#EDE8DF] shrink-0">
                <img src={qrDataUrl} alt="QR Code" className="w-24 h-24" />
              </div>
            )}
            <div className="flex-1 min-w-0 text-center sm:text-right">
              <p className="text-xs font-bold text-[#64748B] mb-1">لینک ویترین</p>
              <p className="font-mono text-sm text-[#0F172A] break-all mb-2" dir="ltr">
                {storefrontUrl}
              </p>
              <div className="flex gap-2 justify-center sm:justify-start print:hidden">
                <button
                  onClick={() => copyText(storefrontUrl, "لینک ویترین")}
                  className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  کپی لینک
                </button>
                <a
                  href={storefrontUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#64748B] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  مشاهده
                </a>
              </div>
            </div>
          </div>
        )}

        {/* اطلاعات ورود */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#64748B] mb-1">لینک ورود</p>
              <p className="font-mono text-sm text-[#0F172A] break-all" dir="ltr">
                {loginUrl}
              </p>
            </div>
            <button
              onClick={() => copyText(loginUrl, "لینک ورود")}
              className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#0F172A] cursor-pointer shrink-0 print:hidden"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#64748B] mb-1">ایمیل</p>
              <p className="font-mono text-sm text-[#0F172A] break-all" dir="ltr">
                {email}
              </p>
            </div>
            <button
              onClick={() => copyText(email, "ایمیل")}
              className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#0F172A] cursor-pointer shrink-0 print:hidden"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#64748B] mb-1">رمز عبور</p>
              <p className="font-mono text-sm text-[#0F172A] break-all" dir="ltr">
                {password}
              </p>
            </div>
            <button
              onClick={() => copyText(password, "رمز عبور")}
              className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#0F172A] cursor-pointer shrink-0 print:hidden"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 print:bg-white print:border-gray-300">
          <p className="text-xs text-amber-800 leading-relaxed print:text-black">
            ⚠️ این رمز دیگر نمایش داده نمی‌شود. الان کپی یا چاپ کنید.
          </p>
        </div>

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-2 print:hidden">
          <button
            onClick={copyAll}
            className="flex-1 h-11 rounded-2xl bg-[#D4AF37] text-white font-bold cursor-pointer hover:bg-[#C4A034] transition flex items-center justify-center gap-2"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4" />
                کپی شد
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                کپی همه
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 h-11 rounded-2xl bg-[#0F172A] text-white font-bold cursor-pointer hover:bg-[#1E293B] transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            چاپ
          </button>
        </div>
      </div>
    </div>
  );
}