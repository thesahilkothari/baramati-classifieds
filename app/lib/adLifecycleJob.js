import { prisma } from "./prisma";
import { sendTransactionalEmail } from "./emailService";
import {
  buildAdExpiredEmail,
  buildFeaturedEndedEmail
} from "./adLifecycleEmails";

function getLifecycleBatchLimit() {
  const limit = Number(process.env.AD_LIFECYCLE_BATCH_LIMIT || 100);
  return Number.isFinite(limit) && limit > 0 ? Math.min(limit, 300) : 100;
}

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function getAdRecipientEmail(ad) {
  const email = cleanEmail(ad.user?.email);
  if (!email || !email.includes("@")) return null;
  return email;
}

async function expireAd({ ad, now, dryRun }) {
  const to = getAdRecipientEmail(ad);
  const result = {
    adId: ad.id,
    title: ad.title,
    lifecycleAction: "EXPIRE_AD",
    to,
    status: dryRun ? "DRY_RUN" : "PENDING"
  };

  if (!to) {
    if (!dryRun) {
      await prisma.ad.update({
        where: { id: ad.id },
        data: {
          status: "EXPIRED",
          isFeatured: false
        }
      });
    }

    return {
      ...result,
      status: dryRun ? "DRY_RUN_NO_EMAIL" : "UPDATED_NO_EMAIL",
      reason: "No valid user email found"
    };
  }

  const email = buildAdExpiredEmail(ad);

  if (dryRun) {
    return {
      ...result,
      status: "DRY_RUN",
      subject: email.subject,
      expiresAt: ad.expiresAt
    };
  }

  await sendTransactionalEmail({
    to,
    subject: email.subject,
    html: email.html,
    text: email.text
  });

  await prisma.ad.update({
    where: { id: ad.id },
    data: {
      status: "EXPIRED",
      isFeatured: false,
      followUpNoticeSentAt: now
    }
  });

  return {
    ...result,
    status: "SENT_AND_EXPIRED"
  };
}

async function endFeaturedPlacement({ ad, now, dryRun }) {
  const to = getAdRecipientEmail(ad);
  const result = {
    adId: ad.id,
    title: ad.title,
    lifecycleAction: "END_FEATURED_PLACEMENT",
    to,
    status: dryRun ? "DRY_RUN" : "PENDING"
  };

  if (!to) {
    if (!dryRun) {
      await prisma.ad.update({
        where: { id: ad.id },
        data: {
          isFeatured: false
        }
      });
    }

    return {
      ...result,
      status: dryRun ? "DRY_RUN_NO_EMAIL" : "UPDATED_NO_EMAIL",
      reason: "No valid user email found"
    };
  }

  const email = buildFeaturedEndedEmail(ad);

  if (dryRun) {
    return {
      ...result,
      status: "DRY_RUN",
      subject: email.subject,
      featuredUntil: ad.featuredUntil
    };
  }

  await sendTransactionalEmail({
    to,
    subject: email.subject,
    html: email.html,
    text: email.text
  });

  await prisma.ad.update({
    where: { id: ad.id },
    data: {
      isFeatured: false,
      followUpNoticeSentAt: now
    }
  });

  return {
    ...result,
    status: "SENT_AND_FEATURED_ENDED"
  };
}

async function fetchExpiredActiveAds({ now, limit }) {
  return prisma.ad.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: {
        not: null,
        lte: now
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
    take: limit
  });
}

async function fetchExpiredFeaturedAds({ now, limit }) {
  return prisma.ad.findMany({
    where: {
      status: "ACTIVE",
      isFeatured: true,
      featuredUntil: {
        not: null,
        lte: now
      },
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } }
      ]
    },
    include: {
      user: true,
      category: true,
      city: true
    },
    orderBy: {
      featuredUntil: "asc"
    },
    take: limit
  });
}

export async function runAdLifecycleJob({ dryRun = false } = {}) {
  const now = new Date();
  const limit = getLifecycleBatchLimit();
  const perBucketLimit = Math.max(10, Math.ceil(limit / 2));

  const [expiredAds, featuredEndedAds] = await Promise.all([
    fetchExpiredActiveAds({ now, limit: perBucketLimit }),
    fetchExpiredFeaturedAds({ now, limit: perBucketLimit })
  ]);

  const summary = {
    dryRun,
    startedAt: now.toISOString(),
    batchLimit: limit,
    expiredCandidates: expiredAds.length,
    featuredEndedCandidates: featuredEndedAds.length,
    expiredUpdated: 0,
    featuredUpdated: 0,
    emailsSent: 0,
    skipped: 0,
    failed: 0,
    results: []
  };

  for (const ad of expiredAds) {
    try {
      const result = await expireAd({ ad, now, dryRun });
      summary.results.push(result);

      if (!dryRun && ["SENT_AND_EXPIRED", "UPDATED_NO_EMAIL"].includes(result.status)) {
        summary.expiredUpdated += 1;
      }

      if (!dryRun && result.status === "SENT_AND_EXPIRED") {
        summary.emailsSent += 1;
      }

      if (result.status.includes("NO_EMAIL")) {
        summary.skipped += 1;
      }
    } catch (error) {
      summary.failed += 1;
      summary.results.push({
        adId: ad.id,
        title: ad.title,
        lifecycleAction: "EXPIRE_AD",
        status: "FAILED",
        reason: error instanceof Error ? error.message.slice(0, 500) : String(error).slice(0, 500)
      });
    }
  }

  for (const ad of featuredEndedAds) {
    try {
      const result = await endFeaturedPlacement({ ad, now, dryRun });
      summary.results.push(result);

      if (!dryRun && ["SENT_AND_FEATURED_ENDED", "UPDATED_NO_EMAIL"].includes(result.status)) {
        summary.featuredUpdated += 1;
      }

      if (!dryRun && result.status === "SENT_AND_FEATURED_ENDED") {
        summary.emailsSent += 1;
      }

      if (result.status.includes("NO_EMAIL")) {
        summary.skipped += 1;
      }
    } catch (error) {
      summary.failed += 1;
      summary.results.push({
        adId: ad.id,
        title: ad.title,
        lifecycleAction: "END_FEATURED_PLACEMENT",
        status: "FAILED",
        reason: error instanceof Error ? error.message.slice(0, 500) : String(error).slice(0, 500)
      });
    }
  }

  summary.finishedAt = new Date().toISOString();
  return summary;
}
