"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Search, Check, X, Clock, User, Phone, FileText } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

interface Order {
  id: string;
  short_code: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_note?: string | null;
  table_number?: string | null;
}

export default function POSPage() {
  const supabase = createClient();
  const [code, setCode] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editTable, setEditTable] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);

  const searchOrder = async () => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      toast.error("کد سفارش را وارد کنید");
      return;
    }

    setLoading(true);
    setNotFound(false);
    setOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("short_code", cleanCode)
      .maybeSingle();

    setLoading(false);

    if (error) {
      toast.error("خطا در جستجو");
      return;
    }

    if (!data) {
      setNotFound(true);
      return;
    }

    setOrder(data);
    setEditName(data.customer_name || "");
    setEditPhone(data.customer_phone || "");
    setEditNote(data.customer_note || "");
    setEditTable(data.table_number || "");
  };

  const saveCustomerInfo = async () => {
    if (!order) return;
    setSavingInfo(true);

    const { error } = await supabase
      .from("orders")
      .update({
        customer_name: editName.trim() || null,
        customer_phone: editPhone.trim() || null,
        customer_note: editNote.trim() || null,
        table_number: editTable.trim() || null,
      })
      .eq("id", order.id);

    setSavingInfo(false);

    if (error) {
      toast.error("خطا در ذخیره اطلاعات");
      return;
    }

    toast.success("اطلاعات مشتری ذخیره شد");
    setOrder({
      ...order,
      customer_name: editName.trim() || null,
      customer_phone: editPhone.trim() || null,
      customer_note: editNote.trim() || null,
      table_number: editTable.trim() || null,
    });
  };

  const confirmOrder = async () => {
    if (!order) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", order.id);

    if (error) {
      toast.error("خطا در تأیید سفارش");
      return;
    }

    toast.success("سفارش تأیید شد");
    setOrder({ ...order, status: "confirmed" });
  };

  const reset = () => {
    setCode("");
    setOrder(null);
    setNotFound(false);
    setEditName("");
    setEditPhone("");
    setEditNote("");
    setEditTable("");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">صندوق</h1>
        <p className="text-navy/60 text-sm mt-1">
          کد سفارش مشتری را وارد کنید
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EDE8DF] p-6 shadow-sm">
        <label className="text-sm font-medium text-navy/70">کد سفارش</label>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchOrder();
            }}
            maxLength={5}
            placeholder="مثلاً 2DV"
            className="flex-1 h-14 px-4 rounded-2xl border-2 border-[#EDE8DF] focus:outline-none focus:border-gold text-center text-2xl font-black tracking-widest"
            autoFocus
          />
          <button
            onClick={searchOrder}
            disabled={loading || !code.trim()}
            className="w-14 h-14 rounded-2xl bg-gold text-white flex items-center justify-center cursor-pointer hover:bg-gold-dark transition disabled:opacity-50"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-3xl mb-2">❌</p>
          <p className="font-bold text-red-700">سفارشی با این کد پیدا نشد</p>
          <p className="text-sm text-red-600 mt-1">
            کد را چک کنید و دوباره امتحان کنید
          </p>
          <button
            onClick={reset}
            className="mt-4 text-sm text-red-700 font-bold underline cursor-pointer"
          >
            پاک کردن
          </button>
        </div>
      )}

      {order && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#EDE8DF] overflow-hidden shadow-sm">
            <div className="p-5 bg-[#0F172A] text-white flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs text-white/60">کد سفارش</p>
                <p className="text-2xl font-black tracking-widest">
                  {order.short_code}
                </p>
              </div>
              {order.table_number && (
                <div className="text-center">
                  <p className="text-xs text-white/60">میز</p>
                  <p className="text-xl font-black">{order.table_number}</p>
                </div>
              )}
              <div className="text-left">
                <p className="text-xs text-white/60">وضعیت</p>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                    order.status === "confirmed"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {order.status === "confirmed" ? (
                    <>
                      <Check className="w-3 h-3" />
                      تأیید شده
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      در انتظار
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-sm font-bold text-navy/70 mb-2">
                اقلام سفارش
              </p>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 py-2 border-b border-[#EDE8DF] last:border-b-0"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F5F0E8] shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-navy/30">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-navy truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-navy/50">
                      {item.price.toLocaleString("fa-IR")} تومان ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="font-black text-sm text-navy shrink-0">
                    {(item.price * item.quantity).toLocaleString("fa-IR")}
                  </p>
                </div>
              ))}

              <div className="pt-3 flex items-center justify-between border-t-2 border-[#EDE8DF] mt-3">
                <span className="text-sm font-bold text-navy/70">جمع کل</span>
                <span className="font-black text-2xl text-gold">
                  {order.total.toLocaleString("fa-IR")}
                  <span className="text-xs mr-1">تومان</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-5 shadow-sm">
            <h3 className="font-bold text-sm text-navy mb-4">
              اطلاعات مشتری
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-navy/60 flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5" />
                  نام
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="نام مشتری"
                  className="w-full h-10 px-3 rounded-xl border border-[#EDE8DF] text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-navy/60 flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  تلفن
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) =>
                    setEditPhone(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  maxLength={11}
                  dir="ltr"
                  className="w-full h-10 px-3 rounded-xl border border-[#EDE8DF] text-sm focus:outline-none focus:border-gold text-left"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-navy/60 flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  یادداشت
                </label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="مثلاً بدون شکر"
                  className="w-full h-10 px-3 rounded-xl border border-[#EDE8DF] text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-navy/60 mb-1.5 block">
                  شماره میز
                </label>
                <input
                  type="text"
                  value={editTable}
                  onChange={(e) => setEditTable(e.target.value)}
                  placeholder="مثلاً ۵"
                  maxLength={3}
                  className="w-full h-10 px-3 rounded-xl border border-[#EDE8DF] text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <button
              onClick={saveCustomerInfo}
              disabled={savingInfo}
              className="mt-4 w-full h-10 rounded-xl bg-[#F5F0E8] text-navy font-bold text-sm cursor-pointer hover:bg-[#EFE9DF] transition disabled:opacity-60"
            >
              {savingInfo ? "در حال ذخیره..." : "ذخیره اطلاعات مشتری"}
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE8DF] p-5 shadow-sm flex gap-2">
            <button
              onClick={reset}
              className="flex-1 h-12 rounded-2xl bg-white border border-[#EDE8DF] text-navy font-bold cursor-pointer hover:bg-[#EFE9DF] transition flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              سفارش جدید
            </button>
            {order.status !== "confirmed" && (
              <button
                onClick={confirmOrder}
                className="flex-1 h-12 rounded-2xl bg-gold text-white font-bold cursor-pointer hover:bg-gold-dark transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                تأیید سفارش
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}