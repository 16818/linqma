import { Suspense } from "react";
import { AdminModeBannerAuto } from "@/components/dashboard/AdminModeBannerAuto";

export const dynamic = "force-dynamic";

export default function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AdminModeBannerAuto />
      </Suspense>
      {children}
    </>
  );
}