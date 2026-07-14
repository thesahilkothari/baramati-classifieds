import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay environment variables are missing");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount);

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `featured_ad_${Date.now()}`,
      notes: {
        purpose: body.purpose || "FEATURED_AD"
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create Razorpay order" },
      { status: 500 }
    );
  }
}
