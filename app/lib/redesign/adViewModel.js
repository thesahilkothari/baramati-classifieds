export function formatIndianPrice(price, language = "en") {
  if (!price) return language === "mr" ? "किंमत विचारा" : "Price on request";

  const amount = Number(price);
  if (!Number.isFinite(amount)) return language === "mr" ? "किंमत विचारा" : "Price on request";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPostedAgo(value) {
  if (!value) return "";

  const postedAt = new Date(value);
  if (Number.isNaN(postedAt.getTime())) return "";

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - postedAt.getTime());
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;

  return postedAt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short"
  });
}

export function hasLiveFeaturedPlacement(ad, now = new Date()) {
  if (!ad?.isFeatured) return false;
  if (!ad?.featuredUntil) return true;

  return new Date(ad.featuredUntil) > now;
}

export function getHomepageRank(ad, now = new Date()) {
  const liveFeatured = hasLiveFeaturedPlacement(ad, now);

  if (liveFeatured && ad?.adType !== "FEATURED") return 1;
  if (ad?.adType === "FEATURED") return 2;
  if (ad?.adType === "PREMIUM") return 3;
  if (ad?.adType === "PAID") return 4;
  if (ad?.adType === "FREE") return 5;

  return 6;
}

export function sortAdsForHomepage(ads, now = new Date()) {
  return [...ads].sort((a, b) => {
    const rankDiff = getHomepageRank(a, now) - getHomepageRank(b, now);
    if (rankDiff !== 0) return rankDiff;

    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

export function mapAdToCard(ad, language = "en") {
  const categoryName =
    language === "mr" ? ad?.category?.nameMr || ad?.category?.nameEn : ad?.category?.nameEn;

  return {
    id: ad?.id,
    title: ad?.title || "Untitled advertisement",
    href: `/ads/${ad?.slug}`,
    price: formatIndianPrice(ad?.price, language),
    location: ad?.city?.name || ad?.address || "Location not specified",
    category: categoryName || "Classified",
    categorySlug: ad?.category?.slug || "classified",
    postedAgo: formatPostedAgo(ad?.createdAt),
    imageUrl: ad?.images?.[0]?.url || null,
    isFeatured: hasLiveFeaturedPlacement(ad),
    isBusinessAnnual: ad?.adType === "FEATURED",
    isPremium: ad?.adType === "PREMIUM",
    isVerified: Boolean(ad?.user?.isVerified),
    description: ad?.description || ""
  };
}
