import { addDays, getPlan } from "./adPlans";

export function verifyRazorpayPaymentSignature({ orderId, paymentId, signature, keySecret }) {
  const crypto = require("crypto");
  if (!keySecret) throw new Error("RAZORPAY_KEY_SECRET is not configured.");
  const expectedSignature = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  return expectedSignature === signature;
}

export function verifyRazorpayWebhookSignature({ rawBody, signature, webhookSecret }) {
  const crypto = require("crypto");
  if (!webhookSecret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured.");
  if (!signature) return false;
  const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return expectedSignature === signature;
}

export async function applyPaidPlanToAd(tx, { adId, planKey }) {
  const plan = getPlan(planKey);
  if (!plan) throw new Error("Invalid payment plan.");

  const ad = await tx.ad.findUnique({ where: { id: adId } });
  if (!ad) throw new Error("Ad not found.");

  const now = new Date();
  const updateData = {};
  const shouldApplyPaid = plan.key === "PAID_7_DAYS" || plan.key === "PAID_7_DAYS_FEATURED_10_DAYS";
  const shouldApplyPremium = plan.key === "PREMIUM_30_DAYS" || plan.key === "PREMIUM_30_DAYS_FEATURED_10_DAYS";
  const shouldApplyFeatured = plan.key === "FEATURED_10_DAYS" || plan.key === "PAID_7_DAYS_FEATURED_10_DAYS" || plan.key === "PREMIUM_30_DAYS_FEATURED_10_DAYS";

  if (shouldApplyPaid) {
    updateData.adType = "PAID";
    updateData.expiryNoticeSentAt = null;
    updateData.renewalNoticeSentAt = null;
    updateData.followUpNoticeSentAt = null;
    if (ad.status === "ACTIVE") updateData.expiresAt = addDays(now, 7);
  }

  if (shouldApplyPremium) {
    updateData.adType = "PREMIUM";
    updateData.expiryNoticeSentAt = null;
    updateData.renewalNoticeSentAt = null;
    updateData.followUpNoticeSentAt = null;
    if (ad.status === "ACTIVE") updateData.expiresAt = addDays(now, 30);
  }

  if (shouldApplyFeatured) {
    if (plan.key === "FEATURED_10_DAYS" && ad.adType === "FREE") {
      throw new Error("Featured add-on can be applied only to paid or premium ads.");
    }
    updateData.isFeatured = true;
    if (ad.status === "ACTIVE") updateData.featuredUntil = addDays(now, 10);
  }

  if (Object.keys(updateData).length === 0) return { plan, ad, updatedAd: ad, updateData };

  const updatedAd = await tx.ad.update({ where: { id: adId }, data: updateData });
  return { plan, ad, updatedAd, updateData };
}
