import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";

export async function POST(req) {
  try {
    const { mobile, code, name } = await req.json();

    const otpRecord = await prisma.otp.findFirst({
      where: {
        mobile,
        code,
        verified: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    const user = await prisma.user.upsert({
      where: { mobile },
      update: {
        isVerified: true,
        ...(name ? { name } : {}),
      },
      create: {
        mobile,
        name,
        isVerified: true,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        mobile: user.mobile,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "OTP verification failed" },
      { status: 500 }
    );
  }
}
