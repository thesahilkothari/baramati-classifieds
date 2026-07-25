import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getVerifiedEmailFromRequest } from "../../../lib/userAuth";
import { verifyAdOwnerByMobileAndEmail } from "../../../lib/userVerification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = ["SOLD_MYCLASSIFIEDS", "SOLD_ELSEWHERE", "AVAILABLE"];

export async function PATCH(request) {
  try {
    const body = await request.json();
    const verifiedEmail = getVerifiedEmailFromRequest(request);
    const adId = Number(body.adId);
    const soldStatus = String(body.soldStatus || "").toUpperCase();

    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "Please verify your email OTP before taking action." },
        { status: 401 }
      );
    }

    if (!adId) {
      return NextResponse.json(
        { error: "Invalid ad reference." },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(soldStatus)) {
      return NextResponse.json(
        { error: "Please select whether the item/service is sold or available." },
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

    const verification = verifyAdOwnerByMobileAndEmail(ad, {
      mobile: body.mobile,
      email: verifiedEmail
    });

    if (!verification.ok) {
      return NextResponse.json(
        { error: verification.error },
        { status: verification.status }
      );
    }

    const updateData = {
      soldStatus,
      soldStatusUpdatedAt: new Date()
    };

    if (["SOLD_MYCLASSIFIEDS", "SOLD_ELSEWHERE"].includes(soldStatus)) {
      updateData.status = "SOLD";
    }

    if (soldStatus === "AVAILABLE" && ad.status === "SOLD") {
      updateData.status = "ACTIVE";
    }

    const updatedAd = await prisma.ad.update({
      where: { id: ad.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message:
        soldStatus === "AVAILABLE"
          ? "Your ad has been marked as available."
          : "Your ad has been marked as sold.",
      ad: {
        id: updatedAd.id,
        status: updatedAd.status,
        soldStatus: updatedAd.soldStatus
      }
    });
  } catch (error) {
    console.error("User ad status update failed:", error);

    return NextResponse.json(
      { error: "Unable to update ad status. Please try again." },
      { status: 500 }
    );
  }
}
