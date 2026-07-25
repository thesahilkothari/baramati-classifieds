import { getPlan, getPostAdPlanKey } from "./adPlans";

export const MANUAL_UPI_CONFIG = {
  provider: "MANUAL_UPI",
  vpa: "skepl1@icici",
  payeeName: "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED",
  displayPayeeName: "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED",
  qrImagePath: "/upi-qr.jpeg",
  supportEmail: "connect@myclassifieds.in",
  supportWhatsApp: "+91 9673931166"
};

export const POST_AD_BASE_PLANS = [
  { key: "FREE", name: "Free Classified", amount: 0, duration: "7 days", description: "Submit a simple classified for admin approval." },
  { key: "PAID", name: "Paid Classified", amount: 199, duration: "7 days", description: "Paid listing visibility after manual UPI payment verification." },
  { key: "PREMIUM", name: "Premium Classified", amount: 499, duration: "30 days", description: "Longer validity and higher internal ranking after payment verification." }
];

export const FEATURED_ADDON = {
  key: "FEATURED_10_DAYS",
  name: "Featured Add-on",
  amount: 299,
  duration: "10 days",
  description: "Optional highlighted display at the top, available with paid or premium plans."
};

export const MANUAL_PAYMENT_PLANS = [
  { key: "PAID_7_DAYS", name: "Paid Classified", price: 199, amountInPaise: 19900, duration: "7 days" },
  { key: "PAID_7_DAYS_FEATURED_10_DAYS", name: "Paid Classified + Featured", price: 498, amountInPaise: 49800, duration: "7 days + 10 days featured" },
  { key: "PREMIUM_30_DAYS", name: "Premium Classified", price: 499, amountInPaise: 49900, duration: "30 days" },
  { key: "PREMIUM_30_DAYS_FEATURED_10_DAYS", name: "Premium Classified + Featured", price: 798, amountInPaise: 79800, duration: "30 days + 10 days featured" },
  { key: "FEATURED_10_DAYS", name: "Featured Add-on", price: 299, amountInPaise: 29900, duration: "10 days" }
];

export function getManualPaymentPlan(planKey) {
  return MANUAL_PAYMENT_PLANS.find((plan) => plan.key === planKey) || null;
}

export function getPostAdSelection(basePlan, includeFeatured) {
  const planKey = getPostAdPlanKey(basePlan, includeFeatured);
  const plan = getPlan(planKey);
  if (!plan) return null;
  return {
    planKey: plan.key,
    label: plan.label,
    amount: plan.amount,
    amountInPaise: plan.amount * 100,
    includesFeatured: plan.includesFeatured,
    basePlan: plan.basePlan
  };
}

export function formatManualAmount(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function createManualPaymentReference(adId, planKey) {
  const safeAdId = adId ? String(adId) : "AD";
  const safePlan = String(planKey || "PLAN").replace(/[^A-Z0-9_]/gi, "");
  return `MC-${safeAdId}-${safePlan}-${Date.now()}`;
}

export function buildUpiPaymentUrl({ amount, adId, planKey, referenceNumber }) {
  const note = ["My Classifieds", adId ? `Ad ${adId}` : "", planKey || "", referenceNumber || ""]
    .filter(Boolean)
    .join(" ");
  const params = new URLSearchParams({ pa: MANUAL_UPI_CONFIG.vpa, pn: MANUAL_UPI_CONFIG.payeeName, am: String(amount), cu: "INR", tn: note.slice(0, 80) });
  return `upi://pay?${params.toString()}`;
}
