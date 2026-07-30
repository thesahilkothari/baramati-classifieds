import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import {
  autoApplyMatchedPayment,
  BANK_CREDIT_EVENT_TYPE,
  BANK_UPI_PROVIDER,
  extractBankCreditPayload,
  isBankWebhookEnabled,
  verifyBankWebhookSignature
} from "../../../lib/bankPaymentAutomation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isBankWebhookEnabled()) {
    return NextResponse.json(
      {
        error:
          "Bank webhook is not enabled. Configure BANK_WEBHOOK_SECRET after the bank provides official webhook credentials."
      },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const signature =
    request.headers.get("x-myclassifieds-bank-signature") ||
    request.headers.get("x-bank-signature") ||
    request.headers.get("x-webhook-signature") ||
    "";

  if (!verifyBankWebhookSignature({ rawBody, signature })) {
    return NextResponse.json(
      { error: "Invalid bank webhook signature." },
      { status: 401 }
    );
  }

  let payload = null;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid bank webhook JSON payload." },
      { status: 400 }
    );
  }

  const extracted = extractBankCreditPayload(payload);

  if (!extracted.reference || !extracted.amountInPaise) {
    return NextResponse.json(
      { error: "Bank webhook did not contain a usable UTR/reference and amount." },
      { status: 400 }
    );
  }

  const existingEvent = await prisma.paymentWebhookEvent.findUnique({
    where: {
      eventId: extracted.eventId
    }
  });

  if (existingEvent?.processed) {
    return NextResponse.json({
      success: true,
      duplicate: true,
      processed: true,
      message: "Webhook event was already processed."
    });
  }

  if (!existingEvent) {
    await prisma.paymentWebhookEvent.create({
      data: {
        provider: BANK_UPI_PROVIDER,
        eventId: extracted.eventId,
        eventType: extracted.eventType || BANK_CREDIT_EVENT_TYPE,
        razorpayPaymentId: extracted.reference,
        payload,
        processed: false
      }
    });
  }

  const reconciliation = await autoApplyMatchedPayment(prisma, {
    reference: extracted.reference,
    amountInPaise: extracted.amountInPaise,
    eventId: extracted.eventId,
    note: `Automatically verified through bank webhook. UTR: ${extracted.reference}`
  });

  if (!reconciliation.matched) {
    await prisma.paymentWebhookEvent.updateMany({
      where: {
        eventId: extracted.eventId
      },
      data: {
        processed: false,
        error: reconciliation.reason
      }
    });

    return NextResponse.json({
      success: true,
      processed: false,
      message:
        "Bank credit captured. No matching pending payment was found yet, so the event is stored for later UTR reconciliation.",
      reason: reconciliation.reason
    });
  }

  return NextResponse.json({
    success: true,
    processed: true,
    message: "Bank webhook matched the UTR, marked payment as paid, and applied the selected plan.",
    paymentId: reconciliation.paymentId,
    adId: reconciliation.adId
  });
}
