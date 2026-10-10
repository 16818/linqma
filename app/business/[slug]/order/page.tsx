"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2, Check } from "lucide-react";
import QRCode from "qrcode";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function OrderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderCode, setOrderCode] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    const saved = localStorage.getItem(`linqma-cart-${slug}`);
    if (saved) setCart(JSON.parse(saved));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    localStorage.setItem(`linqma-cart-${slug}`, JSON.stringify(cart));
  }, [cart, slug]);

  const increase = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrease = (id: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (item.quantity <= 1) {
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const clearCart = () => {
    if (!confirm("آیا مطمئن هستید؟ کل سبد پاک می‌شود.")) return;
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const submitOrder = async () => {
    if (cart.length === 0) return;

    const code = Math.random().toString(36).substring(2, 5).toUpperCase();
    setOrderCode(code);

    const text = `LINQMA|${code}|${slug}|${totalPrice}`;
    const dataUrl = await QRCode.toDataURL(text, {
      width: 260,
      margin: 1,
      color: { dark: "#0F172A", light: "#FFFFFF" },
    });
    setQrDataUrl(dataUrl);
  };

  if (orderCode) {
    return (
      <div
        className="min-h-screen bg-[#FAF7F2] font-[Vazirmatn] flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="bg-white rounded-[2rem] border border-[#EDE8DF] p-6 sm:p-8 max-w-md w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-[#D4AF37]" strokeWidth={3} />
            </div>

            <h1 className="text-lg font-bold text-[#0F172A]">
              سفارش شما ثبت شد
            </h1>

            <p className="text-xs text-[#64748B] mt-1">
              این صفحه را به صندوق نشان دهید
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center">
            {qrDataUrl && (
              <div className="bg-white rounded-3xl p-3 border border-[#EDE8DF] shadow-sm">
                <img
                  src={qrDataUrl}
                  alt="QR سفارش"
                  className="w-52 h-52 rounded-2xl"
                />
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-[#64748B]">کد سفارش:</span>
              <span className="font-black text-3xl tracking-[0.3em] text-[#0F172A]">
                {orderCode}
              </span>
            </div>
          </div>

          <div className="mt-6 bg-[#FAF7F2] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748B]">تعداد اقلام</span>
              <span className="font-bold text-[#0F172A]">{totalItems}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#EDE8DF]">
              <span className="text-sm text-[#64748B]">جمع کل</span>
              <span className="font-black text-2xl text-[#D4AF37]">
                {totalPrice.toLocaleString("fa-IR")}
                <span className="text-xs mr-1">تومان</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setCart([]);
              localStorage.removeItem(`linqma-cart-${slug}`);
              router.push(`/business/${slug}`);
            }}
            className="mt-6 w-full h-12 rounded-2xl bg-[#0F172A] text-white font-bold cursor-pointer hover:bg-[#1E293B] transition"
          >
            بازگشت به منو
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div
        className="min-h-screen bg-[#FAF7F2] font-[Vazirmatn] flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h1 className="text-lg font-bold text-[#0F172A] mb-2">
            سبد خرید خالی است
          </h1>
          <p className="text-sm text-[#64748B] mb-6">
            هنوز محصولی اضافه نکرده‌اید
          </p>
          <button
            type="button"
            onClick={() => router.push(`/business/${slug}`)}
            className="h-11 px-6 rounded-xl bg-[#0F172A] text-white font-bold cursor-pointer"
          >
            بازگشت به منو
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-[Vazirmatn] pb-32" dir="rtl">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#EDE8DF]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push(`/business/${slug}`)}
            className="p-2 -mr-2 cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-[#0F172A]" />
          </button>
          <h1 className="font-bold text-[#0F172A]">سبد خرید</h1>
          <button
            type="button"
            onClick={clearCart}
            className="p-2 -ml-2 cursor-pointer"
          >
            <Trash2 className="w-5 h-5 text-[#64748B] hover:text-red-500" />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 border-b border-[#EDE8DF] last:border-b-0"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F0E8] shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8B7355]/50">
                    —
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0F172A] truncate">
                  {item.name}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decrease(item.id)}
                    className="w-7 h-7 rounded-lg border border-[#EDE8DF] text-sm font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increase(item.id)}
                    className="w-7 h-7 rounded-lg border border-[#EDE8DF] text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-left shrink-0">
                <p className="font-black text-sm text-[#0F172A]">
                  {(item.price * item.quantity).toLocaleString("fa-IR")}
                </p>
                <p className="text-[10px] text-[#8B7355]">تومان</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDE8DF] p-4 z-30">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#64748B]">
              {totalItems} آیتم
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-black text-lg text-[#0F172A]">
                {totalPrice.toLocaleString("fa-IR")}
              </span>
              <span className="text-xs text-[#8B7355]">تومان</span>
            </div>
          </div>

          <button
            type="button"
            onClick={submitOrder}
            className="w-full h-12 rounded-2xl bg-[#0F172A] text-white font-bold cursor-pointer hover:bg-[#1E293B] transition"
          >
            ثبت سفارش
          </button>
        </div>
      </div>
    </div>
  );
}