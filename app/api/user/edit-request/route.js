import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getVerifiedEmailFromRequest } from "../../../lib/userAuth";
import {
  cleanEmail,
  cleanMobile,
  verifyAdOwnerByMobileAndEmail
} from "../../../lib/userVerification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestTypeLabels = {
  TITLE: "Ad heading/title correction",
  DESCRIPTION: "Ad description correction",
  PRICE: "Price correction",
  CONTACT: "Contact detail correction",
  LOCATION: "Location/address correction",
  CATEGORY: "Category correction",
  OTHER: "Other correction/update"
};

function cleanText(value, maxLength = 1000) {
  return String(value || "").trim().slice(0, maxLength);
}

function createReferenceNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `EDIT-${datePart}-${randomPart}`;
}

function getRequestIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim().slice(0, 191);
  return request.headers.get("x-real-ip")?.slice(0, 191) || null;
}

function getRequestUserAgent(request) {
  return request.headers.get("user-agent") || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const verifiedEmail = getVerifiedEmailFromRequest(request);

    const adId = Number(body.adId);
    const mobile = cleanMobile(body.mobile);
    const requestType = cleanText(body.requestType, 60).toUpperCase();
    const details = cleanText(body.details, 2000);
    const contactName = cleanText(body.contactName, 120);
    const contactEmail = cleanEmail(body.contactEmail || verifiedEmail);

    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "Please verify your email OTP before submitting an edit request." },
        { status: 401 }
      );
    }

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

    if (!requestTypeLabels[requestType]) {
      return NextResponse.json(
        { error: "Please select a valid update request type." },
        { status: 400 }
      );
    }

    if (!details || details.length < 20) {
      return NextResponse.json(
        {
          error:
            "Please describe the required correction/update in at least 20 characters."
        },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.findUnique({
      where: { id: adId },
      include: {
        user: true,
        category: true,
        city: true
      }
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found." }, { status: 404 });
    }

    const verification = verifyAdOwnerByMobileAndEmail(ad, {
      mobile,
      email: verifiedEmail
    });

    if (!verification.ok) {
      return NextResponse.json(
        { error: verification.error },
        { status: verification.status }
      );
    }

    const ipAddress = getRequestIp(request);
    const userAgent = getRequestUserAgent(request);
    const referenceNumber = createReferenceNumber();

    const description = [
      "User requested correction/update for classified ad after email OTP verification.",
      "",
      `Ad ID: ${ad.id}`,
      `Ad Title: ${ad.title}`,
      `Current Status: ${ad.status}`,
      `Category: ${ad.category?.nameEn || "-"}`,
      `City: ${ad.city?.name || "-"}`,
      "",
      `Verification Mobile: ${mobile}`,
      `Verified Email: ${verifiedEmail}`,
      `Request Type: ${requestTypeLabels[requestType]}`,
      "",
      "Requested Change:",
      details
    ].join("\n");

    const ticket = await prisma.$transaction(async (tx) => {
      const createdTicket = await tx.reportTicket.create({
        data: {
          referenceNumber,
          adId: ad.id,
          reportType: "AD_EDIT_REQUEST",
          reason: requestTypeLabels[requestType],
          description,
          pageUrl: `/ads/${ad.slug}`,
          reporterName: contactName || ad.user?.name || null,
          reporterEmail: contactEmail || ad.user?.email || null,
          reporterMobile: mobile,
          status: "NEW",
          priority: "NORMAL",
          ipAddress,
          userAgent
        }
      });

      await tx.reportActionLog.create({
        data: {
          reportTicketId: createdTicket.id,
          action: "EDIT_REQUEST_SUBMITTED_EMAIL_OTP_VERIFIED",
          fromStatus: null,
          toStatus: "NEW",
          note: "User submitted ad edit/update request after email OTP verification.",
          actor: "USER",
          ipAddress,
          userAgent
        }
      });

      return createdTicket;
    });

    return NextResponse.json({
      success: true,
      message:
        "Your edit/update request has been submitted. Admin will review it.",
      referenceNumber: ticket.referenceNumber
    });
  } catch (error) {
    console.error("User edit request submission failed:", error);

    return NextResponse.json(
      { error: "Unable to submit edit request. Please try again." },
      { status: 500 }
    );
  }
}
