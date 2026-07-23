import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    razorpayKeyIdPrefix: process.env.RAZORPAY_KEY_ID?.startsWith("rzp_live_")
      ? "live"
      : process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_")
        ? "test"
        : "missing_or_invalid",
    publicRazorpayKeyIdPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_live_")
      ? "live"
      : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_test_")
        ? "test"
        : "missing_or_invalid"
  });
}