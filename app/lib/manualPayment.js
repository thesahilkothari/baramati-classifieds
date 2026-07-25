export const MANUAL_UPI_CONFIG = {
  provider: "MANUAL_UPI",
  vpa: "skepl1@icici",
  payeeName: "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED",
  displayPayeeName: "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED",
  qrImagePath: "/upi-qr.jpeg",
  supportEmail: "connect@myclassifieds.in",
  supportWhatsApp: "+91 9673931166"
};

export const MANUAL_PAYMENT_PLANS = [
  {
    key: "FREE_7_DAYS",
    name: "Free Classified",
    price: 0,
    amountInPaise: 0,
    duration: "7 days",
    description: "Submit a simple classified for admin approval."
  },
  {
    key: "PAID_7_DAYS",
    name: "Paid Classified",
    price: 199,
    amountInPaise: 19900,
    duration: "7 days",
    description:
      "Paid listing visibility for 7 days after admin approval and payment verification."
  },
  {
    key: "PREMIUM_30_DAYS",
    name: "Premium Classified",
    price: 499,
    amountInPaise: 49900,
    duration: "30 days",
    description:
      "Premium listing visibility for 30 days after admin approval and payment verification."
  }
];

export const FEATURED_ADDON_PLAN = {
  key: "FEATURED_10_DAYS",
  name: "Featured Add-on",
  price: 299,
  amountInPaise: 29900,
  duration: "10 days",
  description:
    "Optional highlighted placement available only with paid or premium plans."
};

export function getManualPaymentPlan(planKey) {
  if (planKey === FEATURED_ADDON_PLAN.key) {
    return FEATURED_ADDON_PLAN;
  }

  return MANUAL_PAYMENT_PLANS.find((plan) => plan.key === planKey) || null;
}

export function calculatePostingTotal({ planKey, includeFeatured }) {
  const plan = getManualPaymentPlan(planKey);

  if (!plan) {
    return {
      amount: 0,
      amountInPaise: 0,
      planAmount: 0,
      featuredAmount: 0
    };
  }

  const canAddFeatured =
    includeFeatured === true &&
    ["PAID_7_DAYS", "PREMIUM_30_DAYS"].includes(planKey);

  const featuredAmount = canAddFeatured ? FEATURED_ADDON_PLAN.price : 0;
  const featuredAmountInPaise = canAddFeatured
    ? FEATURED_ADDON_PLAN.amountInPaise
    : 0;

  return {
    amount: plan.price + featuredAmount,
    amountInPaise: plan.amountInPaise + featuredAmountInPaise,
    planAmount: plan.price,
    featuredAmount
  };
}

export function formatManualAmount(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function createManualPaymentReference(adId, planKey) {
  const safeAdId = adId ? String(adId) : "AD";
  const safePlan = String(planKey || "PLAN").replace(/[^A-Z0-9_]/gi, "");
  const timestamp = Date.now();

  return `MC-${safeAdId}-${safePlan}-${timestamp}`;
}

export function buildUpiPaymentUrl({ amount, adId, planKey, referenceNumber }) {
  const note = [
    "My Classifieds",
    adId ? `Ad ${adId}` : "",
    planKey || "",
    referenceNumber || ""
  ]
    .filter(Boolean)
    .join(" ");

  const params = new URLSearchParams({
    pa: MANUAL_UPI_CONFIG.vpa,
    pn: MANUAL_UPI_CONFIG.payeeName,
    am: String(amount),
    cu: "INR",
    tn: note.slice(0, 80)
  });

  return `upi://pay?${params.toString()}`;
}
