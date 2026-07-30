import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getPlan } from "../../../lib/adPlans";
import {
  calculatePostingTotal,
  createManualPaymentReference,
  MANUAL_UPI_CONFIG
} from "../../../lib/manualPayment";
import { canPlanUseFeatured } from "../../../lib/planFeatures";
import { getVerifiedEmailFromRequest } from "../../../lib/userAuth";
import {
  cleanEmail,
  cleanMobile,
  verifyAdOwnerByMobileAndEmail
} from "../../../lib/userVerification";
import {
  buildPaymentDetailsJson,
  getPaymentReferenceValidation,
  normalizePaymentReference
} from "../../../lib/paymentReference";
import {
  getPaymentAutomationMode,
  tryAutoReconcilePaymentFromStoredBankEvents
} from "../../../lib/bankPaymentAutomation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanText(value, maxLength = 191) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanLongText(value, maxLength = 1000) {
  return String(value || "").trim().slice(0, maxLength);
}

function getPurposeForManualPayment(planKey, includeFeatured) {
  if (planKey === "PAID_7_DAYS" && includeFeatured) {
    return "PAID_AD_WITH_FEATURED_ADDON";
  }

  if (planKey === "PREMIUM_30_DAYS" && includeFeatured) {
    return "PREMIUM_AD_WITH_FEATURED_ADDON";
  }

  return getPlan(planKey)?.purpose || "MANUAL_UPI_PAYMENT";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const verifiedEmail = getVerifiedEmailFromRequest(request);

    const adId = Number(body.adId);
    const planKey = cleanText(body.plan, 80);
    const includeFeatured =
      body.includeFeatured === true && canPlanUseFeatured(planKey);
    const referenceValidation = getPaymentReferenceValidation(
      body.transactionReference
    );
    const manualTransactionRef = referenceValidation.reference;
    const checkoutReference = cleanText(body.checkoutReference, 80);
    const manualPayerName = cleanText(body.payerName, 120);
    const manualPayerMobile = cleanMobile(body.payerMobile);
    const manualPaymentNote = cleanLongText(body.note, 500);
    const ownerMobile = cleanMobile(body.ownerMobile || body.mobile);
    const ownerEmail = cleanEmail(verifiedEmail || body.ownerEmail || body.email);

    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "Please verify your email OTP before renewing/upgrading this ad." },
        { status: 401 }
      );
    }

    if (!adId) {
      return NextResponse.json(
        { error: "Invalid classified advertisement reference." },
        { status: 400 }
      );
    }

    if (!["PAID_7_DAYS", "PREMIUM_30_DAYS"].includes(planKey)) {
      return NextResponse.json(
        { error: "Please select a valid paid renewal plan." },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
      include: { user: true }
    });

    if (!ad) {
      return NextResponse.json(
        { error: "Classified advertisement not found." },
        { status: 404 }
      );
    }

    const verification = verifyAdOwnerByMobileAndEmail(ad, {
      mobile: ownerMobile,
      email: ownerEmail
    });

    if (!verification.ok) {
      return NextResponse.json(
        { error: verification.error },
        { status: verification.status }
      );
    }

    const total = calculatePostingTotal({
      planKey,
      includeFeatured
    });

    if (total.amountInPaise <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    if (!referenceValidation.ok) {
      return NextResponse.json(
        {
          error: referenceValidation.message
        },
        { status: 400 }
      );
    }

    if (!manualPayerName || manualPayerName.length < 2) {
      return NextResponse.json(
        { error: "Please enter the payer name used for payment." },
        { status: 400 }
      );
    }

    if (!manualPayerMobile || manualPayerMobile.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10 digit payer mobile number." },
        { status: 400 }
      );
    }

    const duplicateReference = await prisma.payment.findFirst({
      where: {
        provider: MANUAL_UPI_CONFIG.provider,
        OR: [
          { manualTransactionRef },
          { razorpayPaymentId: manualTransactionRef }
        ]
      }
    });

    if (duplicateReference) {
      return NextResponse.json(
        {
          error:
            "This UPI transaction reference is already submitted. Please check the reference number or contact support."
        },
        { status: 409 }
      );
    }

    const manualReferenceNumber = createManualPaymentReference(ad.id, planKey);
    const automationMode = getPaymentAutomationMode();

    const payment = await prisma.payment.create({
      data: {
        userId: ad.userId,
        adId: ad.id,
        razorpayOrderId: manualReferenceNumber,
        razorpayPaymentId: manualTransactionRef,
        amount: total.amountInPaise,
        currency: "INR",
        status: "PENDING_MANUAL_VERIFICATION",
        plan: planKey,
        purpose: getPurposeForManualPayment(planKey, includeFeatured),
        provider: MANUAL_UPI_CONFIG.provider,
        manualReferenceNumber,
        manualTransactionRef,
        manualPayerName,
        manualPayerMobile,
        manualPaymentNote: [
          manualPaymentNote,
          `Checkout reference: ${checkoutReference}`,
          `UTR confidence: ${referenceValidation.confidence || "LOW"}`,
          `Automation mode: ${automationMode}`,
          `Email OTP verified owner mobile: ${ownerMobile}`,
          `Email OTP verified owner email: ${ownerEmail}`
        ]
          .filter(Boolean)
          .join("\n"),
        failureReason: buildPaymentDetailsJson({
          payerName: manualPayerName,
          payerMobile: manualPayerMobile,
          note: manualPaymentNote,
          ownerMobile,
          ownerEmail,
          validation: referenceValidation,
          automationMode,
          checkoutReference
        }),
        manualSubmittedAt: new Date()
      }
    });

    const reconciliation = await tryAutoReconcilePaymentFromStoredBankEvents(
      prisma,
      payment.id
    );

    const updatedPayment = reconciliation.matched
      ? await prisma.payment.findUnique({ where: { id: payment.id } })
      : payment;

    return NextResponse.json({
      success: true,
      message: reconciliation.matched
        ? "Your payment was automatically matched and verified."
        : "Your payment reference has been submitted for verification.",
      paymentId: payment.id,
      manualReferenceNumber: payment.manualReferenceNumber,
      status: updatedPayment?.status || payment.status,
      automationMode,
      autoMatched: reconciliation.matched,
      autoMatchReason: reconciliation.reason || null
    });
  } catch (error) {
    console.error("Manual UPI payment submission failed:", error);

    return NextResponse.json(
      { error: "Unable to submit payment reference. Please try again." },
      { status: 500 }
    );
  }
}
