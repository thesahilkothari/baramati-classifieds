import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getPlan } from "../../../lib/adPlans";
import {
  applyPaidPlanToAd,
  verifyRazorpayPaymentSignature
} from "../../../lib/paymentApply";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    const adId = Number(body.adId);
    const planKeyFromClient = String(body.plan || "");
    const razorpayOrderId = String(body.razorpay_order_id || "");
    const razorpayPaymentId = String(body.razorpay_payment_id || "");
    const razorpaySignature = String(body.razorpay_signature || "");

    if (
      !adId ||
      !planKeyFromClient ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return NextResponse.json(
        { error: "Missing payment verification details." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findFirst({
      where: {
        razorpayOrderId,
        adId
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    const storedPlanKey = payment.plan || planKeyFromClient;
    const plan = getPlan(storedPlanKey);

    if (!plan) {
      return NextResponse.json(
        { error: "Invalid payment plan." },
        { status: 400 }
      );
    }

    if (payment.plan && payment.plan !== planKeyFromClient) {
      return NextResponse.json(
        { error: "Payment plan mismatch." },
        { status: 400 }
      );
    }

    if (
      payment.status === "PAID" &&
      payment.razorpayPaymentId === razorpayPaymentId
    ) {
      return NextResponse.json({
        success: true,
        message:
          "Payment was already verified successfully. Your plan has been recorded."
      });
    }

    const isValidSignature = verifyRazorpayPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
      keySecret: process.env.RAZORPAY_KEY_SECRET
    });

    if (!isValidSignature) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: "FAILED_SIGNATURE",
          failureReason: "Browser callback signature verification failed."
        }
      });

      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: "PAID",
          plan: plan.key,
          purpose: plan.purpose,
          failureReason: null,
          verifiedAt: new Date()
        }
      });

      await applyPaidPlanToAd(tx, {
        adId,
        planKey: plan.key
      });
    });

    return NextResponse.json({
      success: true,
      message:
        "Payment verified successfully. Your plan has been recorded and will apply after approval."
    });
  } catch (error) {
    console.error("Payment verification failed:", error);

    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 }
    );
  }
}
