export const PLAN_FEATURES = {
  FREE_7_DAYS: {
    key: "FREE_7_DAYS",
    publicName: "Free Classified",
    publicNameMr: "Free Classified",
    price: 0,
    amountInPaise: 0,
    durationDays: 7,
    durationLabel: "7 days",
    durationLabelMr: "७ दिवस",
    approvalTime: "2-3 working days",
    approvalTimeMr: "२-३ कामकाजाचे दिवस",
    titleMaxLength: 60,
    descriptionMaxLength: 450,
    badge: "Basic",
    badgeMr: "Basic",
    rankWeight: 10,
    features: [
      "Basic classified listing",
      "Visible for 7 days after approval",
      "Headline up to 60 characters",
      "Description up to 450 characters",
      "Approval generally within 2-3 working days",
      "Can be renewed or upgraded later"
    ],
    featuresMr: [
      "Basic classified listing",
      "Approval नंतर ७ दिवस visible",
      "Heading ६० characters पर्यंत",
      "Description ४५० characters पर्यंत",
      "Approval साधारणपणे २-३ कामकाजाच्या दिवसांत",
      "नंतर renew किंवा upgrade करता येईल"
    ],
    limitations: [
      "Lower internal ranking than paid plans",
      "No featured label",
      "No priority moderation"
    ],
    limitationsMr: [
      "Paid plans पेक्षा कमी internal ranking",
      "Featured label नाही",
      "Priority moderation नाही"
    ]
  },
  PAID_7_DAYS: {
    key: "PAID_7_DAYS",
    publicName: "Paid Classified",
    publicNameMr: "Paid Classified",
    price: 199,
    amountInPaise: 19900,
    durationDays: 7,
    durationLabel: "7 days",
    durationLabelMr: "७ दिवस",
    approvalTime: "1 working day",
    approvalTimeMr: "१ कामकाजाचा दिवस",
    titleMaxLength: 90,
    descriptionMaxLength: 900,
    badge: "Popular",
    badgeMr: "Popular",
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
    featuresMr: [
      "Free listing पेक्षा चांगली internal visibility",
      "Approval नंतर ७ दिवस visible",
      "Heading ९० characters पर्यंत",
      "Description ९०० characters पर्यंत",
      "Approval साधारणपणे १ कामकाजाच्या दिवसात",
      "Featured add-on साठी eligible",
      "Renewal आणि upgrade reminders"
    ],
    limitations: [
      "Does not verify or endorse the advertiser",
      "Publication remains subject to moderation"
    ],
    limitationsMr: [
      "Advertiser ची verification किंवा endorsement नाही",
      "Publication moderation अधीन राहील"
    ]
  },
  PREMIUM_30_DAYS: {
    key: "PREMIUM_30_DAYS",
    publicName: "Premium Classified",
    publicNameMr: "Premium Classified",
    price: 499,
    amountInPaise: 49900,
    durationDays: 30,
    durationLabel: "30 days",
    durationLabelMr: "३० दिवस",
    approvalTime: "1 working day",
    approvalTimeMr: "१ कामकाजाचा दिवस",
    titleMaxLength: 120,
    descriptionMaxLength: 1500,
    badge: "Best Value",
    badgeMr: "Best Value",
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
    featuresMr: [
      "Paid आणि Free listing पेक्षा जास्त internal visibility",
      "Approval नंतर ३० दिवस visible",
      "Heading १२० characters पर्यंत",
      "Description १५०० characters पर्यंत",
      "Approval साधारणपणे १ कामकाजाच्या दिवसात",
      "Featured add-on साठी eligible",
      "Property, jobs, business आणि urgent ads साठी योग्य",
      "Renewal आणि upgrade reminders"
    ],
    limitations: [
      "Does not verify or endorse the advertiser",
      "Publication remains subject to moderation"
    ],
    limitationsMr: [
      "Advertiser ची verification किंवा endorsement नाही",
      "Publication moderation अधीन राहील"
    ]
  }
};

export const FEATURED_FEATURES = {
  key: "FEATURED_10_DAYS",
  publicName: "Featured Add-on",
  publicNameMr: "Featured Add-on",
  price: 299,
  amountInPaise: 29900,
  durationDays: 10,
  durationLabel: "10 days",
  durationLabelMr: "१० दिवस",
  approvalTime: "1 working day",
  approvalTimeMr: "१ कामकाजाचा दिवस",
  rankWeight: 100,
  features: [
    "Shown at the top among eligible listings",
    "Publicly marked as Featured",
    "Available only with Paid or Premium plans",
    "Valid for 10 days after approval/payment verification"
  ],
  featuresMr: [
    "Eligible listings मध्ये वरती दाखवले जाते",
    "Publicly Featured म्हणून दाखवले जाते",
    "फक्त Paid किंवा Premium plans सोबत उपलब्ध",
    "Approval/payment verification नंतर १० दिवस valid"
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

export function getLocalizedPlanName(plan, language = "en") {
  return language === "mr" ? plan.publicNameMr || plan.publicName : plan.publicName;
}

export function getLocalizedPlanDuration(plan, language = "en") {
  return language === "mr" ? plan.durationLabelMr || plan.durationLabel : plan.durationLabel;
}

export function getLocalizedApprovalTime(plan, language = "en") {
  return language === "mr" ? plan.approvalTimeMr || plan.approvalTime : plan.approvalTime;
}

export function getLocalizedPlanBadge(plan, language = "en") {
  return language === "mr" ? plan.badgeMr || plan.badge : plan.badge;
}

export function getLocalizedPlanFeatures(plan, language = "en") {
  return language === "mr" ? plan.featuresMr || plan.features : plan.features;
}

export function getLocalizedPlanLimitations(plan, language = "en") {
  return language === "mr"
    ? plan.limitationsMr || plan.limitations || []
    : plan.limitations || [];
}
