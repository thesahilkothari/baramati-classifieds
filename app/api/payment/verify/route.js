import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getPlan, addDays } from "../../../lib/adPlans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

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

export async function POST(request) {
  try {
    const body = await request.json();

    const adId = Number(body.adId);
    const planKey = String(body.plan || "");
    const razorpayOrderId = String(body.razorpay_order_id || "");
    const razorpayPaymentId = String(body.razorpay_payment_id || "");
    const razorpaySignature = String(body.razorpay_signature || "");

    if (!adId || !planKey || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing payment verification details." },
        { status: 400 }
      );
    }

    const plan = getPlan(planKey);

    if (!plan) {
      return NextResponse.json(
        { error: "Invalid payment plan." },
        { status: 400 }
      );
    }

    const isValidSignature = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });

    if (!isValidSignature) {
      await prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          razorpayPaymentId,
          status: "FAILED_SIGNATURE"
        }
      });

      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 }
      );
    }

    const paymentUpdate = await prisma.payment.updateMany({
      where: {
        razorpayOrderId,
        adId
      },
      data: {
        razorpayPaymentId,
        status: "PAID",
        plan: plan.key,
        purpose: plan.purpose
      }
    });

    if (paymentUpdate.count === 0) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    const ad = await prisma.ad.findUnique({
      where: { id: adId }
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found." }, { status: 404 });
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
        return NextResponse.json(
          {
            error:
              "Featured add-on can be applied only to paid or premium ads."
          },
          { status: 400 }
        );
      }

      updateData.isFeatured = true;

      if (ad.status === "ACTIVE") {
        updateData.featuredUntil = addDays(now, 10);
      }
    }

    await prisma.ad.update({
      where: { id: adId },
      data: updateData
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
