import { prisma } from "./lib/prisma";
import { absoluteUrl } from "./lib/seo";
import { landingPageSitemapRoutes } from "./lib/seoLandingPages";

export const dynamic = "force-dynamic";

function sitemapEntry(path, priority = 0.7, changeFrequency = "weekly", lastModified = new Date()) {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority
  };
}

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    sitemapEntry("/", 1, "daily", now),
    sitemapEntry("/ads", 0.95, "daily", now),
    sitemapEntry("/post-ad", 0.85, "weekly", now),
    sitemapEntry("/pricing", 0.8, "monthly", now),
    sitemapEntry("/support", 0.75, "monthly", now),
    sitemapEntry("/about", 0.7, "monthly", now),
    ...landingPageSitemapRoutes.map((path) =>
      sitemapEntry(path, 0.76, "daily", now)
    ),
    sitemapEntry("/legal", 0.5, "monthly", now),
    sitemapEntry("/legal/terms", 0.4, "monthly", now),
    sitemapEntry("/legal/privacy", 0.4, "monthly", now),
    sitemapEntry("/legal/listing-rules", 0.4, "monthly", now),
    sitemapEntry("/legal/advertiser-policy", 0.4, "monthly", now),
    sitemapEntry("/legal/grievance", 0.4, "monthly", now),
    sitemapEntry("/legal/refunds", 0.4, "monthly", now),
    sitemapEntry("/legal/safety", 0.4, "monthly", now),
    sitemapEntry("/legal/ip", 0.4, "monthly", now),
    sitemapEntry("/legal/ranking", 0.4, "monthly", now),
    sitemapEntry("/legal/ai-content", 0.4, "monthly", now),
    sitemapEntry("/legal/business-terms", 0.4, "monthly", now),
    sitemapEntry("/legal/corporate", 0.4, "monthly", now),
    sitemapEntry("/legal/accessibility", 0.4, "monthly", now)
  ];

  try {
    const [categories, ads] = await Promise.all([
      prisma.category.findMany({
        select: {
          slug: true
        }
      }),
      prisma.ad.findMany({
        where: {
          status: "ACTIVE",
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
        },
        select: {
          slug: true,
          updatedAt: true
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: 5000
      })
    ]);

    const categoryRoutes = categories.map((category) =>
      sitemapEntry(`/category/${category.slug}`, 0.72, "daily", now)
    );

    const adRoutes = ads.map((ad) =>
      sitemapEntry(`/ads/${ad.slug}`, 0.8, "daily", ad.updatedAt || now)
    );

    return [...staticRoutes, ...categoryRoutes, ...adRoutes];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return staticRoutes;
  }
}
