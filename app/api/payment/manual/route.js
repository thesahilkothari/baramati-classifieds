import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getPlan } from "../../../lib/adPlans";
import {
  createManualPaymentReference,
  getManualPaymentPlan
} from "../../../lib/manualPayment";

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

export async function POST(request) {
  try {
    const body = await request.json();

    const adId = Number(body.adId);
    const planKey = cleanText(body.plan, 80);
    const transactionReference = cleanText(body.transactionReference, 120);
    const payerName = cleanText(body.payerName, 120);
    const payerMobile = cleanMobile(body.payerMobile);
    const note = cleanLongText(body.note, 500);

    if (!adId) {
      return NextResponse.json(
        { error: "Invalid classified advertisement reference." },
        { status: 400 }
      );
    }

    const plan = getPlan(planKey);
    const manualPlan = getManualPaymentPlan(planKey);

    if (!plan || !manualPlan || plan.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid manual payment plan." },
        { status: 400 }
      );
    }

    if (!transactionReference || transactionReference.length < 6) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid UPI transaction ID / UTR / bank reference number."
        },
        { status: 400 }
      );
    }

    if (!payerName || payerName.length < 2) {
      return NextResponse.json(
        { error: "Please enter the payer name used for payment." },
        { status: 400 }
      );
    }

    if (!payerMobile || payerMobile.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10 digit payer mobile number." },
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

    if (plan.key === "FEATURED_10_DAYS" && ad.adType === "FREE") {
      return NextResponse.json(
        {
          error:
            "Featured add-on can be applied only after the classified is paid or premium."
        },
        { status: 400 }
      );
    }

    const duplicateReference = await prisma.payment.findFirst({
      where: {
        razorpayPaymentId: transactionReference
      }
    });

    if (duplicateReference) {
      return NextResponse.json(
        {
          error:
            "This transaction reference is already submitted. Please check the reference number or contact support."
        },
        { status: 409 }
      );
    }

    const manualReferenceNumber = createManualPaymentReference(ad.id, plan.key);

    const paymentDetails = {
      provider: "MANUAL_UPI",
      payerName,
      payerMobile,
      note,
      submittedAt: new Date().toISOString()
    };

    const payment = await prisma.payment.create({
      data: {
        userId: ad.userId,
        adId: ad.id,
        razorpayOrderId: manualReferenceNumber,
        razorpayPaymentId: transactionReference,
        razorpaySignature: null,
        amount: manualPlan.amountInPaise,
        currency: "INR",
        status: "PENDING_MANUAL_VERIFICATION",
        plan: plan.key,
        purpose: plan.purpose,
        failureReason: JSON.stringify(paymentDetails)
      }
    });

    return NextResponse.json({
      success: true,
      message:
        "Your payment reference has been submitted for manual verification.",
      paymentId: payment.id,
      manualReferenceNumber,
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
