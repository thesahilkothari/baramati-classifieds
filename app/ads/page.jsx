import Link from "next/link";
import SearchBar from "../components/SearchBar";
import AdCard from "../components/AdCard";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Classified Ads Board | My Classifieds",
  description:
    "Browse newspaper-style classified ads for Baramati and Maharashtra."
};

function groupAdsByCategory(ads) {
  return ads.reduce((groups, ad) => {
    const categoryName = ad.category?.nameEn || "Other Classifieds";

    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }

    groups[categoryName].push(ad);
    return groups;
  }, {});
}

export default async function AdsPage({ searchParams }) {
  const params = await searchParams;

  const q = params?.q?.trim() || "";
  const city = params?.city?.trim() || "";
  const category = params?.category?.trim() || "";

  let ads = [];
  let categories = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { nameEn: "asc" }
    });

    ads = await prisma.ad.findMany({
      where: {
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
      },
      include: {
        category: true,
        city: true
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 200
    });
  } catch (error) {
    console.error("Classified board fetch failed:", error);
  }

  const groupedAds = groupAdsByCategory(ads);
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
                Good-old newspaper classifieds, now on every mobile phone.
              </p>
            </div>

            <div className="rounded-xl border-2 border-slate-900 bg-yellow-300 px-4 py-3 text-center">
              <p className="text-xs font-black uppercase">Today&apos;s Issue</p>
              <p className="text-sm font-black">{today}</p>
            </div>
          </div>

          <div className="mt-5">
            <SearchBar />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/ads"
              className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase text-white"
            >
              All
            </Link>

            {categories.map((item) => (
              <Link
                key={item.id}
                href={`/ads?category=${item.slug}`}
                className="rounded-full border bg-white px-4 py-2 text-xs font-black uppercase text-slate-800 hover:bg-blue-50"
              >
                {item.nameEn}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 md:px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black uppercase text-slate-700">
            {ads.length} Active Classifieds
          </p>

          <Link
            href="/post-ad"
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase text-white shadow hover:bg-red-700"
          >
            Place Your Ad
          </Link>
        </div>

        {ads.length === 0 ? (
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
            {Object.entries(groupedAds).map(([categoryName, categoryAds]) => (
              <section
                key={categoryName}
                className="rounded-2xl border-2 border-slate-900 bg-white p-3 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-3 border-b-2 border-slate-900 pb-2">
                  <h2 className="text-xl font-black uppercase text-slate-950">
                    {categoryName}
                  </h2>

                  <span className="rounded bg-slate-950 px-3 py-1 text-xs font-black text-white">
                    {categoryAds.length} Ads
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryAds.map((ad, index) => (
                    <AdCard key={ad.id} ad={ad} index={index} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
