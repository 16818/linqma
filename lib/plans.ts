export const PLANS = {
  basic: {
    label: "ویترین (پایه)",
    priceToman: 9900000,
    productLimit: 15,
    categoryLimit: 8,
    isPopular: false,
    orderRetentionDays: 0,
    hasOrders: false, // <--- جدید
    hasPos: false,    // <--- جدید
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
  },
  pro: {
    label: "عملیات (حرفه‌ای)",
    priceToman: 18900000,
    productLimit: 50,
    categoryLimit: 20,
    isPopular: true,
    orderRetentionDays: 10,
    hasOrders: true,  // <--- جدید
    hasPos: true,     // <--- جدید
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
  },
  premium: {
    label: "برند (ویژه)",
    priceToman: 28900000,
    productLimit: 100,
    categoryLimit: 50,
    isPopular: false,
    orderRetentionDays: 30,
    hasOrders: true,  // <--- جدید
    hasPos: true,     // <--- جدید
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