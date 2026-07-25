import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/adminAuth";
import { addDays, getDefaultExpiryForAdType } from "../../../../lib/adPlans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = ["PENDING", "ACTIVE", "REJECTED", "SOLD", "EXPIRED"];

export async function PATCH(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized admin request." }, { status: 401 });

    const resolvedParams = await params;
    const adId = Number(resolvedParams.id);
    if (!adId) return NextResponse.json({ error: "Invalid ad id." }, { status: 400 });

    const body = await request.json();
    const status = String(body.status || "").toUpperCase();
    if (!allowedStatuses.includes(status)) return NextResponse.json({ error: "Invalid ad status." }, { status: 400 });

    const existingAd = await prisma.ad.findUnique({ where: { id: adId } });
    if (!existingAd) return NextResponse.json({ error: "Ad not found." }, { status: 404 });

    if (status === "ACTIVE") {
      const pendingManualPayment = await prisma.payment.findFirst({ where: { adId, provider: "MANUAL_UPI", status: "PENDING_MANUAL_VERIFICATION" } });
      if (pendingManualPayment) {
        return NextResponse.json({ error: "This classified has a pending manual UPI payment. Verify or reject the payment from Admin Payments before approving the ad." }, { status: 400 });
      }
    }

    const now = new Date();
    const updateData = { status };

    if (status === "ACTIVE") {
      updateData.approvedAt = existingAd.approvedAt || now;
      const hasValidExistingExpiry = existingAd.expiresAt && existingAd.expiresAt > now;
      updateData.expiresAt = hasValidExistingExpiry ? existingAd.expiresAt : getDefaultExpiryForAdType(existingAd.adType, now);

      if (existingAd.isFeatured) {
        const hasValidFeaturedExpiry = existingAd.featuredUntil && existingAd.featuredUntil > now;
        updateData.featuredUntil = hasValidFeaturedExpiry ? existingAd.featuredUntil : addDays(now, 10);
      }
    }

    if (status === "PENDING") updateData.approvedAt = null;

    const updatedAd = await prisma.ad.update({
      where: { id: adId },
      data: updateData,
      include: { category: true, city: true, user: true, payments: { orderBy: { createdAt: "desc" }, take: 3 } }
    });

    return NextResponse.json({ success: true, message: `Ad status updated to ${status}.`, ad: updatedAd });
  } catch (error) {
    console.error("Admin ad update failed:", error);
    return NextResponse.json({ error: "Unable to update ad." }, { status: 500 });
  }
}
