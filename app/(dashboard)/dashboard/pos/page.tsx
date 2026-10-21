import { requireBusinessWithOrders } from "@/lib/plan-guards";
import { UpgradeGate } from "@/components/dashboard/UpgradeGate";
import POSPage from "./PosClient";
import { getPlanConfig } from "@/lib/plans";

export default async function PosPage() {
  const { business } = await requireBusinessWithOrders();
  const plan = getPlanConfig(business.plan);

  if (!plan.hasPos) {
    return (
      <UpgradeGate
        title="صندوق در پکیج پایه فعال نیست"
        description="با ارتقا به حرفه‌ای یا ویژه، جستجو و تأیید سفارش در صندوق در دسترس می‌شود."
      />
    );
  }

  return <POSPage />;
}