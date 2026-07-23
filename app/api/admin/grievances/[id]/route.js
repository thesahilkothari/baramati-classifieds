import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/adminAuth";
import { REPORT_PRIORITIES, REPORT_STATUSES } from "../../../../lib/reporting";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanText(value, maxLength = 2000) {
  return String(value || "").trim().slice(0, maxLength);
}

function getRequestIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim().slice(0, 191);
  return request.headers.get("x-real-ip")?.slice(0, 191) || null;
}

function getRequestUserAgent(request) {
  return request.headers.get("user-agent") || null;
}

export async function PATCH(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized admin request." }, { status: 401 });

    const resolvedParams = await params;
    const ticketId = Number(resolvedParams.id);
    if (!ticketId) return NextResponse.json({ error: "Invalid grievance id." }, { status: 400 });

    const body = await request.json();
    const nextStatus = cleanText(body.status, 80).toUpperCase();
    const nextPriority = cleanText(body.priority, 80).toUpperCase();
    const assignedTo = cleanText(body.assignedTo, 120);
    const resolutionNotes = cleanText(body.resolutionNotes, 4000);
    const actionNote = cleanText(body.actionNote, 4000);

    if (nextStatus && !REPORT_STATUSES.includes(nextStatus)) {
      return NextResponse.json({ error: "Invalid grievance status." }, { status: 400 });
    }
    if (nextPriority && !REPORT_PRIORITIES.includes(nextPriority)) {
      return NextResponse.json({ error: "Invalid grievance priority." }, { status: 400 });
    }

    const existingTicket = await prisma.reportTicket.findUnique({ where: { id: ticketId } });
    if (!existingTicket) return NextResponse.json({ error: "Grievance ticket not found." }, { status: 404 });

    const now = new Date();
    const updateData = {};
    if (nextStatus) {
      updateData.status = nextStatus;
      if (nextStatus === "UNDER_REVIEW" && !existingTicket.reviewedAt) updateData.reviewedAt = now;
      if (["ACTION_TAKEN", "REJECTED", "RESOLVED"].includes(nextStatus) && !existingTicket.resolvedAt) updateData.resolvedAt = now;
      if (nextStatus === "CLOSED" && !existingTicket.closedAt) updateData.closedAt = now;
      if (!existingTicket.acknowledgedAt) updateData.acknowledgedAt = now;
    }
    if (nextPriority) updateData.priority = nextPriority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;

    const ipAddress = getRequestIp(request);
    const userAgent = getRequestUserAgent(request);

    const updatedTicket = await prisma.$transaction(async (tx) => {
      const ticket = await tx.reportTicket.update({
        where: { id: ticketId },
        data: updateData,
        include: {
          ad: { select: { id: true, title: true, slug: true, status: true } },
          actionLogs: { orderBy: { createdAt: "desc" }, take: 20 }
        }
      });
      await tx.reportActionLog.create({
        data: {
          reportTicketId: ticketId,
          action: "ADMIN_UPDATE",
          fromStatus: existingTicket.status,
          toStatus: nextStatus || existingTicket.status,
          note: actionNote || resolutionNotes || "Admin updated grievance ticket.",
          actor: "ADMIN",
          ipAddress,
          userAgent
        }
      });
      return ticket;
    });

    return NextResponse.json({ success: true, message: "Grievance ticket updated.", ticket: updatedTicket });
  } catch (error) {
    console.error("Admin grievance update failed:", error);
    return NextResponse.json({ error: "Unable to update grievance ticket." }, { status: 500 });
  }
}
