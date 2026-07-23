import Link from "next/link";
import SearchBar from "../components/SearchBar";
import AdCard from "../components/AdCard";
import CategoryChips from "../components/CategoryChips";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Classified Ads Board | My Classifieds",
  description:
    "Browse newspaper-style classified ads for Baramati and Maharashtra."
};

function buildCommonWhere({ q, city, category }) {
  return {
    status: "ACTIVE",
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { address: { contains: q } }
          ]
        }
      : {}),
    ...(city
      ? {
          city: {
            slug: city
          }
        }
      : {}),
    ...(category
      ? {
          category: {
            slug: category
          }
        }
      : {})
  };
}

function ClassifiedSection({ title, label, borderClass, ads }) {
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

export default async function AdsPage({ searchParams }) {
  const params = await searchParams;

  const q = params?.q?.trim() || "";
  const city = params?.city?.trim() || "";
  const category = params?.category?.trim() || "";

  let categories = [];
  let premiumAds = [];
  let featuredAds = [];
  let paidAds = [];
  let freeAds = [];

  const commonWhere = buildCommonWhere({ q, city, category });

  try {
    categories = await prisma.category.findMany({
      orderBy: { nameEn: "asc" }
    });

    premiumAds = await prisma.ad.findMany({
      where: {
        ...commonWhere,
        adType: "PREMIUM"
      },
      include: {
        category: true,
        city: true
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    featuredAds = await prisma.ad.findMany({
      where: {
        ...commonWhere,
        adType: "FEATURED"
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
        ...commonWhere,
        adType: "FREE",
        payments: {
          some: {
            status: "PAID"
          }
        }
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
        ...commonWhere,
        adType: "FREE",
        payments: {
          none: {
            status: "PAID"
          }
        }
      },
      include: {
        category: true,
        city: true
      },
      orderBy: { createdAt: "desc" },
      take: 200
    });
  } catch (error) {
    console.error("Classified board fetch failed:", error);
  }

  const totalAds =
    premiumAds.length + featuredAds.length + paidAds.length + freeAds.length;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <main className="bg-slate-100">
      <section className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-red-600">
                Baramati Local Classifieds
              </p>

              <h1 className="text-3xl font-black uppercase text-slate-950 md:text-5xl">
                My Classifieds Board
              </h1>

              <p className="mt-1 text-sm font-semibold text-slate-600">
                Newspaper-style local classifieds on mobile.
              </p>
            </div>

            <div className="rounded-xl border-2 border-slate-900 bg-yellow-300 px-4 py-3 text-center">
              <p className="text-xs font-black uppercase">Today&apos;s Issue</p>
              <p className="text-sm font-black">{today}</p>
            </div>
          </div>

          <div className="mt-5">
            <SearchBar />
            <CategoryChips categories={categories} />
          </div>
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
            Place Your Ad
          </Link>
        </div>

        {totalAds === 0 ? (
          <div className="rounded-2xl border-2 border-dashed bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-slate-900">
              No classifieds published yet
            </h2>

            <p className="mt-3 text-slate-600">
              Post an ad and approve it from admin panel to publish it here.
            </p>

            <Link
              href="/post-ad"
              className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white"
            >
              Post First Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <ClassifiedSection
              title="Premium Classifieds"
              label="Top Priority"
              borderClass="border-red-600"
              ads={premiumAds}
            />

            <ClassifiedSection
              title="Featured Classifieds"
              label="Highlighted"
              borderClass="border-orange-500"
              ads={featuredAds}
            />

            <ClassifiedSection
              title="Paid Classifieds"
              label="Promoted"
              borderClass="border-blue-700"
              ads={paidAds}
            />

            <ClassifiedSection
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
