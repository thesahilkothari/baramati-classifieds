import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/adminAuth";
import { addDays, getDefaultExpiryForAdType } from "../../../../lib/adPlans";
import {
  ADMIN_MANAGEABLE_PLAN_KEYS,
  buildAdminOverridePaymentLog,
  buildAdminPlanUpdate,
  parseAdminDate,
  parsePositiveInt
} from "../../../../lib/adminAdTools";
import {
  buildAdApprovedEmail,
  buildAdRejectedEmail,
  getUserEmailFromAd,
  safeSendUserEventEmail
} from "../../../../lib/userEventEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = ["PENDING", "ACTIVE", "REJECTED", "SOLD", "EXPIRED"];

function normalizeStatus(value) {
  const status = String(value || "").toUpperCase();
  return allowedStatuses.includes(status) ? status : "";
}

function resolveFeaturedUntil({ ad, updateData, now }) {
  if (!updateData.isFeatured && !ad.isFeatured) return null;
  if (updateData.featuredUntil) return updateData.featuredUntil;
  if (ad.featuredUntil && ad.featuredUntil > now) return ad.featuredUntil;
  if ((updateData.adType || ad.adType) === "FEATURED") {
    return updateData.expiresAt || ad.expiresAt || addDays(now, 365);
  }
  return addDays(now, 10);
}

function shouldCreateOverrideLog({ hasPlanUpdate, explicitExpiry, durationDays, clearFeatured }) {
  return Boolean(hasPlanUpdate || explicitExpiry || durationDays || clearFeatured);
}

export async function PATCH(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin request." }, { status: 401 });
    }

    const resolvedParams = await params;
    const adId = Number(resolvedParams.id);
    if (!adId) {
      return NextResponse.json({ error: "Invalid ad id." }, { status: 400 });
    }

    const body = await request.json();
    const requestedStatus = normalizeStatus(body.status);
    const planKey = String(body.planKey || "").trim();
    const hasPlanUpdate = planKey && ADMIN_MANAGEABLE_PLAN_KEYS.includes(planKey);
    const explicitExpiry = parseAdminDate(body.expiresAt);
    const durationDays = parsePositiveInt(body.durationDays, null);
    const clearFeatured = body.clearFeatured === true;

    if (!requestedStatus && !hasPlanUpdate && !explicitExpiry && !durationDays && !clearFeatured) {
      return NextResponse.json({ error: "No valid admin update supplied." }, { status: 400 });
    }

    if (String(body.status || "") && !requestedStatus) {
      return NextResponse.json({ error: "Invalid ad status." }, { status: 400 });
    }

    const existingAd = await prisma.ad.findUnique({
      where: { id: adId },
      include: { user: true }
    });
    if (!existingAd) {
      return NextResponse.json({ error: "Ad not found." }, { status: 404 });
    }

    const autoReactivateByOverride = !requestedStatus && Boolean(hasPlanUpdate || explicitExpiry || durationDays);
    const targetStatus = requestedStatus || (autoReactivateByOverride ? "ACTIVE" : existingAd.status);

    if (targetStatus === "ACTIVE") {
      const pendingManualPayment = await prisma.payment.findFirst({
        where: {
          adId,
          provider: "MANUAL_UPI",
          status: "PENDING_MANUAL_VERIFICATION"
        }
      });

      if (pendingManualPayment && !hasPlanUpdate && !autoReactivateByOverride) {
        return NextResponse.json(
          {
            error:
              "This classified has a pending manual UPI payment. Verify/reject the payment first, or use the admin plan override deliberately."
          },
          { status: 400 }
        );
      }
    }

    const previousStatus = existingAd.status;
    const now = new Date();
    const updateData = {};

    if (requestedStatus || autoReactivateByOverride) updateData.status = targetStatus;

    if (hasPlanUpdate) {
      Object.assign(
        updateData,
        buildAdminPlanUpdate({
          existingAd,
          planKey,
          durationDays: body.durationDays,
          expiryDate: body.expiresAt,
          featuredDays: body.featuredDays,
          featuredUntilDate: body.featuredUntil
        })
      );
    }

    if (!hasPlanUpdate && explicitExpiry) {
      updateData.expiresAt = explicitExpiry;
      updateData.expiryNoticeSentAt = null;
      updateData.renewalNoticeSentAt = null;
      updateData.followUpNoticeSentAt = null;
    }

    if (!hasPlanUpdate && durationDays) {
      updateData.expiresAt = addDays(now, durationDays);
      updateData.expiryNoticeSentAt = null;
      updateData.renewalNoticeSentAt = null;
      updateData.followUpNoticeSentAt = null;
    }

    if (clearFeatured) {
      updateData.isFeatured = false;
      updateData.featuredUntil = null;
      if (existingAd.adType === "FEATURED") updateData.adType = "PREMIUM";
    }

    if (targetStatus === "ACTIVE") {
      updateData.approvedAt = existingAd.approvedAt || now;
      const existingExpiry = updateData.expiresAt || existingAd.expiresAt;
      const hasValidExistingExpiry = existingExpiry && existingExpiry > now;
      updateData.expiresAt = hasValidExistingExpiry
        ? existingExpiry
        : getDefaultExpiryForAdType(updateData.adType || existingAd.adType, now);

      if (updateData.isFeatured === true || existingAd.isFeatured) {
        updateData.featuredUntil = resolveFeaturedUntil({ ad: existingAd, updateData, now });
      }
    }

    if (targetStatus === "PENDING") updateData.approvedAt = null;

    const logOverride = shouldCreateOverrideLog({
      hasPlanUpdate,
      explicitExpiry,
      durationDays,
      clearFeatured
    });

    const updatedAd = await prisma.$transaction(async (tx) => {
      const ad = await tx.ad.update({
        where: { id: adId },
        data: updateData,
        include: {
          category: true,
          city: true,
          user: true,
          payments: { orderBy: { createdAt: "desc" }, take: 3 }
        }
      });

      if (logOverride) {
        await tx.payment.create({
          data: buildAdminOverridePaymentLog({
            adId,
            userId: existingAd.userId,
            planKey: planKey || "NO_PLAN_CHANGE",
            status: ad.status,
            action: clearFeatured ? "CLEAR_FEATURED" : "PLAN_STATUS_EXPIRY_OVERRIDE",
            expiresAt: ad.expiresAt,
            featuredUntil: ad.featuredUntil,
            note: autoReactivateByOverride
              ? "Admin override reactivated the advertisement and reassigned plan/expiry."
              : "Admin override updated plan, featured placement or expiry."
          })
        });
      }

      return ad;
    });

    if (previousStatus !== targetStatus && targetStatus === "ACTIVE") {
      await safeSendUserEventEmail({
        to: getUserEmailFromAd(updatedAd),
        email: buildAdApprovedEmail(updatedAd)
      });
    }

    if (previousStatus !== targetStatus && targetStatus === "REJECTED") {
      await safeSendUserEventEmail({
        to: getUserEmailFromAd(updatedAd),
        email: buildAdRejectedEmail(updatedAd)
      });
    }

    return NextResponse.json({
      success: true,
      message: autoReactivateByOverride
        ? "Admin override applied and ad reactivated successfully."
        : "Ad updated successfully.",
      ad: updatedAd
    });
  } catch (error) {
    console.error("Admin ad update failed:", error);
    return NextResponse.json({ error: "Unable to update ad." }, { status: 500 });
  }
}
