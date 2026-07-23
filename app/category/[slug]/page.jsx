import Link from "next/link";
import { notFound } from "next/navigation";
import AdCard from "../../components/AdCard";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

function formatSlug(slug) {
  return slug
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function buildCategoryConditions({ categoryId, now }) {
  return [
    { status: "ACTIVE" },
    { categoryId },
    {
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } }
      ]
    }
  ];
}

function CategoryAdSection({ title, label, borderClass, ads }) {
  if (!ads.length) {
    return null;
  }

  return (
    <section className={`rounded-2xl border-2 bg-white p-3 shadow-sm ${borderClass}`}>
      <div className="mb-3 flex items-center justify-between gap-3 border-b-2 border-slate-900 pb-2">
        <div>
          {label && (
            <p className="text-xs font-black uppercase text-red-600">
              {label}
            </p>
          )}

          <h2 className="text-xl font-black uppercase text-slate-950">
            {title}
          </h2>
        </div>

        <span className="rounded bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">
          {ads.length} Ads
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ads.map((ad, index) => (
          <AdCard key={ad.id} ad={ad} index={index} />
        ))}
      </div>
    </section>
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return {
    title: `${formatSlug(slug)} Ads | My Classifieds`,
    description: `Browse ${formatSlug(slug)} classified ads in Baramati and Maharashtra.`
  };
}

export default async function CategoryPage({ params }) {
  const now = new Date();
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let category = null;
  let premiumAds = [];
  let featuredAds = [];
  let paidAds = [];
  let freeAds = [];

  try {
    category = await prisma.category.findUnique({
      where: { slug }
    });

    if (!category) {
      notFound();
    }

    const categoryConditions = buildCategoryConditions({
      categoryId: category.id,
      now
    });

    premiumAds = await prisma.ad.findMany({
      where: {
        AND: [
          ...categoryConditions,
          { adType: "PREMIUM" }
        ]
      },
      include: {
        category: true,
        city: true
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 100
    });

    featuredAds = await prisma.ad.findMany({
      where: {
        AND: [
          ...categoryConditions,
          { isFeatured: true },
          { featuredUntil: { gt: now } },
          { adType: { not: "PREMIUM" } }
        ]
      },
      include: {
        category: true,
        city: true
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    paidAds = await prisma.ad.findMany({
      where: {
        AND: [
          ...categoryConditions,
          { adType: "PAID" },
          {
            OR: [
              { featuredUntil: null },
              { featuredUntil: { lte: now } }
            ]
          }
        ]
      },
      include: {
        category: true,
        city: true
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    freeAds = await prisma.ad.findMany({
      where: {
        AND: [
          ...categoryConditions,
          { adType: "FREE" }
        ]
      },
      include: {
        category: true,
        city: true
      },
      orderBy: { createdAt: "desc" },
      take: 200
    });
  } catch (error) {
    console.error("Category page fetch failed:", error);
  }

  const categoryName = category?.nameEn || formatSlug(slug);
  const categoryNameMr = category?.nameMr || "";

  const totalAds =
    premiumAds.length + featuredAds.length + paidAds.length + freeAds.length;

  return (
    <main className="bg-slate-100">
      <section className="bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/ads" className="text-sm font-semibold text-blue-300">
            ← Back to Classified Board
          </Link>

          <h1 className="mt-4 text-4xl font-black uppercase">
            {categoryName}
          </h1>

          {categoryNameMr && (
            <p className="mt-2 text-xl font-semibold text-blue-200">
              {categoryNameMr}
            </p>
          )}

          <p className="mt-3 max-w-2xl text-slate-300">
            Active non-expired classified ads in this category.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 md:px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black uppercase text-slate-700">
            {totalAds} Active Classifieds
          </p>

          <Link
            href="/post-ad"
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase text-white shadow hover:bg-red-700"
          >
            Place Ad in this Category
          </Link>
        </div>

        {totalAds === 0 ? (
          <div className="rounded-2xl border-2 border-dashed bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-slate-900">
              No active classifieds found
            </h2>

            <p className="mt-3 text-slate-600">
              There are no active non-expired ads in this category yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <CategoryAdSection
              title="Premium Classifieds"
              label="Top Priority"
              borderClass="border-red-600"
              ads={premiumAds}
            />

            <CategoryAdSection
              title="Featured Classifieds"
              label="Highlighted"
              borderClass="border-orange-500"
              ads={featuredAds}
            />

            <CategoryAdSection
              title="Paid Classifieds"
              label="Promoted"
              borderClass="border-blue-700"
              ads={paidAds}
            />

            <CategoryAdSection
              title="Free Classifieds"
              borderClass="border-slate-900"
              ads={freeAds}
            />
          </div>
        )}
      </section>
    </main>
  );
}
