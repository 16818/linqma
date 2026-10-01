import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream p-8 font-vazir">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-navy text-center">
          تست کامپوننت‌های LINQMA
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>کارت نمونه</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge>عادی</Badge>
              <Badge variant="gold">طلایی</Badge>
              <Badge variant="crown">تاج‌دار ویژه</Badge>
              <Badge variant="navy">سرمه‌ای</Badge>
              <Badge variant="success">فعال</Badge>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="primary">دکمه اصلی</Button>
              <Button variant="gold">دکمه طلایی</Button>
              <Button variant="outline">دکمه Outline</Button>
              <Button variant="secondary">دکمه ثانویه</Button>
              <Button variant="ghost">دکمه Ghost</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}