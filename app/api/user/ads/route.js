import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getVerifiedEmailFromRequest } from "../../../lib/userAuth";
import { cleanMobile } from "../../../lib/userVerification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serializeDate(value) {
  return value ? value.toISOString() : null;
}

function serializeDecimal(value) {
  if (value === null || value === undefined) return null;
  return Number(value);
}

function getPaymentSummary(payments = []) {
  const latestPayment = payments[0] || null;
  const pendingPayment = payments.find(
    (payment) => payment.status === "PENDING_MANUAL_VERIFICATION"
  );
  const paidPayment = payments.find((payment) => payment.status === "PAID");

  return {
    latestStatus: latestPayment?.status || "NO_PAYMENT",
    latestProvider: latestPayment?.provider || null,
    latestAmount: latestPayment?.amount || null,
    latestPlan: latestPayment?.plan || null,
    latestReference:
      latestPayment?.manualReferenceNumber ||
      latestPayment?.manualTransactionRef ||
      latestPayment?.razorpayOrderId ||
      null,
    latestCreatedAt: serializeDate(latestPayment?.createdAt),
    pendingVerification: Boolean(pendingPayment),
    verifiedPaid: Boolean(paidPayment)
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = cleanMobile(searchParams.get("mobile"));
    const verifiedEmail = getVerifiedEmailFromRequest(request);

    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "Please verify your email OTP before viewing ads." },
        { status: 401 }
      );
    }

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        { error: "Please enter the 10 digit mobile number used while posting the ad." },
        { status: 400 }
      );
    }

    const ads = await prisma.ad.findMany({
      where: {
        AND: [
          {
            OR: [{ mobile }, { whatsapp: mobile }, { user: { mobile } }]
          },
          {
            user: {
              email: verifiedEmail
            }
          }
        ]
      },
      include: {
        category: true,
        city: true,
        user: {
          select: {
            name: true,
            email: true,
            mobile: true
          }
        },
        payments: {
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    });

    return NextResponse.json({
      success: true,
      mobile,
      email: verifiedEmail,
      count: ads.length,
      ads: ads.map((ad) => ({
        id: ad.id,
        title: ad.title,
        slug: ad.slug,
        description: ad.description,
        price: serializeDecimal(ad.price),
        status: ad.status,
        adType: ad.adType,
        isFeatured: ad.isFeatured,
        views: ad.views,
        mobile: ad.mobile,
        whatsapp: ad.whatsapp,
        address: ad.address,
        condition: ad.condition,
        soldStatus: ad.soldStatus,
        createdAt: serializeDate(ad.createdAt),
        updatedAt: serializeDate(ad.updatedAt),
        approvedAt: serializeDate(ad.approvedAt),
        expiresAt: serializeDate(ad.expiresAt),
        featuredUntil: serializeDate(ad.featuredUntil),
        category: ad.category
          ? {
              id: ad.category.id,
              nameEn: ad.category.nameEn,
              nameMr: ad.category.nameMr,
              slug: ad.category.slug
            }
          : null,
        city: ad.city
          ? {
              id: ad.city.id,
              name: ad.city.name,
              slug: ad.city.slug
            }
          : null,
        user: ad.user,
        paymentSummary: getPaymentSummary(ad.payments),
        payments: ad.payments.map((payment) => ({
          id: payment.id,
          provider: payment.provider,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          plan: payment.plan,
          purpose: payment.purpose,
          failureReason: payment.failureReason,
          manualReferenceNumber: payment.manualReferenceNumber,
          manualTransactionRef: payment.manualTransactionRef,
          manualSubmittedAt: serializeDate(payment.manualSubmittedAt),
          manualVerificationNote: payment.manualVerificationNote,
          verifiedAt: serializeDate(payment.verifiedAt),
          createdAt: serializeDate(payment.createdAt)
        }))
      }))
    });
  } catch (error) {
    console.error("User ad lookup failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch your ads. Please try again." },
      { status: 500 }
    );
  }
}
