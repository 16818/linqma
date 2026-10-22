export type PlanId = "basic" | "pro" | "premium";

// شماره واتساپ پشتیبانی (بدون صفر و +) — این را با شماره واقعی جایگزین کنید
export const SUPPORT_WHATSAPP = "989123456789";

export const PLANS = {
  basic: {
    id: "basic" as const,
    label: "ویترین (پایه)",
    tagline: "ویترین دیجیتال تمیز",
    priceToman: 9900000,
    priceLabel: "۹٬۹۰۰٬۰۰۰",
    featured: false,
    ctaLabel: "سفارش پکیج پایه",
    productLimit: 15,
    categoryLimit: 8,
    hasOrders: false,
    hasPos: false,
    orderRetentionDays: 0,
    isPopular: false,
    features: {
      pos: false,
      discount: false,
      badges: false,
      featuredToday: false,
      searchInStorefront: false,
      excelExport: false,
      removeBranding: false,
      socialLinksLimit: 2,
      showAddress: false,
    },
    highlights: [
      "ویترین + لینک اختصاصی",
      "QR اختصاصی",
      "لوگو و کاور",
      "تا ۱۵ محصول و ۸ دسته",
      "۲ لینک شبکه اجتماعی",
    ],
  },
  pro: {
    id: "pro" as const,
    label: "عملیات (حرفه‌ای)",
    tagline: "منو + سفارش + صندوق",
    priceToman: 18900000,
    priceLabel: "۱۸٬۹۰۰٬۰۰۰",
    featured: true,
    ctaLabel: "انتخاب پیشنهاد ما",
    productLimit: 50,
    categoryLimit: 20,
    hasOrders: true,
    hasPos: true,
    orderRetentionDays: 10,
    isPopular: true,
    features: {
      pos: true,
      discount: true,
      badges: true,
      featuredToday: true,
      searchInStorefront: true,
      excelExport: true,
      removeBranding: false,
      socialLinksLimit: 6,
      showAddress: true,
    },
    highlights: [
      "همه امکانات پایه",
      "ثبت سفارش و QR صندوق",
      "صندوق (جستجو و تأیید)",
      "تخفیف، نشان و جستجو",
      "تا ۵۰ محصول · آرشیو ۱۰ روز",
    ],
  },
  premium: {
    id: "premium" as const,
    label: "برند (ویژه)",
    tagline: "ویترین بدون برند ما",
    priceToman: 28900000,
    priceLabel: "۲۸٬۹۰۰٬۰۰۰",
    featured: false,
    ctaLabel: "سفارش پکیج ویژه",
    productLimit: 100,
    categoryLimit: 50,
    hasOrders: true,
    hasPos: true,
    orderRetentionDays: 30,
    isPopular: false,
    features: {
      pos: true,
      discount: true,
      badges: true,
      featuredToday: true,
      searchInStorefront: true,
      excelExport: true,
      removeBranding: true,
      socialLinksLimit: 6,
      showAddress: true,
    },
    highlights: [
      "همه امکانات حرفه‌ای",
      "حذف برند LINQMA از فوتر",
      "تا ۱۰۰ محصول و ۵۰ دسته",
      "آرشیو سفارش ۳۰ روز",
      "مناسب برند و QR دائمی روی میز",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanConfig(plan: string | null | undefined) {
  if (plan && plan in PLANS) {
    return PLANS[plan as PlanKey];
  }
  return PLANS.basic;
}

export function getProductLimit(plan: string | null | undefined): number {
  return getPlanConfig(plan).productLimit;
}

export function getPlanLabel(plan: string | null | undefined): string {
  return getPlanConfig(plan).label;
}

export function whatsappOrderLink(planId: PlanId) {
  const plan = PLANS[planId];
  const text = `سلام، می‌خواهم پکیج «${plan.label}» LINQMA را سفارش دهم.`;
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(text)}`;
}