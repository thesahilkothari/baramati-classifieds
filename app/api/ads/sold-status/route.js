import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = [
  "SOLD_MYCLASSIFIEDS",
  "SOLD_ELSEWHERE",
  "AVAILABLE"
];

function cleanMobile(value) {
  return String(value || "").replace(/\D/g, "");
}

export async function POST(request) {
  try {
    const body = await request.json();

    const adId = Number(body.adId);
    const mobile = cleanMobile(body.mobile);
    const soldStatus = String(body.soldStatus || "").toUpperCase();

    if (!adId) {
      return NextResponse.json(
        { error: "Invalid ad reference." },
        { status: 400 }
      );
    }

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        { error: "Please enter the 10 digit mobile number used while posting." },
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
      include: {
        user: true
      }
    });

    if (!ad) {
      return NextResponse.json(
        { error: "Ad not found." },
        { status: 404 }
      );
    }

    const ownerMobile = cleanMobile(ad.mobile || ad.user?.mobile);

    if (ownerMobile !== mobile) {
      return NextResponse.json(
        { error: "Mobile number does not match this ad." },
        { status: 403 }
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
          ? "Thank you. Your ad has been marked as available. You may renew or upgrade it."
          : "Thank you. Your ad has been marked as sold.",
      ad: {
        id: updatedAd.id,
        title: updatedAd.title,
        soldStatus: updatedAd.soldStatus,
        status: updatedAd.status
      }
    });
  } catch (error) {
    console.error("Sold status update failed:", error);

    return NextResponse.json(
      { error: "Unable to update ad status. Please try again." },
      { status: 500 }
    );
  }
}
