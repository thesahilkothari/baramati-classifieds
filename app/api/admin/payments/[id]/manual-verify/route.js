import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getAdminSession } from "../../../../../lib/adminAuth";
import { applyPaidPlanToAd } from "../../../../../lib/paymentApply";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanText(value, maxLength = 1000) {
  return String(value || "").trim().slice(0, maxLength);
}

function stringifyNote(existingFailureReason, action, note) {
  let existingData = {};

  try {
    existingData = JSON.parse(existingFailureReason || "{}");
  } catch {
    existingData = {
      existingNote: existingFailureReason || ""
    };
  }

  return JSON.stringify({
    ...existingData,
    adminAction: action,
    adminNote: note,
    adminActionAt: new Date().toISOString()
  });
}

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
    const paymentId = Number(resolvedParams.id);

    if (!paymentId) {
      return NextResponse.json(
        { error: "Invalid payment id." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const action = cleanText(body.action, 40).toUpperCase();
    const note = cleanText(body.note, 1000);

    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid manual payment action." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { ad: true }
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    const isManualPayment =
      payment.status === "PENDING_MANUAL_VERIFICATION" ||
      String(payment.razorpayOrderId || "").startsWith("MC-");

    if (!isManualPayment) {
      return NextResponse.json(
        { error: "This is not a manual UPI payment record." },
        { status: 400 }
      );
    }

    if (payment.status === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Payment is already marked as paid."
      });
    }

    if (action === "REJECT") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "REJECTED_MANUAL",
          failureReason: stringifyNote(
            payment.failureReason,
            "REJECT",
            note || "Manual payment rejected by admin."
          ),
          verifiedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: "Manual payment rejected."
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          failureReason: stringifyNote(
            payment.failureReason,
            "APPROVE",
            note || "Manual UPI payment verified by admin."
          ),
          verifiedAt: new Date()
        }
      });

      await applyPaidPlanToAd(tx, {
        adId: payment.adId,
        planKey: payment.plan
      });
    });

    return NextResponse.json({
      success: true,
      message:
        "Manual payment verified and selected plan applied to the classified."
    });
  } catch (error) {
    console.error("Manual payment verification failed:", error);

    return NextResponse.json(
      { error: error?.message || "Unable to verify manual payment." },
      { status: 500 }
    );
  }
}
