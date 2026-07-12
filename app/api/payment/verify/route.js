import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      adId
    } = await req.json();

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    await prisma.payment.updateMany({
      where: {
        razorpayOrderId: razorpay_order_id
      },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: "PAID"
      }
    });

    await prisma.ad.update({
      where: {
        id: Number(adId)
      },
      data: {
        isFeatured: true,
        adType: "FEATURED",
        status: "ACTIVE"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and ad featured"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
