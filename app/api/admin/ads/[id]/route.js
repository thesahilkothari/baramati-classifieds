import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/adminAuth";
import { getDefaultExpiryForAdType, addDays } from "../../../../lib/adPlans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = ["PENDING", "ACTIVE", "REJECTED", "SOLD", "EXPIRED"];

export async function PATCH(request, { params }) {
  try {
    const now = new Date();

const existingAd = await prisma.ad.findUnique({
  where: { id: adId }
});

if (!existingAd) {
  return NextResponse.json(
    { error: "Ad not found." },
    { status: 404 }
  );
}

const updateData = {
  status
};

if (status === "ACTIVE") {
  updateData.approvedAt = existingAd.approvedAt || now;
  updateData.expiresAt =
    existingAd.expiresAt || getDefaultExpiryForAdType(existingAd.adType, now);

  if (existingAd.isFeatured && !existingAd.featuredUntil) {
    updateData.featuredUntil = addDays(now, 10);
  }
}

const updatedAd = await prisma.ad.update({
  where: { id: adId },
  data: updateData,
  include: {
    category: true,
    city: true
  }
});  }
}
