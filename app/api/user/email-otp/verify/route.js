import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import {
  createUserEmailSessionCookieValue,
  getUserEmailSessionMaxAgeSeconds,
  USER_EMAIL_SESSION_COOKIE
} from "../../../../lib/userAuth";
import { cleanEmail, isValidEmail } from "../../../../lib/userVerification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getOtpKey(email) {
  return `email:${cleanEmail(email)}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = cleanEmail(body.email);
    const code = String(body.code || "").replace(/\D/g, "").slice(0, 6);

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: "Please enter the 6 digit OTP." },
        { status: 400 }
      );
    }

    const otpKey = getOtpKey(email);

    const otp = await prisma.otp.findFirst({
      where: {
        mobile: otpKey,
        code,
        verified: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!otp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    await prisma.otp.update({
      where: {
        id: otp.id
      },
      data: {
        verified: true
      }
    });

    const token = createUserEmailSessionCookieValue(email);
    const response = NextResponse.json({
      success: true,
      message: "Email verified successfully.",
      email,
      expiresInSeconds: getUserEmailSessionMaxAgeSeconds()
    });

    response.cookies.set({
      name: USER_EMAIL_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getUserEmailSessionMaxAgeSeconds()
    });

    return response;
  } catch (error) {
    console.error("Email OTP verify failed:", error);

    return NextResponse.json(
      { error: "Unable to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
