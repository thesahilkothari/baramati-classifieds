import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import {
  cleanMobile,
  cleanText,
  generateReportReference,
  getAllowedReportTypeValues,
  getReportPriority,
  getReportType,
  isValidEmail
} from "../../lib/reporting";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRequestIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim().slice(0, 191);
  return request.headers.get("x-real-ip")?.slice(0, 191) || null;
}

function getRequestUserAgent(request) {
  return request.headers.get("user-agent") || null;
}

async function createUniqueReportReference(tx) {
  let referenceNumber = generateReportReference();
  while (await tx.reportTicket.findUnique({ where: { referenceNumber } })) {
    referenceNumber = generateReportReference();
  }
  return referenceNumber;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const reportType = cleanText(body.reportType, 80);
    const reason = cleanText(body.reason, 180);
    const description = String(body.description || "").trim();
    const reporterName = cleanText(body.reporterName, 120);
    const reporterEmail = cleanText(body.reporterEmail, 180).toLowerCase();
    const reporterMobile = cleanMobile(body.reporterMobile);
    const evidenceUrl = cleanText(body.evidenceUrl, 1000);
    const pageUrl = cleanText(body.pageUrl, 1000);
    const adId = Number(body.adId);
    const adSlug = cleanText(body.adSlug, 220);

    if (!getAllowedReportTypeValues().includes(reportType)) {
      return NextResponse.json({ error: "Please select a valid grievance/report type." }, { status: 400 });
    }
    if (!reason || reason.length < 5) {
      return NextResponse.json({ error: "Please enter a short reason." }, { status: 400 });
    }
    if (!description || description.length < 20) {
      return NextResponse.json({ error: "Please describe the issue in at least 20 characters." }, { status: 400 });
    }
    if (!reporterName || reporterName.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!reporterEmail && !reporterMobile) {
      return NextResponse.json({ error: "Please provide either email address or mobile number." }, { status: 400 });
    }
    if (reporterEmail && !isValidEmail(reporterEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (reporterMobile && reporterMobile.length !== 10) {
      return NextResponse.json({ error: "Please enter a valid 10 digit mobile number." }, { status: 400 });
    }

    let ad = null;
    if (adId) {
      ad = await prisma.ad.findUnique({ where: { id: adId }, select: { id: true, title: true, slug: true } });
    }
    if (!ad && adSlug) {
      ad = await prisma.ad.findUnique({ where: { slug: adSlug }, select: { id: true, title: true, slug: true } });
    }

    const reportTypeMeta = getReportType(reportType);
    const priority = getReportPriority(reportType);
    const ipAddress = getRequestIp(request);
    const userAgent = getRequestUserAgent(request);

    const ticket = await prisma.$transaction(async (tx) => {
      const referenceNumber = await createUniqueReportReference(tx);
      const createdTicket = await tx.reportTicket.create({
        data: {
          referenceNumber,
          adId: ad?.id || null,
          reportType,
          reason,
          description,
          pageUrl,
          evidenceUrl,
          reporterName,
          reporterEmail,
          reporterMobile,
          status: "NEW",
          priority,
          ipAddress,
          userAgent
        }
      });

      await tx.reportActionLog.create({
        data: {
          reportTicketId: createdTicket.id,
          action: "REPORT_SUBMITTED",
          toStatus: "NEW",
          note: `Public report submitted. Type: ${reportTypeMeta?.label || reportType}`,
          actor: "PUBLIC_USER",
          ipAddress,
          userAgent
        }
      });
      return createdTicket;
    });

    return NextResponse.json({
      success: true,
      message: "Your report has been submitted. Please save the reference number for follow-up.",
      referenceNumber: ticket.referenceNumber
    });
  } catch (error) {
    console.error("Report submission failed:", error);
    return NextResponse.json({ error: "Unable to submit report. Please try again." }, { status: 500 });
  }
}
