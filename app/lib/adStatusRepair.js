export async function reactivateFutureDatedExpiredAds(db) {
  const now = new Date();

  try {
    await db.ad.updateMany({
      where: {
        status: "EXPIRED",
        expiresAt: {
          gt: now
        }
      },
      data: {
        status: "ACTIVE",
        approvedAt: now,
        expiryNoticeSentAt: null,
        renewalNoticeSentAt: null,
        followUpNoticeSentAt: null
      }
    });
  } catch (error) {
    console.error("Future-dated expired ad repair failed:", error);
  }
}
