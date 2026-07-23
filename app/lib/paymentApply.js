import { addDays, getPlan } from "./adPlans";

export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
  keySecret
}) {
  const crypto = require("crypto");

  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured.");
  }

  const body = `${orderId}|${paymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

export function verifyRazorpayWebhookSignature({
  rawBody,
  signature,
  webhookSecret
}) {
  const crypto = require("crypto");

  if (!webhookSecret) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured.");
  }

  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
}

export async function applyPaidPlanToAd(tx, { adId, planKey }) {
  const plan = getPlan(planKey);

  if (!plan) {
    throw new Error("Invalid payment plan.");
  }

  const ad = await tx.ad.findUnique({
    where: { id: adId }
  });

  if (!ad) {
    throw new Error("Ad not found.");
  }

  const now = new Date();
  const updateData = {};

  if (plan.key === "PAID_7_DAYS") {
    updateData.adType = "PAID";

    if (ad.status === "ACTIVE") {
      updateData.expiresAt = addDays(now, 7);
    }
  }

  if (plan.key === "PREMIUM_30_DAYS") {
    updateData.adType = "PREMIUM";

    if (ad.status === "ACTIVE") {
      updateData.expiresAt = addDays(now, 30);
    }
  }

  if (plan.key === "FEATURED_10_DAYS") {
    if (ad.adType === "FREE") {
      throw new Error(
        "Featured add-on can be applied only to paid or premium ads."
      );
    }

    updateData.isFeatured = true;

    if (ad.status === "ACTIVE") {
      updateData.featuredUntil = addDays(now, 10);
    }
  }

  if (Object.keys(updateData).length === 0) {
    return {
      plan,
      ad,
      updatedAd: ad,
      updateData
    };
  }

  const updatedAd = await tx.ad.update({
    where: { id: adId },
    data: updateData
  });

  return {
    plan,
    ad,
    updatedAd,
    updateData
  };
}
