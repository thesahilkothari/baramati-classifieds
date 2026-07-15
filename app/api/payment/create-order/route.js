import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getRazorpayInstance } from "../../../lib/razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const promotionPlans = {
  FEATURED_7_DAYS: {
    label: "Featured Ad - 7 Days",
    amount: 199
  },
  PREMIUM_30_DAYS: {
    label: "Premium Ad - 30 Days",
    amount: 499
  }
};

export async function POST(request) {
  try {
    const body = await request.json();

    const adId = Number(body.adId);
    const planKey = String(body.plan || "FEATURED_7_DAYS");

    if (!adId) {
      return NextResponse.json(
        { error: "Invalid ad id." },
        { status: 400 }
      );
    }

    const plan = promotionPlans[planKey];

    if (!plan) {
      return NextResponse.json(
        { error: "Invalid promotion plan." },
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
        { error: "Ad not found." },
        { status: 404 }
      );
    }

    const razorpay = getRazorpayInstance();
    const amountInPaise = plan.amount * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `ad_${ad.id}_${Date.now()}`,
      notes: {
        adId: String(ad.id),
        plan: planKey,
        purpose: "MY_CLASSIFIEDS_AD_PROMOTION"
      }
    });

    await prisma.payment.create({
      data: {
        userId: ad.userId,
        adId: ad.id,
        razorpayOrderId: order.id,
        amount: amountInPaise,
        currency: "INR",
        status: "CREATED"
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: planKey,
      planLabel: plan.label,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create payment order." },
      { status: 500 }
    );
  }
}
