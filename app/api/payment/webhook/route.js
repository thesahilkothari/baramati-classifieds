import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import {
  applyPaidPlanToAd,
  verifyRazorpayWebhookSignature
} from "../../../lib/paymentApply";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getWebhookEventId(eventPayload, eventType, orderId, paymentId) {
  const headerSafePart = [
    eventType || "unknown",
    orderId || "no_order",
    paymentId || "no_payment",
    eventPayload.created_at || Date.now()
  ]
    .join("_")
    .replace(/[^a-zA-Z0-9_.-]/g, "_");

  return String(eventPayload.id || headerSafePart).slice(0, 191);
}

function getRazorpayEntities(eventPayload) {
  const paymentEntity = eventPayload?.payload?.payment?.entity || null;
  const orderEntity = eventPayload?.payload?.order?.entity || null;

  const eventType = String(eventPayload?.event || "");
  const razorpayOrderId = String(
    paymentEntity?.order_id || orderEntity?.id || ""
  );
  const razorpayPaymentId = String(paymentEntity?.id || "");

  return {
    eventType,
    paymentEntity,
    orderEntity,
    razorpayOrderId,
    razorpayPaymentId
  };
}

async function safelyCreateWebhookEvent({
  eventId,
  eventType,
  razorpayOrderId,
  razorpayPaymentId,
  payload
}) {
  try {
    return await prisma.paymentWebhookEvent.create({
      data: {
        provider: "RAZORPAY",
        eventId,
        eventType,
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: razorpayPaymentId || null,
        payload,
        processed: false
      }
    });
  } catch (error) {
    if (error?.code === "P2002") {
      return null;
    }

    throw error;
  }
}

export async function POST(request) {
  const rawBody = await request.text();

  try {
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const isValidSignature = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
      webhookSecret
    });

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const eventPayload = JSON.parse(rawBody);
    const {
      eventType,
      paymentEntity,
      razorpayOrderId,
      razorpayPaymentId
    } = getRazorpayEntities(eventPayload);

    const eventId = getWebhookEventId(
      eventPayload,
      eventType,
      razorpayOrderId,
      razorpayPaymentId
    );

    const webhookEvent = await safelyCreateWebhookEvent({
      eventId,
      eventType,
      razorpayOrderId,
      razorpayPaymentId,
      payload: eventPayload
    });

    if (!webhookEvent) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        message: "Webhook event already received."
      });
    }

    if (!["payment.captured", "payment.failed"].includes(eventType)) {
      await prisma.paymentWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processed: true,
          processedAt: new Date(),
          error: `Ignored event type: ${eventType}`
        }
      });

      return NextResponse.json({
        success: true,
        ignored: true,
        message: `Webhook event ignored: ${eventType}`
      });
    }

    if (!razorpayOrderId) {
      await prisma.paymentWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processed: false,
          error: "Webhook did not contain Razorpay order id."
        }
      });

      return NextResponse.json({
        success: true,
        message: "Webhook saved but order id was missing."
      });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        razorpayOrderId
      }
    });

    if (!payment) {
      await prisma.paymentWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processed: false,
          error: "Matching local payment record not found."
        }
      });

      return NextResponse.json({
        success: true,
        message:
          "Webhook saved. Matching payment record was not found for this order."
      });
    }

    if (eventType === "payment.failed") {
      const failureReason =
        paymentEntity?.error_description ||
        paymentEntity?.error_reason ||
        paymentEntity?.error_code ||
        "Razorpay reported payment failure.";

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            razorpayPaymentId: razorpayPaymentId || payment.razorpayPaymentId,
            status: "FAILED",
            failureReason,
            webhookEventId: webhookEvent.eventId
          }
        });

        await tx.paymentWebhookEvent.update({
          where: { id: webhookEvent.id },
          data: {
            paymentRecordId: payment.id,
            processed: true,
            processedAt: new Date()
          }
        });
      });

      return NextResponse.json({
        success: true,
        message: "Payment failure webhook processed."
      });
    }

    if (payment.status === "PAID") {
      await prisma.paymentWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          paymentRecordId: payment.id,
          processed: true,
          processedAt: new Date(),
          error: "Payment was already marked PAID before this webhook."
        }
      });

      return NextResponse.json({
        success: true,
        message: "Payment already processed."
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: razorpayPaymentId || payment.razorpayPaymentId,
          status: "PAID",
          failureReason: null,
          webhookEventId: webhookEvent.eventId,
          verifiedAt: new Date()
        }
      });

      await applyPaidPlanToAd(tx, {
        adId: payment.adId,
        planKey: payment.plan
      });

      await tx.paymentWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          paymentRecordId: payment.id,
          processed: true,
          processedAt: new Date()
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: "Payment captured webhook processed."
    });
  } catch (error) {
    console.error("Razorpay webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
