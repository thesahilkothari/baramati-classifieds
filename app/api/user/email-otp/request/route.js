import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import {
  sendEmailOtp,
  getOtpExpiryMinutes,
  getEmailProviderStatus
} from "../../../../lib/emailService";
import { cleanEmail, isValidEmail } from "../../../../lib/userVerification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createOtpCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function getOtpKey(email) {
  return `email:${cleanEmail(email)}`;
}

function getSafeErrorDetails(error) {
  const message = error instanceof Error ? error.message : String(error || "");

  return message
    .replace(/re_[A-Za-z0-9_\-]+/g, "re_***")
    .replace(/Bearer\s+[^\s]+/gi, "Bearer ***")
    .slice(0, 700);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = cleanEmail(body.email);

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const userWithAds = await prisma.user.findFirst({
      where: {
        email,
        ads: {
          some: {}
        }
      },
      select: {
        id: true
      }
    });

    if (!userWithAds) {
      return NextResponse.json(
        {
          error:
            "No ad account found for this email address. Please use the email entered while posting your ad."
        },
        { status: 404 }
      );
    }

    const otpKey = getOtpKey(email);
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const recentOtp = await prisma.otp.findFirst({
      where: {
        mobile: otpKey,
        createdAt: {
          gte: oneMinuteAgo
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (recentOtp) {
      return NextResponse.json(
        {
          error:
            "OTP was sent recently. Please wait for one minute before requesting another OTP."
        },
        { status: 429 }
      );
    }

    const code = createOtpCode();
    const expiresAt = new Date(Date.now() + getOtpExpiryMinutes() * 60 * 1000);

    try {
      await sendEmailOtp({
        to: email,
        code
      });
    } catch (emailError) {
      console.error("Email OTP provider failed:", emailError);

      return NextResponse.json(
        {
          error: "Unable to send OTP email.",
          details: getSafeErrorDetails(emailError),
          providerStatus: getEmailProviderStatus()
        },
        { status: 502 }
      );
    }

    await prisma.otp.create({
      data: {
        mobile: otpKey,
        code,
        expiresAt,
        verified: false
      }
    });

    return NextResponse.json({
      success: true,
      message: "OTP has been sent to your email address.",
      expiresInMinutes: getOtpExpiryMinutes()
    });
  } catch (error) {
    console.error("Email OTP request failed:", error);

    return NextResponse.json(
      {
        error: "Unable to process OTP request.",
        details: getSafeErrorDetails(error)
      },
      { status: 500 }
    );
  }
}
