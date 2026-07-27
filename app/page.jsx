import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "./lib/prisma";
import AdCard from "./components/AdCard";
import BrandHeroGraphic from "./components/BrandHeroGraphic";
import JsonLd from "./components/JsonLd";
import { getLanguageFromCookieStore, t } from "./lib/i18n";
import { buildOrganizationSchema, buildWebSiteSchema } from "./lib/jsonLd";

export const dynamic = "force-dynamic";

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

function getAdInclude() {
  return {
    category: true,
    city: true,
    user: {
      select: {
        isVerified: true
      }
    }
  };
}

async function getHomeAds() {
  const now = new Date();
  const include = getAdInclude();

  const activeExpiryFilter = {
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
  };

  const activeFeaturedFilter = {
    OR: [{ featuredUntil: null }, { featuredUntil: { gt: now } }]
  };

  const [featuredAds, premiumAds, paidAds, freeAds] = await Promise.all([
    prisma.ad.findMany({
      where: {
        AND: [
          { status: "ACTIVE" },
          { isFeatured: true },
          activeExpiryFilter,
          activeFeaturedFilter
        ]
      },
      include,
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "PREMIUM",
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
      },
      include,
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "PAID",
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
      },
      include,
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FREE",
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
      },
      include,
      orderBy: { createdAt: "desc" },
      take: 12
    })
  ]);

  return {
    featuredAds,
    latestAds: uniqueAds([...premiumAds, ...paidAds, ...freeAds])
      .filter((ad) => !featuredAds.some((featuredAd) => featuredAd.id === ad.id))
      .slice(0, 12)
  };
}

async function getHomeFilters() {
  return Promise.all([
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } })
  ]);
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const [{ featuredAds, latestAds }, [categories, cities]] = await Promise.all([
    getHomeAds(),
    getHomeFilters()
  ]);

  return (
    <>
      <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />

      <main className="bg-[#F8FAFC] px-3 pb-24 pt-5 md:px-4 md:pb-10">
        <section className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-[#CBD5E1] bg-white shadow-sm">
            <div className="grid gap-6 p-5 md:grid-cols-[1fr_0.92fr] md:p-8 lg:p-10">
              <div className="flex flex-col justify-center">
                <p className="text-sm font-black uppercase tracking-wide text-[#C2410C]">
                  Online Classifieds Platform
                </p>

                <h1 className="mt-3 text-4xl font-black leading-tight text-[#0F3D5E] md:text-6xl">
                  Buy, Sell, Rent & Find Jobs Across Baramati
                </h1>

                <p className="mt-5 max-w-3xl text-base leading-8 text-[#475569]">
                  Post and browse local classified ads for property, jobs, vehicles, electronics, agriculture equipment and local services across Baramati and Maharashtra.
                </p>

                <form
                  action="/ads"
                  className="mt-6 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-sm"
                >
                  <div className="grid gap-3 lg:grid-cols-[1.2fr_0.9fr_0.9fr_auto]">
                    <label className="sr-only" htmlFor="home-search-keyword">
                      Search keyword
                    </label>
                    <input
                      id="home-search-keyword"
                      name="q"
                      placeholder="Search anything..."
                      className="rounded-xl border border-[#64748B] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                    />

                    <label className="sr-only" htmlFor="home-search-category">
                      Category
                    </label>
                    <select
                      id="home-search-category"
                      name="category"
                      className="rounded-xl border border-[#64748B] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {language === "mr" ? category.nameMr || category.nameEn : category.nameEn}
                        </option>
                      ))}
                    </select>

                    <label className="sr-only" htmlFor="home-search-city">
                      Location
                    </label>
                    <select
                      id="home-search-city"
                      name="city"
                      defaultValue="baramati"
                      className="rounded-xl border border-[#64748B] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                    >
                      <option value="">All Locations</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.slug}>
                          {city.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="rounded-xl bg-[#0F3D5E] px-6 py-3 text-sm font-black uppercase text-white hover:bg-[#0B2F49]"
                    >
                      Search
                    </button>
                  </div>
                </form>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/post-ad"
                    className="rounded-xl bg-[#C2410C] px-6 py-4 text-center text-sm font-black uppercase text-white hover:bg-orange-800"
                  >
                    Post Free Ad
                  </Link>

                  <Link
                    href="/ads"
                    className="rounded-xl border border-[#CBD5E1] bg-white px-6 py-4 text-center text-sm font-black uppercase text-[#0F3D5E] hover:bg-slate-50"
                  >
                    {t(language, "startBrowsing")}
                  </Link>
                </div>
              </div>

              <BrandHeroGraphic />
            </div>
          </div>

          {featuredAds.length > 0 && (
            <section className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-3xl font-black uppercase text-[#0F172A]">
                  {t(language, "featuredClassifieds")}
                </h2>

                <Link href="/ads" className="text-sm font-black uppercase text-[#0F3D5E]">
                  {t(language, "viewAllAds")}
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featuredAds.slice(0, 4).map((ad) => (
                  <AdCard key={ad.id} ad={ad} language={language} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-3xl font-black uppercase text-[#0F172A]">
                {t(language, "latestClassifieds")}
              </h2>

              <Link href="/ads" className="text-sm font-black uppercase text-[#0F3D5E]">
                {t(language, "viewAllAds")}
              </Link>
            </div>

            {latestAds.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-[#CBD5E1] bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-bold text-[#475569]">
                  {t(language, "noAdsYet")}
                </p>
                <Link
                  href="/post-ad"
                  className="mt-5 inline-flex rounded-xl bg-[#C2410C] px-6 py-3 text-sm font-black uppercase text-white"
                >
                  {t(language, "placeClassified")}
                </Link>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {latestAds.map((ad) => (
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
