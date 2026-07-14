import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = ["PENDING", "ACTIVE", "REJECTED", "SOLD", "EXPIRED"];

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

    const body = await request.json();
    const status = String(body.status || "").toUpperCase();

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid ad status." },
        { status: 400 }
      );
    }

    const updatedAd = await prisma.ad.update({
      where: { id: adId },
      data: {
        status,
        ...(status === "ACTIVE"
          ? {
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          : {})
      },
      include: {
        category: true,
        city: true
      }
    });

    return NextResponse.json({
      success: true,
      ad: updatedAd
    });
  } catch (error) {
    console.error("Admin ad update failed:", error);

    return NextResponse.json(
      { error: "Unable to update ad." },
      { status: 500 }
    );
  }
}
