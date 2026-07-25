import Link from "next/link";
import SearchBar from "../components/SearchBar";
import CategoryChips from "../components/CategoryChips";
import AdCard from "../components/AdCard";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

function buildSearchConditions({ query, category }) {
  const conditions = [];

  if (query) {
    conditions.push({
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { address: { contains: query } }
      ]
    });
  }

  if (category) {
    conditions.push({ category: { slug: category } });
  }

  return conditions;
}

export default async function AdsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = String(resolvedSearchParams?.q || "").trim();
  const category = String(resolvedSearchParams?.category || "").trim();
  const now = new Date();

  const activeNotExpiredConditions = [
    { status: "ACTIVE" },
    { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
    ...buildSearchConditions({ query, category })
  ];

  const notCurrentlyFeaturedCondition = {
    OR: [
      { isFeatured: false },
      { featuredUntil: null },
      { featuredUntil: { lte: now } }
    ]
  };

  let categories = [];
  let featuredAds = [];
  let premiumAds = [];
  let paidAds = [];
  let freeAds = [];

  try {
    categories = await prisma.category.findMany({ orderBy: { nameEn: "asc" } });

    featuredAds = await prisma.ad.findMany({
      where: {
        AND: [
          ...activeNotExpiredConditions,
          { isFeatured: true },
          { featuredUntil: { gt: now } }
        ]
      },
      include: { category: true, city: true },
      orderBy: { createdAt: "desc" },
      take: 24
    });

    premiumAds = await prisma.ad.findMany({
      where: { AND: [...activeNotExpiredConditions, notCurrentlyFeaturedCondition, { adType: "PREMIUM" }] },
      include: { category: true, city: true },
      orderBy: { createdAt: "desc" },
      take: 60
    });

    paidAds = await prisma.ad.findMany({
      where: { AND: [...activeNotExpiredConditions, notCurrentlyFeaturedCondition, { adType: "PAID" }] },
      include: { category: true, city: true },
      orderBy: { createdAt: "desc" },
      take: 60
    });

    freeAds = await prisma.ad.findMany({
      where: { AND: [...activeNotExpiredConditions, notCurrentlyFeaturedCondition, { adType: "FREE" }] },
      include: { category: true, city: true },
      orderBy: { createdAt: "desc" },
      take: 100
    });
  } catch (error) {
    console.error("Ads page fetch failed:", error);
  }

  const latestClassifieds = [...premiumAds, ...paidAds, ...freeAds];
  const hasResults = featuredAds.length > 0 || latestClassifieds.length > 0;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-blue-700">Classified Board</p>
              <h1 className="mt-1 text-3xl font-black uppercase text-slate-950 md:text-4xl">Browse Classifieds</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">Find local listings across Baramati and Maharashtra.</p>
            </div>
            <Link href="/post-ad" className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-700">Place Classified</Link>
          </div>
          <div className="mt-5">
            <SearchBar />
            <CategoryChips categories={categories} />
          </div>
        </div>

        {featuredAds.length > 0 && (
          <section className="mt-6 rounded-2xl border-2 border-orange-500 bg-white p-3 shadow-sm">
            <div className="mb-3 border-b-2 border-orange-500 pb-2">
              <p className="text-xs font-black uppercase text-orange-600">Highlighted Listings</p>
              <h2 className="text-xl font-black uppercase text-slate-950">Featured Classifieds</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredAds.map((ad, index) => <AdCard key={ad.id} ad={ad} index={index} />)}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border-2 border-slate-900 bg-white p-3 shadow-sm">
          <div className="mb-3 border-b-2 border-slate-900 pb-2">
            <h2 className="text-xl font-black uppercase text-slate-950">Latest Classifieds</h2>
          </div>

          {!hasResults ? (
            <div className="rounded-xl border-2 border-dashed bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-black text-slate-900">No matching classifieds found</h3>
              <p className="mt-2 text-slate-600">Try another search or category.</p>
            </div>
          ) : latestClassifieds.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-6 text-center text-slate-600">No more classifieds to show.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {latestClassifieds.map((ad, index) => <AdCard key={ad.id} ad={ad} index={index} />)}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
