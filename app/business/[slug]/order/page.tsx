"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trash2, Minus, Plus } from "lucide-react";
import QRCode from "qrcode";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderCode, setOrderCode] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`linqma-cart-${slug}`);
    if (saved) setCart(JSON.parse(saved));
  }, [slug]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(`linqma-cart-${slug}`, JSON.stringify(cart));
    }
  }, [cart, slug]);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleShowToCashier = async () => {
    const code =
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      Math.floor(Math.random() * 90 + 10).toString();
    setOrderCode(code);

    const orderData = {
      code,
      items: cart.map((i) => ({
        name: i.name,
        qty: i.quantity,
        price: i.price,
      })),
      total: totalPrice,
      time: new Date().toLocaleTimeString("fa-IR"),
    };

    const url = await QRCode.toDataURL(JSON.stringify(orderData), {
      width: 280,
      margin: 2,
      color: { dark: "#0F172A", light: "#FFFFFF" },
    });
    setQrDataUrl(url);
    setShowFinal(true);
  };

  if (showFinal) {
    return (
      <div className="min-h-screen bg-cream font-vazir flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div>
            <p className="text-sm text-navy/60 mb-2">کد سفارش</p>
            <h1 className="text-5xl font-black text-navy tracking-wider">
              #{orderCode}
            </h1>
          </div>

          {qrDataUrl && (
            <div className="bg-white p-4 rounded-3xl shadow-soft inline-block">
              <img src={qrDataUrl} alt="QR سفارش" className="w-64 h-64" />
            </div>
          )}

          <p className="text-sm text-navy/70">
            این صفحه را به صندوقدار نشان دهید
            <br />
            یا QR را اسکن کند
          </p>

          <Card>
            <CardContent className="p-4 space-y-2 text-right">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString("fa-IR")}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#EDE8DF] pt-2 flex justify-between font-bold text-gold">
                <span>جمع کل</span>
                <span>{totalPrice.toLocaleString("fa-IR")} تومان</span>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              localStorage.removeItem(`linqma-cart-${slug}`);
              router.push(`/business/${slug}`);
            }}
          >
            بازگشت به منو
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-vazir">
      <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur-md border-b border-[#EDE8DF] px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowRight className="w-6 h-6 text-navy" />
        </button>
        <h1 className="text-lg font-bold text-navy">سفارش من</h1>
      </div>

      <div className="p-4 space-y-4 pb-32">
        {cart.length === 0 ? (
          <div className="text-center py-20 text-navy/50">
            سبد سفارش خالی است
          </div>
        ) : (
          cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-navy">{item.name}</h3>
                  <p className="text-sm text-gold font-medium mt-1">
                    {item.price.toLocaleString("fa-IR")} تومان
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDE8DF] p-4">
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-navy/70">{totalItems} قلم</span>
              <span className="text-xl font-bold text-navy">
                {totalPrice.toLocaleString("fa-IR")} تومان
              </span>
            </div>
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleShowToCashier}
            >
              نمایش سفارش به صندوق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}