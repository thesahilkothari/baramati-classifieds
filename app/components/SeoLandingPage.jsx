import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import AdCard from "./AdCard";
import JsonLd from "./JsonLd";
import { getLanguageFromCookieStore } from "../lib/i18n";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema
} from "../lib/jsonLd";

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

function getBaseWhere(config, now) {
  const andConditions = [
    { status: "ACTIVE" },
    {
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
    },
    {
      category: {
        slug: config.categorySlug
      }
    }
  ];

  if (config.citySlug) {
    andConditions.push({
      city: {
        slug: config.citySlug
      }
    });
  }

  return {
    AND: andConditions
  };
}

async function fetchLandingAds(config) {
  const now = new Date();
  const baseWhere = getBaseWhere(config, now);
  const include = {
    category: true,
    city: true
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
      take: 12
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
      take: 12
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
      take: 12
    }),
    prisma.ad.findMany({
      where: {
        AND: [baseWhere, { adType: "FREE" }]
      },
      include,
      orderBy: [{ createdAt: "desc" }],
      take: 18
    })
  ]);

  return uniqueAds([...featuredAds, ...premiumAds, ...paidAds, ...freeAds]).slice(
    0,
    24
  );
}

export default async function SeoLandingPage({ config }) {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const ads = await fetchLandingAds(config);

  const structuredData = [
    buildBreadcrumbSchema(config.breadcrumb),
    buildCollectionPageSchema(config),
    buildItemListSchema(ads)
  ];

  return (
    <>
      <JsonLd data={structuredData} />

      <main className="min-h-screen bg-slate-100 px-3 pb-24 pt-5 md:px-4 md:pb-10">
        <section className="mx-auto max-w-7xl">
          <nav className="mb-4 flex flex-wrap gap-2 text-xs font-bold uppercase text-slate-500">
            {config.breadcrumb.map((item, index) => (
              <span key={item.path} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <Link href={item.path} className="hover:text-blue-700">
                  {item.name}
                </Link>
              </span>
            ))}
          </nav>

          <header className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-black uppercase tracking-wide text-red-600">
              {config.eyebrow}
            </p>

            <h1 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight text-slate-950 md:text-5xl">
              {config.h1}
            </h1>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {config.introEn}
              </p>

              <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {config.introMr}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm leading-7 text-yellow-900">
              {config.note}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={config.searchHref}
                className="rounded-xl bg-blue-700 px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-blue-800"
              >
                Browse Matching Ads
              </Link>

              <Link
                href="/post-ad"
                className="rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-red-700"
              >
                Post a Classified
              </Link>
            </div>
          </header>

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-black uppercase text-slate-950">
                Approved matching classifieds
              </h2>

              <Link
                href={config.searchHref}
                className="text-sm font-black uppercase text-blue-700"
              >
                View all filters
              </Link>
            </div>

            {ads.length === 0 ? (
              <div className="mt-5 rounded-3xl border bg-white p-8 text-center shadow-sm">
                <h3 className="text-2xl font-black text-slate-950">
                  No matching ads are live right now
                </h3>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  This page shows only approved and active classifieds. You can browse all ads or post a new classified for this category.
                </p>

                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href={config.searchHref}
                    className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-black uppercase text-white"
                  >
                    Browse Ads
                  </Link>

                  <Link
                    href="/post-ad"
                    className="rounded-xl border px-5 py-3 text-sm font-black uppercase text-slate-700"
                  >
                    Post Ad
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} language={language} />
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}
