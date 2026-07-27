import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import AdCard from "../components/AdCard";
import AdSearchFilters from "../components/AdSearchFilters";
import JsonLd from "../components/JsonLd";
import { getLanguageFromCookieStore, t } from "../lib/i18n";
import { buildPageMetadata } from "../lib/seo";
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildItemListSchema } from "../lib/jsonLd";

export const dynamic = "force-dynamic";
export const metadata = buildPageMetadata({
  title: "Browse Classified Ads in Baramati | My Classifieds",
  description:
    "Browse property, jobs, vehicles, electronics, agriculture equipment and local service ads in Baramati and Maharashtra.",
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

  if (posted === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  if (posted === "7days") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  if (posted === "30days") {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

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
  const city = String(searchParams.city || "").trim();
  const condition = String(searchParams.condition || "").trim();
  const posted = String(searchParams.posted || "").trim();
  const minPrice = getNumericValue(searchParams.minPrice);
  const maxPrice = getNumericValue(searchParams.maxPrice);
  const postedDate = getPostedDate(posted);

  const andConditions = [
    { status: "ACTIVE" },
    {
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
    }
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

  if (category) {
    andConditions.push({
      category: {
        slug: category
      }
    });
  }

  if (city) {
    andConditions.push({
      city: {
        slug: city
      }
    });
  }

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
    andConditions.push({
      createdAt: {
        gte: postedDate
      }
    });
  }

  return {
    AND: andConditions
  };
}

async function fetchRankedAds(baseWhere, now) {
  const include = {
    category: true,
    city: true,
    user: {
      select: {
        isVerified: true
      }
    }
  };

  const [featuredAds, premiumAds, paidAds, freeAds] = await Promise.all([
    prisma.ad.findMany({
      where: {
        AND: [
          baseWhere,
          { isFeatured: true },
          {
            OR: [{ featuredUntil: null }, { featuredUntil: { gt: now } }]
          }
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
          { adType: "PREMIUM" },
          {
            OR: [
              { isFeatured: false },
              { featuredUntil: null },
              { featuredUntil: { lte: now } }
            ]
          }
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
          {
            OR: [
              { isFeatured: false },
              { featuredUntil: null },
              { featuredUntil: { lte: now } }
            ]
          }
        ]
      },
      include,
      orderBy: [{ createdAt: "desc" }],
      take: 80
    }),
    prisma.ad.findMany({
      where: {
        AND: [baseWhere, { adType: "FREE" }]
      },
      include,
      orderBy: [{ createdAt: "desc" }],
      take: 120
    })
  ]);

  return {
    featuredAds,
    allAds: uniqueAds([...featuredAds, ...premiumAds, ...paidAds, ...freeAds])
  };
}

export default async function AdsPage({ searchParams }) {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const resolvedSearchParams = await searchParams;
  const now = new Date();

  const [categories, cities] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } })
  ]);

  const baseWhere = buildBaseWhere({
    searchParams: resolvedSearchParams || {},
    now
  });

  const { allAds } = await fetchRankedAds(baseWhere, now);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Browse Ads", path: "/ads" }
          ]),
          buildCollectionPageSchema({
            title: "Browse Classified Ads in Baramati | My Classifieds",
            description:
              "Browse property, jobs, vehicles, electronics, agriculture equipment and local service ads in Baramati and Maharashtra.",
            path: "/ads"
          }),
          buildItemListSchema(allAds)
        ]}
      />

      <main className="min-h-screen bg-[#F8FAFC] px-3 pb-24 pt-5 md:px-4 md:pb-8">
        <section className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
                  Online Classifieds Platform
                </p>

                <h1 className="mt-2 text-3xl font-black uppercase text-[#0F3D5E] md:text-5xl">
                  {t(language, "browseAds")}
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#475569]">
                  {t(language, "findFaster")}. {t(language, "rankingNote")}.
                </p>
              </div>

              <Link
                href="/post-ad"
                className="hidden rounded-xl bg-[#C2410C] px-5 py-3 text-sm font-black uppercase text-white hover:bg-orange-800 md:inline-flex"
              >
                Post Free Ad
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <AdSearchFilters categories={categories} cities={cities} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-[#475569]">
              {t(language, "showingAds")} {allAds.length}{" "}
              {t(language, "activeClassifieds")}
            </p>

            <p className="text-xs font-bold uppercase text-[#475569]">
              {t(language, "rankingNote")}
            </p>
          </div>

          {allAds.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-[#CBD5E1] bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-black text-[#0F172A]">
                {t(language, "noMatchingAds")}
              </h2>
              <p className="mt-2 text-[#475569]">
                {t(language, "tryChangingFilters")}
              </p>
              <Link
                href="/ads"
                className="mt-5 inline-flex rounded-xl bg-[#0F3D5E] px-5 py-3 text-sm font-black uppercase text-white"
              >
                {t(language, "clearFilters")}
              </Link>
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
