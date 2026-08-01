import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import AdCard from "../components/AdCard";
import AdSearchFilters from "../components/AdSearchFilters";
import JsonLd from "../components/JsonLd";
import { getLanguageFromCookieStore } from "../lib/i18n";
import {
  ALLOWED_TIER2_LOCATION_SLUGS,
  getAllowedAdCityWhere,
  getAllowedTier2Cities,
  isAllowedTier2LocationSlug
} from "../lib/locations";
import { buildPageMetadata } from "../lib/seo";
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildItemListSchema } from "../lib/jsonLd";

export const dynamic = "force-dynamic";
export const metadata = buildPageMetadata({
  title: "Browse Local Classified Ads in Baramati | My Classifieds",
  description:
    "Search local advertisements by keyword, category and location. Contact the advertiser directly after checking the details.",
  path: "/ads"
});

function getNumericValue(value) {
  const cleaned = String(value || "").replace(/[^\d.]/g, "");
  if (!cleaned) return null;

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function getPostedDate(posted) {
  const now = new Date();

  if (posted === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (posted === "7days") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (posted === "30days") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return null;
}

function getConditionKeywords(condition) {
  if (condition === "NEW") return ["new", "brand new", "unused"];
  if (condition === "USED") return ["used", "second hand", "pre owned", "pre-owned"];
  if (condition === "LIKE_NEW") return ["like new", "excellent", "mint condition"];
  return [];
}

function uniqueAds(ads) {
  const seen = new Set();
  const result = [];

  for (const ad of ads) {
    if (!seen.has(ad.id)) {
      seen.add(ad.id);
      result.push(ad);
    }
  }

  return result;
}

function buildBaseWhere({ searchParams, now }) {
  const q = String(searchParams.q || "").trim();
  const category = String(searchParams.category || "").trim();
  const requestedCity = String(searchParams.city || "").trim();
  const city = isAllowedTier2LocationSlug(requestedCity) ? requestedCity : "";
  const condition = String(searchParams.condition || "").trim();
  const posted = String(searchParams.posted || "").trim();
  const minPrice = getNumericValue(searchParams.minPrice);
  const maxPrice = getNumericValue(searchParams.maxPrice);
  const postedDate = getPostedDate(posted);

  const andConditions = [
    { status: "ACTIVE" },
    getAllowedAdCityWhere(),
    { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }
  ];

  if (q) {
    andConditions.push({
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { address: { contains: q } },
        { category: { nameEn: { contains: q } } },
        { category: { nameMr: { contains: q } } },
        { city: { name: { contains: q } } }
      ]
    });
  }

  if (category) andConditions.push({ category: { slug: category } });
  if (city) andConditions.push({ city: { slug: city } });

  const conditionKeywords = getConditionKeywords(condition);
  if (conditionKeywords.length > 0) {
    andConditions.push({
      OR: conditionKeywords.flatMap((keyword) => [
        { title: { contains: keyword } },
        { description: { contains: keyword } }
      ])
    });
  }

  if (minPrice !== null || maxPrice !== null) {
    const priceFilter = {};
    if (minPrice !== null) priceFilter.gte = minPrice;
    if (maxPrice !== null) priceFilter.lte = maxPrice;
    andConditions.push({ price: priceFilter });
  }

  if (postedDate) {
    andConditions.push({ createdAt: { gte: postedDate } });
  }

  return { AND: andConditions };
}

async function fetchRankedAds(baseWhere, now) {
  const include = {
    category: true,
    city: true,
    user: { select: { isVerified: true } }
  };

  const activeFeaturedFilter = { OR: [{ featuredUntil: null }, { featuredUntil: { gt: now } }] };

  const [regularFeaturedAds, businessAnnualAds, premiumAds, paidAds, freeAds] = await Promise.all([
    prisma.ad.findMany({
      where: {
        AND: [baseWhere, { isFeatured: true }, { adType: { not: "FEATURED" } }, activeFeaturedFilter]
      },
      include,
      orderBy: [{ createdAt: "desc" }],
      take: 80
    }),
    prisma.ad.findMany({
      where: {
        AND: [baseWhere, { adType: "FEATURED" }, { isFeatured: true }, activeFeaturedFilter]
      },
      include,
      orderBy: [{ createdAt: "desc" }],
      take: 80
    }),
    prisma.ad.findMany({
      where: {
        AND: [
          baseWhere,
          { adType: "PREMIUM" },
          { OR: [{ isFeatured: false }, { featuredUntil: null }, { featuredUntil: { lte: now } }] }
        ]
      },
      include,
      orderBy: [{ createdAt: "desc" }],
      take: 80
    }),
    prisma.ad.findMany({
      where: {
        AND: [
          baseWhere,
          { adType: "PAID" },
          { OR: [{ isFeatured: false }, { featuredUntil: null }, { featuredUntil: { lte: now } }] }
        ]
      },
      include,
      orderBy: [{ createdAt: "desc" }],
      take: 80
    }),
    prisma.ad.findMany({
      where: { AND: [baseWhere, { adType: "FREE" }] },
      include,
      orderBy: [{ createdAt: "desc" }],
      take: 120
    })
  ]);

  return {
    allAds: uniqueAds([
      ...regularFeaturedAds,
      ...businessAnnualAds,
      ...premiumAds,
      ...paidAds,
      ...freeAds
    ])
  };
}

export default async function AdsPage({ searchParams }) {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const resolvedSearchParams = await searchParams;
  const now = new Date();

  const [categories, cities] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
    getAllowedTier2Cities(prisma)
  ]);

  const baseWhere = buildBaseWhere({ searchParams: resolvedSearchParams || {}, now });
  const { allAds } = await fetchRankedAds(baseWhere, now);
  const resultLabel = allAds.length === 1 ? "1 advertisement found" : `${allAds.length} local advertisements found`;

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Browse Ads", path: "/ads" }
          ]),
          buildCollectionPageSchema({
            title: "Find what Baramati is offering today | My Classifieds",
            description:
              "Search local advertisements by keyword, category and location. Contact the advertiser directly after checking the details.",
            path: "/ads"
          }),
          buildItemListSchema(allAds)
        ]}
      />

      <main className="min-h-screen bg-[#F8FAFC] px-3 pb-24 pt-5 md:px-4 md:pb-8">
        <section className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">Browse Local Ads</p>
                <h1 className="mt-2 text-3xl font-black leading-tight text-[#0F3D5E] md:text-5xl">
                  Find what Baramati is offering today
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#475569] md:text-base">
                  Search local advertisements by keyword, category and location. Contact the advertiser directly after checking the details.
                </p>
                <p className="mt-2 max-w-3xl text-xs font-bold uppercase leading-5 text-[#475569]">
                  Built for Baramati. Open across Maharashtra. Current coverage: {ALLOWED_TIER2_LOCATION_SLUGS.length} approved local locations.
                </p>
              </div>
              <Link
                href="/post-ad"
                className="hidden rounded-xl bg-[#C2410C] px-5 py-3 text-sm font-black uppercase text-white hover:bg-orange-800 md:inline-flex"
              >
                Post My Requirement
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <AdSearchFilters categories={categories} cities={cities} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-[#475569]">{resultLabel}</p>
            <p className="text-xs font-bold uppercase text-[#475569]">
              Regular Featured ads appear first; Business Annual featured ads appear next. Paid visibility never means endorsement or verification.
            </p>
          </div>

          {allAds.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-[#CBD5E1] bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-black text-[#0F172A]">No advertisements match these filters</h2>
              <p className="mt-2 text-[#475569]">
                Try a nearby location or broader category. If you need something specific, you can also post a requirement advertisement.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/ads" className="inline-flex justify-center rounded-xl bg-[#0F3D5E] px-5 py-3 text-sm font-black uppercase text-white">
                  Clear Filters
                </Link>
                <Link href="/post-ad" className="inline-flex justify-center rounded-xl bg-[#C2410C] px-5 py-3 text-sm font-black uppercase text-white">
                  Post My Requirement
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} language={language} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
