"use client";

import { useEffect, useRef } from "react";

interface BrandedQRCodeProps {
  value: string;
  logoSrc?: string | null;
  size?: number;
  className?: string;
}

export function BrandedQRCode({
  value,
  logoSrc = "/brand/lqm-qr-logo.png",
  size = 280,
  className,
}: BrandedQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function drawQR() {
      if (!canvasRef.current) return;
      const QRCode = (await import("qrcode")).default;
      const canvas = canvasRef.current;

      // ۱. رسم QR پایه با سطح خطای H
      await QRCode.toCanvas(canvas, value, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: size,
        color: { dark: "#0F172A", light: "#FFFFFF" },
      });

      // ۲. اگر لوگو وجود داشت، آن را در مرکز رسم کن
      if (!logoSrc || !isMounted) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = logoSrc;

      img.onload = () => {
        if (!isMounted) return;

        const logoSize = canvas.width * 0.2; // ۲۰٪ عرض QR
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;
        const pad = logoSize * 0.12;

        // پس‌زمینه سفید گرد زیر لوگو
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.roundRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, 8);
        ctx.fill();

        // رسم لوگو
        ctx.drawImage(img, x, y, logoSize, logoSize);
      };
    }

    drawQR();

    return () => {
      isMounted = false;
    };
  }, [value, logoSrc, size]);

  return <canvas ref={canvasRef} className={className} />;
}