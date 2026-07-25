export const PLAN_FEATURES = {
  FREE_7_DAYS: {
    key: "FREE_7_DAYS",
    publicName: "Free Classified",
    price: 0,
    amountInPaise: 0,
    durationDays: 7,
    durationLabel: "7 days",
    approvalTime: "2-3 working days",
    titleMaxLength: 60,
    descriptionMaxLength: 450,
    badge: "Basic",
    rankWeight: 10,
    features: [
      "Basic classified listing",
      "Visible for 7 days after approval",
      "Headline up to 60 characters",
      "Description up to 450 characters",
      "Approval generally within 2-3 working days",
      "Can be renewed or upgraded later"
    ],
    limitations: [
      "Lower internal ranking than paid plans",
      "No featured label",
      "No priority moderation"
    ]
  },
  PAID_7_DAYS: {
    key: "PAID_7_DAYS",
    publicName: "Paid Classified",
    price: 199,
    amountInPaise: 19900,
    durationDays: 7,
    durationLabel: "7 days",
    approvalTime: "1 working day",
    titleMaxLength: 90,
    descriptionMaxLength: 900,
    badge: "Popular",
    rankWeight: 30,
    features: [
      "Better internal visibility than free listings",
      "Visible for 7 days after approval",
      "Headline up to 90 characters",
      "Description up to 900 characters",
      "Approval generally within 1 working day",
      "Eligible for Featured add-on",
      "Renewal and upgrade reminders"
    ],
    limitations: [
      "Does not verify or endorse the advertiser",
      "Publication remains subject to moderation"
    ]
  },
  PREMIUM_30_DAYS: {
    key: "PREMIUM_30_DAYS",
    publicName: "Premium Classified",
    price: 499,
    amountInPaise: 49900,
    durationDays: 30,
    durationLabel: "30 days",
    approvalTime: "1 working day",
    titleMaxLength: 120,
    descriptionMaxLength: 1500,
    badge: "Best Value",
    rankWeight: 50,
    features: [
      "Higher internal visibility than paid and free listings",
      "Visible for 30 days after approval",
      "Headline up to 120 characters",
      "Description up to 1500 characters",
      "Approval generally within 1 working day",
      "Eligible for Featured add-on",
      "Better suited for property, jobs, business and urgent ads",
      "Renewal and upgrade reminders"
    ],
    limitations: [
      "Does not verify or endorse the advertiser",
      "Publication remains subject to moderation"
    ]
  }
};

export const FEATURED_FEATURES = {
  key: "FEATURED_10_DAYS",
  publicName: "Featured Add-on",
  price: 299,
  amountInPaise: 29900,
  durationDays: 10,
  durationLabel: "10 days",
  approvalTime: "1 working day",
  rankWeight: 100,
  features: [
    "Shown at the top among eligible listings",
    "Publicly marked as Featured",
    "Available only with Paid or Premium plans",
    "Valid for 10 days after approval/payment verification"
  ]
};

export const PLAN_ORDER = ["FREE_7_DAYS", "PAID_7_DAYS", "PREMIUM_30_DAYS"];

export function getPlanFeatures(planKey) {
  return PLAN_FEATURES[planKey] || PLAN_FEATURES.FREE_7_DAYS;
}

export function getPlanFeatureList() {
  return PLAN_ORDER.map((key) => PLAN_FEATURES[key]);
}

export function getPlanCharacterLimits(planKey) {
  const plan = getPlanFeatures(planKey);

  return {
    titleMaxLength: plan.titleMaxLength,
    descriptionMaxLength: plan.descriptionMaxLength
  };
}

export function canPlanUseFeatured(planKey) {
  return ["PAID_7_DAYS", "PREMIUM_30_DAYS"].includes(planKey);
}

export function calculatePlanTotal({ planKey, includeFeatured }) {
  const plan = getPlanFeatures(planKey);
  const shouldAddFeatured = includeFeatured === true && canPlanUseFeatured(planKey);

  return {
    amount: plan.price + (shouldAddFeatured ? FEATURED_FEATURES.price : 0),
    amountInPaise:
      plan.amountInPaise +
      (shouldAddFeatured ? FEATURED_FEATURES.amountInPaise : 0),
    planAmount: plan.price,
    featuredAmount: shouldAddFeatured ? FEATURED_FEATURES.price : 0,
    selectedPlan: plan,
    includeFeatured: shouldAddFeatured
  };
}

export function formatPlanAmount(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}
