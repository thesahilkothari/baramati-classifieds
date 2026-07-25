import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/adminAuth";
import { sendTransactionalEmail } from "../../../../lib/emailService";
import { getOutreachTemplate, getTemplateLabel } from "../../../../lib/outreachTemplates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTemplates = new Set([
  "FREE_UPGRADE",
  "PAID_RENEWAL",
  "EXPIRED_REACTIVATION",
  "HIGH_VIEW_UPGRADE"
]);

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function getSafeError(error) {
  return error instanceof Error ? error.message.slice(0, 700) : String(error).slice(0, 700);
}

export async function POST(request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized admin request." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const adId = Number(body.adId);
    const templateKey = String(body.templateKey || "").trim().toUpperCase();

    if (!adId) {
      return NextResponse.json({ error: "Invalid ad reference." }, { status: 400 });
    }

    if (!allowedTemplates.has(templateKey)) {
      return NextResponse.json({ error: "Invalid outreach template." }, { status: 400 });
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

    const to = cleanEmail(ad.user?.email);

    if (!to || !to.includes("@")) {
      return NextResponse.json(
        { error: "This ad does not have a valid user email address." },
        { status: 400 }
      );
    }

    const template = getOutreachTemplate(ad, templateKey);

    await sendTransactionalEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    return NextResponse.json({
      success: true,
      message: `${getTemplateLabel(templateKey)} email sent successfully.`,
      to,
      adId,
      templateKey
    });
  } catch (error) {
    console.error("Admin outreach email failed:", error);

    return NextResponse.json(
      {
        error: "Unable to send outreach email.",
        details: getSafeError(error)
      },
      { status: 500 }
    );
  }
}
