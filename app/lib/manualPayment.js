import {
  calculatePlanTotal,
  canPlanUseFeatured,
  FEATURED_FEATURES,
  formatPlanAmount,
  getPlanFeatureList,
  getPlanFeatures
} from "./planFeatures";
import { buildCheckoutReference } from "./paymentReference";

export const MANUAL_UPI_CONFIG = {
  provider: "MANUAL_UPI",
  vpa: "skepl1@icici",
  payeeName: "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED",
  displayPayeeName: "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED",
  qrImagePath: "/upi-qr.jpeg",
  supportEmail: "connect@myclassifieds.in",
  supportWhatsApp: "+91 9673931166"
};

export const MANUAL_PAYMENT_PLANS = getPlanFeatureList();

export const FEATURED_ADDON_PLAN = FEATURED_FEATURES;

export function getManualPaymentPlan(planKey) {
  if (planKey === FEATURED_ADDON_PLAN.key) {
    return FEATURED_ADDON_PLAN;
  }

  return getPlanFeatures(planKey);
}

export function calculatePostingTotal({ planKey, includeFeatured }) {
  return calculatePlanTotal({ planKey, includeFeatured });
}

export function formatManualAmount(amount) {
  return formatPlanAmount(amount);
}

export function createManualPaymentReference(adId, planKey) {
  const safeAdId = adId ? String(adId) : "AD";
  const safePlan = String(planKey || "PLAN").replace(/[^A-Z0-9_]/gi, "");
  const timestamp = Date.now();

  return `MC-${safeAdId}-${safePlan}-${timestamp}`;
}

export function formatUpiAmount(amount) {
  const value = Number(amount || 0);
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

export function buildUpiPaymentUrl({ amount, adId, planKey, referenceNumber }) {
  const checkoutReference =
    referenceNumber || buildCheckoutReference({ adId, planKey });

  const note = [
    "My Classifieds",
    checkoutReference,
    adId ? `Ad ${adId}` : "",
    planKey || ""
  ]
    .filter(Boolean)
    .join(" ")
    .slice(0, 80);

  const params = new URLSearchParams({
    pa: MANUAL_UPI_CONFIG.vpa,
    pn: MANUAL_UPI_CONFIG.payeeName,
    am: formatUpiAmount(amount),
    cu: "INR",
    tr: checkoutReference,
    tn: note
  });

  return `upi://pay?${params.toString()}`;
}

export { buildCheckoutReference, canPlanUseFeatured };
