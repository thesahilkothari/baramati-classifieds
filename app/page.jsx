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
import { buildPageMetadata } from "./lib/seo";
import {
  BRAND_SCOPE_EN,
  BRAND_SIGNATURE_EN,
  BRAND_SIGNATURE_MR,
  HOME_CATEGORY_MICROCOPY
} from "./lib/brandCopy";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Classified Ads in Baramati: Property, Jobs & Services | My Classifieds",
  description:
    "Post and browse local classified advertisements for property, jobs, vehicles, agriculture, education, services and business opportunities in Baramati and across Maharashtra.",
  path: "/"
});

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

      <main className="bg-[#F8FAFC] px-3 pb-24 pt-4 md:px-4 md:pb-10">
        <section className="mx-auto max-w-7xl">
          <div className="overflow-visible rounded-[1.6rem] border border-[#CBD5E1] bg-white shadow-sm">
            <div className="grid items-start gap-4 p-4 md:p-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.82fr)] lg:p-6">
              <div className="min-w-0">
                <Link
                  href="/"
                  className="mb-3 inline-flex max-w-full items-center justify-center overflow-visible rounded-2xl border border-[#CBD5E1] bg-white px-3 py-2 shadow-sm"
                  aria-label="My Classifieds home"
                >
                  <BrandLogo />
                </Link>

                <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
                  Baramati’s local classifieds • {BRAND_SCOPE_EN}
                </p>

                <h1 className="mt-2 max-w-4xl text-2xl font-black leading-tight text-[#0F3D5E] sm:text-3xl md:text-4xl">
                  Baramati’s everyday opportunities, all in one local place.
                </h1>

                <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-[#0F766E] md:text-base">
                  बारामतीच्या रोजच्या गरजा आणि संधी—आता एकाच स्थानिक ठिकाणी.
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#475569] md:text-base">
                  Find property, jobs, vehicles, agriculture needs, education, local services and business opportunities—or post your own advertisement and connect directly with interested people.
                </p>

                <form
                  action="/ads"
                  className="mt-4 overflow-visible rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-sm"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-black text-[#0F172A]">
                      Search local advertisements
                    </p>
                    <p className="text-[11px] font-black uppercase text-[#475569]">
                      {APPROVED_LOCATION_COUNT} approved locations
                    </p>
                  </div>

                  <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.15fr)_minmax(170px,0.8fr)_minmax(260px,1fr)_auto]">
                    <label className="sr-only" htmlFor="home-search-keyword">
                      Search keyword
                    </label>
                    <input
                      id="home-search-keyword"
                      name="q"
                      placeholder="Jobs, property, services, vehicles…"
                      className="min-h-12 w-full min-w-0 rounded-xl border border-[#64748B] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                    />

                    <label className="sr-only" htmlFor="home-search-category">
                      Category
                    </label>
                    <select
                      id="home-search-category"
                      name="category"
                      className="min-h-12 w-full min-w-0 rounded-xl border border-[#64748B] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
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
                      className="min-h-12 w-full min-w-[220px] rounded-xl border border-[#64748B] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 md:min-w-0 xl:min-w-[260px]"
                    >
                      <option value="">All Maharashtra Locations</option>
                      {cities.map((city) => (
                        <option key={city.slug} value={city.slug}>
                          {city.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="min-h-12 rounded-xl bg-[#0F3D5E] px-6 py-3 text-sm font-black uppercase text-white hover:bg-[#0B2F49] md:col-span-2 xl:col-span-1"
                    >
                      Search
                    </button>
                  </div>
                </form>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/post-ad"
                    className="rounded-xl bg-[#C2410C] px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-orange-800"
                  >
                    Post an Advertisement
                  </Link>

                  <Link
                    href="/ads"
                    className="rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-center text-sm font-black uppercase text-[#0F3D5E] hover:bg-slate-50"
                  >
                    Browse Local Ads
                  </Link>
                </div>
              </div>

              <div className="hidden min-w-0 lg:block">
                <BrandHeroGraphic />
              </div>
            </div>
          </div>

          <section className="mt-4 rounded-2xl border border-[#CBD5E1] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#0F766E]">
                  Explore advertisements by category
                </p>
                <p className="mt-1 text-sm leading-6 text-[#475569]">
                  Quick category shortcuts without pushing the classifieds too far down.
                </p>
              </div>
              <Link href="/ads" className="text-sm font-black uppercase text-[#0F3D5E]">
                Browse all
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {HOME_CATEGORY_MICROCOPY.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  title={item.text}
                  className="rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-black uppercase text-[#475569] hover:border-[#0F3D5E] hover:bg-white hover:text-[#0F3D5E]"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>

          {featuredAds.length > 0 && (
            <section className="mt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
                    {t(language, "featuredClassifieds")}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#475569]">
                    Paid placement can improve visibility, but it is not verification or endorsement.
                  </p>
                </div>

                <Link href="/ads" className="text-sm font-black uppercase text-[#0F3D5E]">
                  {t(language, "viewAllAds")}
                </Link>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featuredAds.slice(0, 4).map((ad) => (
                  <AdCard key={ad.id} ad={ad} language={language} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
                  Recently posted near you
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#475569]">
                  Fresh local advertisements from Baramati and other Maharashtra locations.
                </p>
              </div>

              <Link href="/ads" className="text-sm font-black uppercase text-[#0F3D5E]">
                {t(language, "viewAllAds")}
              </Link>
            </div>

            {latestAds.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-[#CBD5E1] bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-bold text-[#475569]">
                  Nothing matches your search yet. Be the first to post a relevant advertisement.
                </p>
                <Link
                  href="/post-ad"
                  className="mt-5 inline-flex rounded-xl bg-[#C2410C] px-6 py-3 text-sm font-black uppercase text-white"
                >
                  Post the First Ad
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {latestAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} language={language} />
                ))}
              </div>
            )}
          </section>

          <section className="mt-6 rounded-2xl border border-[#CBD5E1] bg-white p-4 text-sm leading-7 text-[#475569] shadow-sm">
            <p className="font-black uppercase text-[#0F3D5E]">
              {BRAND_SIGNATURE_MR} / {BRAND_SIGNATURE_EN}
            </p>
            <p className="mt-2">
              Connect directly, but verify the advertiser, item, service, documents and payment terms yourself. Never share an OTP, UPI PIN or banking password.
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
