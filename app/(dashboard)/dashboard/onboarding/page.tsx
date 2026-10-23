import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/dashboard-context";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const ctx = await getDashboardContext();

  if (!ctx?.user) redirect("/login");
  if (ctx.access === "cashier") redirect("/dashboard/pos");
  if (ctx.access === "owner" && ctx.business) redirect("/dashboard");

  return <OnboardingForm />;
}