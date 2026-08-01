export const BUSINESS_ANNUAL_PLAN_KEY = "BUSINESS_ANNUAL_365_DAYS";

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
  BUSINESS_ANNUAL_365_DAYS: {
    key: BUSINESS_ANNUAL_PLAN_KEY,
    label: "Business Annual Classified - 1 Year",
    amount: 5000,
    oldAmount: 6000,
    durationDays: 365,
    featuredDurationDays: 365,
    adType: "FEATURED",
    purpose: "BUSINESS_ANNUAL_AD",
    basePlan: "BUSINESS_ANNUAL",
    includesFeatured: true,
    defaultFeatured: true
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
  if (basePlan === "BUSINESS_ANNUAL") return BUSINESS_ANNUAL_PLAN_KEY;
  return null;
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function getDefaultExpiryForAdType(adType, fromDate = new Date()) {
  if (adType === "FEATURED") return addDays(fromDate, 365);
  if (adType === "PREMIUM") return addDays(fromDate, 30);
  return addDays(fromDate, 7);
}

export function getDefaultFeaturedUntilForAd(ad, fromDate = new Date()) {
  if (!ad?.isFeatured) return null;
  if (ad.adType === "FEATURED") return addDays(fromDate, 365);
  return addDays(fromDate, 10);
}
