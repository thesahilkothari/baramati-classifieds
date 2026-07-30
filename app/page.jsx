import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "./lib/prisma";
import AdCard from "./components/AdCard";
import BrandHeroGraphic from "./components/BrandHeroGraphic";
import BrandLogo from "./components/BrandLogo";
import JsonLd from "./components/JsonLd";
import { getLanguageFromCookieStore, t } from "./lib/i18n";
import {
  APPROVED_LOCATION_COUNT,
  getAllowedAdCityWhere,
  getAllowedTier2CitySearchOptions
} from "./lib/locations";
import { buildOrganizationSchema, buildWebSiteSchema } from "./lib/jsonLd";

export const dynamic = "force-dynamic";

const cityUtilityHighlights = [
  {
    title: "Affordable local advertising",
    text:
      "A practical alternative for smaller Maharashtra cities where newspaper, weekly or fortnightly classifieds may be costly for ordinary users and small businesses.",
    href: "/about"
  },
  {
    title: "Local yellow-page utility",
    text:
      "Find and post local needs across property, jobs, vehicles, services, freelancers, professionals, goods and everyday city opportunities.",
    href: "/ads"
  },
  {
    title: "Built for tier-II and tier-III users",
    text:
      "Fast, plain-text, mobile-first classifieds for Maharashtra cities and towns outside the Mumbai-Pune-Nagpur metro-first focus.",
    href: "/post-ad"
  }
];

const useCases = [
  "Property sale / rent",
  "Vehicles",
  "Furniture",
  "Electronics",
  "Jobs",
  "Electricians",
  "Plumbers",
  "Carpenters",
  "Tutors",
  "Drivers",
  "Contractors",
  "Freelancers",
  "Doctors",
  "Lawyers",
  "CAs",
  "Architects",
  "Caregivers",
  "Transporters",
  "Packers & Movers",
  "Agriculture Equipment"
];

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
  const allowedCityWhere = getAllowedAdCityWhere();

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
          allowedCityWhere,
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
        AND: [
          { status: "ACTIVE" },
          allowedCityWhere,
          { adType: "PREMIUM" },
          activeExpiryFilter
        ]
      },
      include,
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.ad.findMany({
      where: {
        AND: [
          { status: "ACTIVE" },
          allowedCityWhere,
          { adType: "PAID" },
          activeExpiryFilter
        ]
      },
      include,
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.ad.findMany({
      where: {
        AND: [
          { status: "ACTIVE" },
          allowedCityWhere,
          { adType: "FREE" },
          activeExpiryFilter
        ]
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
    getAllowedTier2CitySearchOptions()
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
          <div className="overflow-visible rounded-[2rem] border border-[#CBD5E1] bg-white shadow-sm">
            <div className="border-b border-[#CBD5E1] bg-white px-4 py-5 sm:px-6 md:py-6">
              <Link
                href="/"
                className="mx-auto flex w-full max-w-[620px] items-center justify-center overflow-visible rounded-[1.75rem] bg-white px-3 py-3"
                aria-label="My Classifieds home"
              >
                <BrandLogo />
              </Link>
            </div>

            <div className="grid items-start gap-6 p-4 md:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.88fr)] lg:p-8">
              <div className="min-w-0">
                <p className="text-sm font-black uppercase tracking-wide text-[#C2410C]">
                  For tier-II and tier-III cities and towns of Maharashtra
                </p>

                <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-[#0F3D5E] sm:text-4xl md:text-5xl">
                  Affordable online classifieds for local city needs
                </h1>

                <p className="mt-5 max-w-3xl text-base leading-8 text-[#475569]">
                  A city-focused digital yellow page for {APPROVED_LOCATION_COUNT} selected Maharashtra cities and towns: post free classified ads, find property, jobs, vehicles, goods, local services and professionals, and connect with nearby people without depending only on costly newspaper classifieds.
                </p>

                <form
                  action="/ads"
                  className="mt-6 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-sm"
                >
                  <div className="grid gap-3 xl:grid-cols-[1.2fr_0.9fr_0.9fr_auto]">
                    <label className="sr-only" htmlFor="home-search-keyword">
                      Search keyword
                    </label>
                    <input
                      id="home-search-keyword"
                      name="q"
                      placeholder="Search property, jobs, services, vehicles..."
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
                      <option value="">All Approved Locations</option>
                      {cities.map((city) => (
                        <option key={city.slug} value={city.slug}>
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
                    href="/about"
                    className="rounded-xl border border-[#CBD5E1] bg-white px-6 py-4 text-center text-sm font-black uppercase text-[#0F3D5E] hover:bg-slate-50"
                  >
                    Why My Classifieds?
                  </Link>
                </div>
              </div>

              <div className="min-w-0 space-y-4">
                <BrandHeroGraphic />

                <div className="rounded-2xl border border-[#CBD5E1] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-black uppercase tracking-wide text-[#0F766E]">
                      Available in selected Maharashtra cities & towns
                    </p>
                    <p className="rounded-full bg-[#F8FAFC] px-3 py-1 text-[11px] font-black uppercase text-[#0F3D5E]">
                      {APPROVED_LOCATION_COUNT} locations
                    </p>
                  </div>

                  <div className="mt-3 max-h-40 overflow-y-auto pr-1 md:max-h-52">
                    <div className="flex flex-wrap gap-2">
                      {cities.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/ads?city=${city.slug}`}
                          className="rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-black uppercase text-[#475569] hover:border-[#0F3D5E] hover:text-[#0F3D5E]"
                        >
                          {city.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] font-semibold leading-5 text-[#475569]">
                    Mumbai, Pune, Nagpur and similar metro-first locations are intentionally outside the current launch focus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            {cityUtilityHighlights.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="text-lg font-black uppercase text-[#0F172A]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#475569]">
                  {item.text}
                </p>
              </Link>
            ))}
          </section>

          <section className="mt-8 rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#0F766E]">
                  Local city directory
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
                  Use it like an affordable online yellow page
                </h2>
              </div>
              <Link href="/ads" className="text-sm font-black uppercase text-[#0F3D5E]">
                Browse all ads
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {useCases.map((useCase) => (
                <span
                  key={useCase}
                  className="rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-black uppercase text-[#475569]"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </section>

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
