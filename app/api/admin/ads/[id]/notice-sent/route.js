import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getAdminSession } from "../../../../../lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized admin request." },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const adId = Number(resolvedParams.id);

    if (!adId) {
      return NextResponse.json(
        { error: "Invalid ad id." },
        { status: 400 }
      );
    }

    const existingAd = await prisma.ad.findUnique({
      where: { id: adId }
    });

    if (!existingAd) {
      return NextResponse.json(
        { error: "Ad not found." },
        { status: 404 }
      );
    }

    await prisma.ad.update({
      where: { id: adId },
      data: {
        expiryNoticeSentAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: "Expiry notice marked as sent."
    });
  } catch (error) {
    console.error("Mark expiry notice failed:", error);

    return NextResponse.json(
      { error: "Unable to mark expiry notice as sent." },
      { status: 500 }
    );
  }
}