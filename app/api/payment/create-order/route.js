import { NextResponse } from "next/server";
import { razorpay } from "@/app/lib/razorpay";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(req) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    const { adId, plan } = await req.json();

    const amountMap = {
      featured: 19900,
      premium: 49900
    };

    const amount = amountMap[plan];

    if (!amount) {
      return NextResponse.json(
        { error: "Invalid premium plan" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `ad_${adId}_${Date.now()}`
    });

    await prisma.payment.create({
      data: {
        userId: user.id,
        adId: Number(adId),
        razorpayOrderId: order.id,
        amount,
        status: "CREATED"
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency: "INR"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Payment order creation failed" },
      { status: 500 }
    );
  }
}
