import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generateOtp, sendOtpSms } from "@/app/lib/otp";

export async function POST(req) {
  try {
    const { mobile } = await req.json();

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Valid Indian mobile number is required" },
        { status: 400 }
      );
    }

    const code = generateOtp();

    await prisma.otp.create({
      data: {
        mobile,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    });

    await sendOtpSms(mobile, code);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
