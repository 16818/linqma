"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

export function PricingQR({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !url) return;

    QRCode.toCanvas(canvas, url, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 280,
      color: { dark: "#0F172A", light: "#FFFFFF" },
    })
      .then(() => setReady(true))
      .catch(console.error);
  }, [url]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "linqma-pricing-qr.png";
    a.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        className="rounded-2xl border border-[#EDE8DF] bg-white"
      />
      <p className="max-w-xs break-all text-center text-xs text-navy/50">
        {url}
      </p>
      <button
        type="button"
        onClick={download}
        disabled={!ready}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer hover:bg-[#1E293B] transition"
      >
        <Download className="h-4 w-4" />
        دانلود QR صفحه قیمت
      </button>
    </div>
  );
}