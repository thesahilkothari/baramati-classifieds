import crypto from "crypto";
import { applyPaidPlanToAd } from "./paymentApply";
import { normalizePaymentReference } from "./paymentReference";
import {
  buildPaymentVerifiedEmail,
  getUserEmailFromAd,
  safeSendUserEventEmail
} from "./userEventEmails";

export const BANK_UPI_PROVIDER = "BANK_UPI";
export const BANK_CREDIT_EVENT_TYPE = "BANK_CREDIT";

export function isBankWebhookEnabled() {
  return Boolean(process.env.BANK_WEBHOOK_SECRET);
}

export function getPaymentAutomationMode() {
  return isBankWebhookEnabled()
    ? "BANK_WEBHOOK_READY_WITH_UTR_RECONCILIATION"
    : "DECENTRALISED_UTR_VALIDATION";
}

export function verifyBankWebhookSignature({ rawBody, signature }) {
  const secret = process.env.BANK_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const cleanSignature = String(signature || "").replace(/^sha256=/i, "").trim();

  try {
    const expectedBuffer = Buffer.from(expected, "hex");
    const actualBuffer = Buffer.from(cleanSignature, "hex");

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

function paiseFromPayloadAmount(payload) {
  if (payload.amountInPaise !== undefined && payload.amountInPaise !== null) {
    const value = Number(payload.amountInPaise);
    return Number.isFinite(value) ? Math.round(value) : 0;
  }

  const rawAmount =
    payload.amount ??
    payload.creditAmount ??
    payload.transactionAmount ??
    payload.data?.amount ??
    payload.data?.creditAmount;

  const value = Number(rawAmount);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export function extractBankCreditPayload(payload) {
  const source = payload?.data || payload || {};
  const reference = normalizePaymentReference(
    source.utr ||
      source.upiReference ||
      source.transactionReference ||
      source.bankReference ||
      source.rrn ||
      source.refNo ||
      payload?.utr ||
      payload?.upiReference ||
      payload?.transactionReference ||
      payload?.bankReference ||
      payload?.rrn ||
      payload?.refNo
  );

  const eventId = String(
    payload?.eventId ||
      payload?.id ||
      source.eventId ||
      source.id ||
      (reference ? `${BANK_UPI_PROVIDER}-${reference}` : `${BANK_UPI_PROVIDER}-${Date.now()}`)
  ).slice(0, 191);

  return {
    eventId,
    eventType: String(payload?.eventType || payload?.type || BANK_CREDIT_EVENT_TYPE).slice(0, 80),
    reference,
    amountInPaise: paiseFromPayloadAmount(payload),
    currency: String(source.currency || payload?.currency || "INR").toUpperCase().slice(0, 12),
    payerName: String(source.payerName || payload?.payerName || "").slice(0, 191),
    payerVpa: String(source.payerVpa || source.vpa || payload?.payerVpa || "").slice(0, 191),
    paidAt: source.paidAt || source.transactionTime || payload?.paidAt || payload?.transactionTime || null
  };
}

function paymentIncludesFeatured(payment) {
  return String(payment?.purpose || "").includes("FEATURED_ADDON");
}

async function markPaymentPaidInsideTransaction(tx, payment, { verifiedBy, note, webhookEventId }) {
  const verifiedPayment = await tx.payment.update({
    where: { id: payment.id },
    data: {
      status: "PAID",
      failureReason: null,
      webhookEventId: webhookEventId || payment.webhookEventId,
      manualVerifiedBy: verifiedBy,
      manualVerificationNote: note,
      verifiedAt: new Date()
    },
    include: {
      ad: {
        include: {
          user: true,
          category: true,
          city: true
        }
      }
    }
  });

  await applyPaidPlanToAd(tx, {
    adId: payment.adId,
    planKey: payment.plan
  });

  if (paymentIncludesFeatured(payment)) {
    await applyPaidPlanToAd(tx, {
      adId: payment.adId,
      planKey: "FEATURED_10_DAYS"
    });
  }

  return verifiedPayment;
}

export async function autoApplyMatchedPayment(prisma, { reference, amountInPaise, eventId, note }) {
  const normalizedReference = normalizePaymentReference(reference);

  if (!normalizedReference || !amountInPaise) {
    return {
      matched: false,
      reason: "Missing bank reference or amount."
    };
  }

  const payment = await prisma.payment.findFirst({
    where: {
      provider: "MANUAL_UPI",
      manualTransactionRef: normalizedReference,
      amount: amountInPaise,
      status: "PENDING_MANUAL_VERIFICATION"
    },
    include: {
      ad: {
        include: {
          user: true,
          category: true,
          city: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (!payment) {
    return {
      matched: false,
      reason: "No matching pending payment found for this UTR and amount."
    };
  }

  let verifiedPayment = null;

  await prisma.$transaction(async (tx) => {
    verifiedPayment = await markPaymentPaidInsideTransaction(tx, payment, {
      verifiedBy: BANK_UPI_PROVIDER,
      note: note || "Automatically verified through bank webhook / UTR reconciliation.",
      webhookEventId: eventId
    });

    if (eventId) {
      await tx.paymentWebhookEvent.updateMany({
        where: {
          eventId
        },
        data: {
          paymentRecordId: payment.id,
          processed: true,
          processedAt: new Date(),
          error: null
        }
      });
    }
  });

  const updatedAd = await prisma.ad.findUnique({
    where: { id: payment.adId },
    include: {
      user: true,
      category: true,
      city: true
    }
  });

  await safeSendUserEventEmail({
    to: getUserEmailFromAd(updatedAd || verifiedPayment.ad),
    email: buildPaymentVerifiedEmail({
      ad: updatedAd || verifiedPayment.ad,
      payment: verifiedPayment
    })
  });

  return {
    matched: true,
    paymentId: payment.id,
    adId: payment.adId,
    status: "PAID"
  };
}

export async function tryAutoReconcilePaymentFromStoredBankEvents(prisma, paymentId) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment || payment.status !== "PENDING_MANUAL_VERIFICATION") {
    return {
      matched: false,
      reason: "Payment is not pending reconciliation."
    };
  }

  const reference = normalizePaymentReference(payment.manualTransactionRef);

  if (!reference) {
    return {
      matched: false,
      reason: "Payment does not have a usable UTR."
    };
  }

  const events = await prisma.paymentWebhookEvent.findMany({
    where: {
      provider: BANK_UPI_PROVIDER,
      processed: false
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 100
  });

  for (const event of events) {
    const extracted = extractBankCreditPayload(event.payload || {});
    const eventReference = normalizePaymentReference(extracted.reference);

    if (eventReference === reference && extracted.amountInPaise === payment.amount) {
      return autoApplyMatchedPayment(prisma, {
        reference,
        amountInPaise: payment.amount,
        eventId: event.eventId,
        note: "Automatically reconciled after user submitted matching UTR."
      });
    }
  }

  return {
    matched: false,
    reason: "No stored bank credit event matched this UTR yet."
  };
}
