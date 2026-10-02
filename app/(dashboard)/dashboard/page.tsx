import { Card, CardContent } from "@/components/ui/card";
import { Package, Tags, Eye, QrCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-navy">سلام، خوش آمدید 👋</h1>
        <p className="text-navy/60 mt-1">از اینجا کسب‌وکار خود را مدیریت کنید</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex flex-col items-center text-center gap-2">
            <Package className="w-8 h-8 text-gold" />
            <span className="text-2xl font-bold text-navy">۰</span>
            <span className="text-sm text-navy/60">محصول</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex flex-col items-center text-center gap-2">
            <Tags className="w-8 h-8 text-gold" />
            <span className="text-2xl font-bold text-navy">۰</span>
            <span className="text-sm text-navy/60">دسته‌بندی</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex flex-col items-center text-center gap-2">
            <Eye className="w-8 h-8 text-gold" />
            <span className="text-2xl font-bold text-navy">—</span>
            <span className="text-sm text-navy/60">بازدید</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex flex-col items-center text-center gap-2">
            <QrCode className="w-8 h-8 text-gold" />
            <span className="text-sm text-navy/60 mt-2">QR Code</span>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/products">
          <Button variant="gold">مدیریت محصولات</Button>
        </Link>
        <Link href="/dashboard/categories">
          <Button variant="outline">دسته‌بندی‌ها</Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button variant="secondary">تنظیمات و QR</Button>
        </Link>
      </div>
    </div>
  );
}