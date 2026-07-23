import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getRazorpayInstance } from "../../../lib/razorpay";
import { getPlan } from "../../../lib/adPlans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    const adId = Number(body.adId);
    const planKey = String(body.plan || "");

    if (!adId) {
      return NextResponse.json({ error: "Invalid ad id." }, { status: 400 });
    }

    const plan = getPlan(planKey);

    if (!plan || plan.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid paid plan." },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
      include: { user: true }
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found." }, { status: 404 });
    }

    if (plan.key === "FEATURED_10_DAYS" && ad.adType === "FREE") {
      return NextResponse.json(
        {
          error:
            "Featured add-on is available only after choosing a paid or premium plan."
        },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayInstance();
    const amountInPaise = plan.amount * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `ad_${ad.id}_${Date.now()}`,
      notes: {
        platform: "My Classifieds",
        website: "myclassifieds.in",
        adId: String(ad.id),
        plan: plan.key,
        purpose: plan.purpose
      }
    });

    await prisma.payment.create({
      data: {
        userId: ad.userId,
        adId: ad.id,
        razorpayOrderId: order.id,
        amount: amountInPaise,
        currency: "INR",
        status: "CREATED",
        plan: plan.key,
        purpose: plan.purpose,
        failureReason: null
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: plan.key,
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
