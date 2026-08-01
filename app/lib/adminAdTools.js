import { addDays, BUSINESS_ANNUAL_PLAN_KEY, getPlan } from "./adPlans";

export const ADMIN_OVERRIDE_PROVIDER = "ADMIN_OVERRIDE";
export const ADMIN_OVERRIDE_STATUS = "ADMIN_OVERRIDE";

export const ADMIN_MANAGEABLE_PLAN_KEYS = [
  "FREE_7_DAYS",
  "PAID_7_DAYS",
  "PREMIUM_30_DAYS",
  "FEATURED_10_DAYS",
  BUSINESS_ANNUAL_PLAN_KEY
];

export function slugifyAdTitle(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createUniqueAdSlug(title, db) {
  const baseSlug = slugifyAdTitle(title) || `classified-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (await db.ad.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

export function cleanAdminText(value, maxLength = 191) {
  return String(value || "").trim().slice(0, maxLength);
}

export function cleanAdminLongText(value, maxLength = 5000) {
  return String(value || "").trim().slice(0, maxLength);
}

export function cleanAdminMobile(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

export function parsePositiveInt(value, fallback = null) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) return fallback;
  return number;
}

export function parseAdminDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const parsed = new Date(`${raw}T23:59:59.000+05:30`);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

export function buildAdminPlanUpdate({ existingAd, planKey, durationDays, expiryDate, featuredDays, featuredUntilDate }) {
  const plan = getPlan(planKey);
  if (!plan) return {};

  const now = new Date();
  const safeDurationDays = parsePositiveInt(durationDays, plan.durationDays || 7);
  const explicitExpiry = parseAdminDate(expiryDate);
  const computedExpiry = explicitExpiry || addDays(now, safeDurationDays);
  const explicitFeaturedUntil = parseAdminDate(featuredUntilDate);
  const safeFeaturedDays = parsePositiveInt(featuredDays, plan.featuredDurationDays || plan.durationDays || 10);
  const computedFeaturedUntil = explicitFeaturedUntil || computedExpiry || addDays(now, safeFeaturedDays);

  const updateData = {
    expiryNoticeSentAt: null,
    renewalNoticeSentAt: null,
    followUpNoticeSentAt: null
  };

  if (plan.key === "FREE_7_DAYS") {
    updateData.adType = "FREE";
    updateData.isFeatured = false;
    updateData.featuredUntil = null;
    updateData.expiresAt = computedExpiry;
  }

  if (plan.key === "PAID_7_DAYS") {
    updateData.adType = "PAID";
    updateData.isFeatured = false;
    updateData.featuredUntil = null;
    updateData.expiresAt = computedExpiry;
  }

  if (plan.key === "PREMIUM_30_DAYS") {
    updateData.adType = "PREMIUM";
    updateData.isFeatured = false;
    updateData.featuredUntil = null;
    updateData.expiresAt = computedExpiry;
  }

  if (plan.key === "FEATURED_10_DAYS") {
    updateData.adType = existingAd?.adType && existingAd.adType !== "FREE" ? existingAd.adType : "PAID";
    updateData.isFeatured = true;
    updateData.featuredUntil = computedFeaturedUntil;
    updateData.expiresAt = computedExpiry;
  }

  if (plan.key === BUSINESS_ANNUAL_PLAN_KEY) {
    updateData.adType = "FEATURED";
    updateData.isFeatured = true;
    updateData.expiresAt = computedExpiry;
    updateData.featuredUntil = computedExpiry;
  }

  return updateData;
}

export function getAdminPlanLabel(ad) {
  if (!ad) return "-";
  if (ad.adType === "FEATURED") return "Business Annual";
  if (ad.isFeatured) return `${ad.adType} + Featured`;
  return ad.adType;
}

export function isAdminOverrideAd(ad) {
  return Boolean(
    ad?.payments?.some(
      (payment) =>
        payment.provider === ADMIN_OVERRIDE_PROVIDER ||
        payment.status === ADMIN_OVERRIDE_STATUS ||
        String(payment.purpose || "").startsWith("ADMIN_OVERRIDE")
    )
  );
}

export function buildAdminOverridePaymentLog({
  adId,
  userId,
  planKey,
  status,
  action,
  expiresAt,
  featuredUntil,
  note
}) {
  const timestamp = Date.now();
  const safePlan = String(planKey || "NO_PLAN_CHANGE").replace(/[^A-Z0-9_]/gi, "").slice(0, 80);
  const safeStatus = String(status || "UNCHANGED").replace(/[^A-Z0-9_]/gi, "").slice(0, 40);
  const safeAction = String(action || "ADMIN_OVERRIDE").slice(0, 120);

  return {
    userId,
    adId,
    razorpayOrderId: `ADMIN-OVERRIDE-${adId}-${timestamp}`,
    amount: 0,
    currency: "INR",
    status: ADMIN_OVERRIDE_STATUS,
    plan: safePlan,
    purpose: `ADMIN_OVERRIDE:${safeAction}`,
    provider: ADMIN_OVERRIDE_PROVIDER,
    manualReferenceNumber: `ADMIN-OVERRIDE-${adId}-${timestamp}`,
    manualTransactionRef: `ADMIN-${safePlan}-${safeStatus}-${timestamp}`,
    manualPayerName: "ADMIN",
    manualPayerMobile: "",
    manualPaymentNote: [
      note || "Admin changed plan, status, featured placement or expiry.",
      expiresAt ? `Expiry: ${new Date(expiresAt).toISOString()}` : "",
      featuredUntil ? `Featured until: ${new Date(featuredUntil).toISOString()}` : ""
    ]
      .filter(Boolean)
      .join(" | "),
    manualSubmittedAt: new Date(),
    manualVerifiedBy: "ADMIN",
    manualVerificationNote: "Admin override log created automatically.",
    verifiedAt: new Date()
  };
}
