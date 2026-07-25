export const AD_PLANS = {
  FREE_7_DAYS: {
    key: "FREE_7_DAYS",
    label: "Free Classified - 7 Days",
    amount: 0,
    durationDays: 7,
    adType: "FREE",
    purpose: "FREE_AD",
    basePlan: "FREE",
    includesFeatured: false
  },
  PAID_7_DAYS: {
    key: "PAID_7_DAYS",
    label: "Paid Classified - 7 Days",
    amount: 199,
    durationDays: 7,
    adType: "PAID",
    purpose: "PAID_AD",
    basePlan: "PAID",
    includesFeatured: false
  },
  PREMIUM_30_DAYS: {
    key: "PREMIUM_30_DAYS",
    label: "Premium Classified - 30 Days",
    amount: 499,
    durationDays: 30,
    adType: "PREMIUM",
    purpose: "PREMIUM_AD",
    basePlan: "PREMIUM",
    includesFeatured: false
  },
  FEATURED_10_DAYS: {
    key: "FEATURED_10_DAYS",
    label: "Featured Add-on - 10 Days",
    amount: 299,
    durationDays: 10,
    adType: null,
    purpose: "FEATURED_ADDON",
    basePlan: null,
    includesFeatured: true
  },
  PAID_7_DAYS_FEATURED_10_DAYS: {
    key: "PAID_7_DAYS_FEATURED_10_DAYS",
    label: "Paid Classified + Featured Add-on",
    amount: 498,
    durationDays: 7,
    featuredDurationDays: 10,
    adType: "PAID",
    purpose: "PAID_AD_FEATURED_ADDON",
    basePlan: "PAID",
    includesFeatured: true
  },
  PREMIUM_30_DAYS_FEATURED_10_DAYS: {
    key: "PREMIUM_30_DAYS_FEATURED_10_DAYS",
    label: "Premium Classified + Featured Add-on",
    amount: 798,
    durationDays: 30,
    featuredDurationDays: 10,
    adType: "PREMIUM",
    purpose: "PREMIUM_AD_FEATURED_ADDON",
    basePlan: "PREMIUM",
    includesFeatured: true
  }
};

export function getPlan(planKey) {
  return AD_PLANS[planKey] || null;
}

export function getPostAdPlanKey(basePlan, includeFeatured) {
  if (basePlan === "FREE") return "FREE_7_DAYS";
  if (basePlan === "PAID") return includeFeatured ? "PAID_7_DAYS_FEATURED_10_DAYS" : "PAID_7_DAYS";
  if (basePlan === "PREMIUM") return includeFeatured ? "PREMIUM_30_DAYS_FEATURED_10_DAYS" : "PREMIUM_30_DAYS";
  return null;
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function getDefaultExpiryForAdType(adType, fromDate = new Date()) {
  if (adType === "PREMIUM") return addDays(fromDate, 30);
  return addDays(fromDate, 7);
}
