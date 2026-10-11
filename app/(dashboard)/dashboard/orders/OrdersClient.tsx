"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Search, Clock, Check, Package, User, Phone, FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";

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

export function OrdersClient({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed"
  >("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = q
        ? order.short_code.toLowerCase().includes(q) ||
          (order.customer_name && order.customer_name.toLowerCase().includes(q)) ||
          (order.customer_phone && order.customer_phone.includes(q))
        : true;
      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleDownload = () => {
    if (filteredOrders.length === 0) {
      toast.error("سفارشی برای دانلود وجود ندارد");
      return;
    }

    const headers = [
      "تاریخ",
      "کد سفارش",
      "نام مشتری",
      "تلفن",
      "یادداشت",
      "شماره میز",
      "اقلام",
      "مبلغ کل (تومان)",
      "وضعیت",
    ];

    const rows = filteredOrders.map((order) => {
      const date = new Date(order.created_at).toLocaleString("fa-IR");
      const items = order.items
        .map((item) => `${item.name} × ${item.quantity}`)
        .join(" | ");
      const status = order.status === "confirmed" ? "تأیید شده" : "در انتظار";
      return [
        date,
        order.short_code,
        order.customer_name || "",
        order.customer_phone || "",
        order.customer_note || "",
        order.table_number || "",
        items,
        order.total.toString(),
        status,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("فایل دانلود شد");
  };

  const totalRevenue = orders
    .filter((o) => o.status === "confirmed")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">سفارش‌ها</h1>
          <p className="text-navy/60 text-sm mt-1">
            {orders.length} سفارش ثبت شده
          </p>
        </div>
        {orders.length > 0 && (
          <Button variant="gold" className="gap-2" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            دانلود Excel
          </Button>
        )}
      </div>

      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-navy">{orders.length}</p>
              <p className="text-xs text-navy/60 mt-1">کل سفارش‌ها</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xl font-black text-gold">
                {totalRevenue.toLocaleString("fa-IR")}
              </p>
              <p className="text-xs text-navy/60 mt-1">فروش تأیید شده</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-navy">{pendingCount}</p>
              <p className="text-xs text-navy/60 mt-1">در انتظار</p>
            </CardContent>
          </Card>
        </div>
      )}

      {orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#EDE8DF] p-3 flex flex-wrap gap-2">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-navy/40 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی کد، نام یا تلفن..."
              className="w-full h-10 pr-9 pl-3 rounded-xl border border-[#EDE8DF] text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 h-10 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === "all"
                  ? "bg-navy text-white"
                  : "bg-[#F5F0E8] text-navy/70 hover:bg-[#EFE9DF]"
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 h-10 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === "pending"
                  ? "bg-navy text-white"
                  : "bg-[#F5F0E8] text-navy/70 hover:bg-[#EFE9DF]"
              }`}
            >
              در انتظار ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("confirmed")}
              className={`px-3 h-10 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === "confirmed"
                  ? "bg-navy text-white"
                  : "bg-[#F5F0E8] text-navy/70 hover:bg-[#EFE9DF]"
              }`}
            >
              تأیید شده ({confirmedCount})
            </button>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          icon="📋"
          title="هنوز سفارشی ثبت نشده"
          description="وقتی مشتری سفارشی ثبت کند، اینجا نمایش داده می‌شود"
        />
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-navy/50 text-sm">
          سفارشی با این فیلتر پیدا نشد
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-navy tracking-widest">
                      {order.short_code}
                    </span>
                    {order.table_number && (
                      <Badge className="text-[10px] bg-[#F5F0E8] text-navy">
                        میز {order.table_number}
                      </Badge>
                    )}
                    <Badge
                      variant={
                        order.status === "confirmed" ? "success" : "default"
                      }
                      className="text-[10px] flex items-center gap-1"
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
                    </Badge>
                  </div>
                  <span className="text-xs text-navy/50">
                    {new Date(order.created_at).toLocaleString("fa-IR")}
                  </span>
                </div>

                {(order.customer_name ||
                  order.customer_phone ||
                  order.customer_note) && (
                  <div className="mb-3 bg-[#FAF7F2] rounded-xl p-3 space-y-1.5">
                    {order.customer_name && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-3.5 h-3.5 text-navy/40" />
                        <span className="text-navy/80">
                          {order.customer_name}
                        </span>
                      </div>
                    )}
                    {order.customer_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-navy/40" />
                        <span className="text-navy/80" dir="ltr">
                          {order.customer_phone}
                        </span>
                      </div>
                    )}
                    {order.customer_note && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-3.5 h-3.5 text-navy/40" />
                        <span className="text-navy/80">
                          {order.customer_note}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5 mb-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-navy/40" />
                        <span className="text-navy/80">{item.name}</span>
                        <span className="text-navy/40 text-xs">
                          × {item.quantity}
                        </span>
                      </div>
                      <span className="text-navy/70 text-xs">
                        {(item.price * item.quantity).toLocaleString("fa-IR")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EDE8DF]">
                  <span className="text-xs text-navy/60">جمع کل</span>
                  <span className="font-black text-gold">
                    {order.total.toLocaleString("fa-IR")}
                    <span className="text-xs mr-1 font-normal text-navy/60">
                      تومان
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}