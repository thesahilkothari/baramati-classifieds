import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getPlan } from "../../../lib/adPlans";
import {
  calculatePostingTotal,
  createManualPaymentReference,
  MANUAL_UPI_CONFIG
} from "../../../lib/manualPayment";
import { canPlanUseFeatured } from "../../../lib/planFeatures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanMobile(value) {
  return String(value || "").replace(/\D/g, "");
}

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

    const adId = Number(body.adId);
    const planKey = cleanText(body.plan, 80);
    const includeFeatured =
      body.includeFeatured === true && canPlanUseFeatured(planKey);
    const manualTransactionRef = cleanText(body.transactionReference, 120);
    const manualPayerName = cleanText(body.payerName, 120);
    const manualPayerMobile = cleanMobile(body.payerMobile);
    const manualPaymentNote = cleanLongText(body.note, 500);
    const ownerMobile = cleanMobile(body.ownerMobile);

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

    if (!manualTransactionRef || manualTransactionRef.length < 6) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid UPI transaction ID / UTR / bank reference number."
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

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
      include: {
        user: true
      }
    });

    if (!ad) {
      return NextResponse.json(
        { error: "Classified advertisement not found." },
        { status: 404 }
      );
    }

    if (ownerMobile && ownerMobile !== cleanMobile(ad.mobile || ad.user?.mobile)) {
      return NextResponse.json(
        { error: "Mobile number does not match this ad." },
        { status: 403 }
      );
    }

    const duplicateReference = await prisma.payment.findFirst({
      where: {
        provider: MANUAL_UPI_CONFIG.provider,
        manualTransactionRef
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

    const payment = await prisma.payment.create({
      data: {
        userId: ad.userId,
        adId: ad.id,
        razorpayOrderId: manualReferenceNumber,
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
        manualPaymentNote,
        manualSubmittedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message:
        "Your payment reference has been submitted for manual verification.",
      paymentId: payment.id,
      manualReferenceNumber: payment.manualReferenceNumber,
      status: payment.status
    });
  } catch (error) {
    console.error("Manual UPI payment submission failed:", error);

    return NextResponse.json(
      { error: "Unable to submit payment reference. Please try again." },
      { status: 500 }
    );
  }
}
