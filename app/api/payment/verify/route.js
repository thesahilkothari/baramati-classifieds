import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

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
    const plan = String(body.plan || "FEATURED_7_DAYS");
    const razorpayOrderId = String(body.razorpay_order_id || "");
    const razorpayPaymentId = String(body.razorpay_payment_id || "");
    const razorpaySignature = String(body.razorpay_signature || "");

    if (!adId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing payment verification details." },
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
        where: {
          razorpayOrderId
        },
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

    const featuredDays = plan === "PREMIUM_30_DAYS" ? 30 : 7;

    const payment = await prisma.payment.updateMany({
      where: {
        razorpayOrderId,
        adId
      },
      data: {
        razorpayPaymentId,
        status: "PAID"
      }
    });

    if (payment.count === 0) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    const expiresAt = new Date(
      Date.now() + featuredDays * 24 * 60 * 60 * 1000
    );

    await prisma.ad.update({
      where: {
        id: adId
      },
      data: {
        adType: plan === "PREMIUM_30_DAYS" ? "PREMIUM" : "FEATURED",
        isFeatured: true,
        expiresAt
      }
    });

    return NextResponse.json({
      success: true,
      message:
        "Payment verified successfully. Your ad promotion is recorded and will be visible after admin approval."
    });
  } catch (error) {
    console.error("Payment verification failed:", error);

    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 }
    );
  }
}
