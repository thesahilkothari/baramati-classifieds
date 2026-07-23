export const AD_PLANS = {
  FREE_7_DAYS: {
    key: "FREE_7_DAYS",
    label: "Free Ad - 7 Days",
    amount: 0,
    durationDays: 7,
    adType: "FREE",
    purpose: "FREE_AD"
  },
  PAID_7_DAYS: {
    key: "PAID_7_DAYS",
    label: "Paid Ad - 7 Days",
    amount: 199,
    durationDays: 7,
    adType: "PAID",
    purpose: "PAID_AD"
  },
  PREMIUM_30_DAYS: {
    key: "PREMIUM_30_DAYS",
    label: "Premium Ad - 30 Days",
    amount: 499,
    durationDays: 30,
    adType: "PREMIUM",
    purpose: "PREMIUM_AD"
  },
  FEATURED_10_DAYS: {
    key: "FEATURED_10_DAYS",
    label: "Featured Add-on - 10 Days",
    amount: 299,
    durationDays: 10,
    adType: null,
    purpose: "FEATURED_ADDON"
  }
};

export function getPlan(planKey) {
  return AD_PLANS[planKey] || null;
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function getDefaultExpiryForAdType(adType, fromDate = new Date()) {
  if (adType === "PREMIUM") {
    return addDays(fromDate, 30);
  }

  return addDays(fromDate, 7);
}
