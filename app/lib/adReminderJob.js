import { prisma } from "./prisma";
import { sendTransactionalEmail } from "./emailService";
import {
  buildFreeAdExpiryReminderEmail,
  buildPaidAdExpiryReminderEmail
} from "./adReminderEmails";

function getBatchLimit() {
  const limit = Number(process.env.AD_REMINDER_BATCH_LIMIT || 60);
  return Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 60;
}

function getLookaheadHours() {
  const hours = Number(process.env.AD_REMINDER_LOOKAHEAD_HOURS || 60);
  return Number.isFinite(hours) && hours > 0 ? hours : 60;
}

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function getAdRecipientEmail(ad) {
  const email = cleanEmail(ad.user?.email);
  if (!email || !email.includes("@")) return null;
  return email;
}

function getReminderType(ad) {
  if (ad.adType === "FREE") return "FREE_EXPIRY_UPGRADE";
  return "PAID_EXPIRY_RENEWAL_AND_SOLD_CHECK";
}

function buildEmailForAd(ad) {
  if (ad.adType === "FREE") {
    return buildFreeAdExpiryReminderEmail(ad);
  }

  return buildPaidAdExpiryReminderEmail(ad);
}

function getNoticeUpdateData(ad, now) {
  const updateData = {
    expiryNoticeSentAt: now
  };

  if (ad.adType === "FREE") {
    updateData.renewalNoticeSentAt = now;
  } else {
    updateData.followUpNoticeSentAt = now;
    updateData.renewalNoticeSentAt = now;
  }

  return updateData;
}

async function fetchCandidateAds({ now, windowEnd, limit }) {
  const perTypeLimit = Math.max(10, Math.ceil(limit / 2));

  const [freeAds, paidAds] = await Promise.all([
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FREE",
        expiryNoticeSentAt: null,
        expiresAt: {
          gt: now,
          lte: windowEnd
        }
      },
      include: {
        user: true,
        category: true,
        city: true
      },
      orderBy: {
        expiresAt: "asc"
      },
      take: perTypeLimit
    }),
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: {
          in: ["PAID", "PREMIUM", "FEATURED"]
        },
        expiryNoticeSentAt: null,
        expiresAt: {
          gt: now,
          lte: windowEnd
        }
      },
      include: {
        user: true,
        category: true,
        city: true
      },
      orderBy: {
        expiresAt: "asc"
      },
      take: perTypeLimit
    })
  ]);

  return [...freeAds, ...paidAds]
    .sort((first, second) => {
      const firstTime = first.expiresAt ? new Date(first.expiresAt).getTime() : 0;
      const secondTime = second.expiresAt ? new Date(second.expiresAt).getTime() : 0;
      return firstTime - secondTime;
    })
    .slice(0, limit);
}

export async function runAdExpiryReminderJob({ dryRun = false } = {}) {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + getLookaheadHours() * 60 * 60 * 1000);
  const limit = getBatchLimit();

  const candidateAds = await fetchCandidateAds({ now, windowEnd, limit });

  const summary = {
    dryRun,
    startedAt: now.toISOString(),
    windowEnd: windowEnd.toISOString(),
    batchLimit: limit,
    scanned: candidateAds.length,
    sent: 0,
    skipped: 0,
    failed: 0,
    results: []
  };

  for (const ad of candidateAds) {
    const to = getAdRecipientEmail(ad);
    const reminderType = getReminderType(ad);

    if (!to) {
      summary.skipped += 1;
      summary.results.push({
        adId: ad.id,
        title: ad.title,
        reminderType,
        status: "SKIPPED",
        reason: "No valid user email found"
      });
      continue;
    }

    const email = buildEmailForAd(ad);

    if (dryRun) {
      summary.results.push({
        adId: ad.id,
        title: ad.title,
        to,
        reminderType,
        status: "DRY_RUN",
        subject: email.subject,
        expiresAt: ad.expiresAt
      });
      continue;
    }

    try {
      await sendTransactionalEmail({
        to,
        subject: email.subject,
        html: email.html,
        text: email.text
      });

      await prisma.ad.update({
        where: {
          id: ad.id
        },
        data: getNoticeUpdateData(ad, now)
      });

      summary.sent += 1;
      summary.results.push({
        adId: ad.id,
        title: ad.title,
        to,
        reminderType,
        status: "SENT"
      });
    } catch (error) {
      summary.failed += 1;
      summary.results.push({
        adId: ad.id,
        title: ad.title,
        to,
        reminderType,
        status: "FAILED",
        reason: error instanceof Error ? error.message.slice(0, 500) : String(error).slice(0, 500)
      });
    }
  }

  summary.finishedAt = new Date().toISOString();
  return summary;
}
