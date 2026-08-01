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
  BRAND_FUNCTIONAL_PROMISE,
  BRAND_SCOPE_EN,
  BRAND_SCOPE_MR,
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

      <main className="bg-[#F8FAFC] px-3 pb-24 pt-5 md:px-4 md:pb-10">
        <section className="mx-auto max-w-7xl">
          <div className="mb-4 rounded-2xl border border-[#CBD5E1] bg-white px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-[#0F3D5E] shadow-sm">
            Free and paid advertisement options available • Direct call and WhatsApp contact
          </div>

          <div className="overflow-visible rounded-[2rem] border border-[#CBD5E1] bg-white shadow-sm">
            <div className="grid items-start gap-6 p-4 md:p-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(350px,0.96fr)] lg:p-8">
              <div className="flex min-w-0 flex-col justify-start">
                <Link
                  href="/"
                  className="mb-5 flex w-full max-w-[430px] items-center justify-center overflow-visible rounded-[1.75rem] border border-[#CBD5E1] bg-white p-3 shadow-sm"
                  aria-label="My Classifieds home"
                >
                  <BrandLogo />
                </Link>

                <p className="text-sm font-black uppercase tracking-wide text-[#C2410C]">
                  Baramati’s local classifieds
                </p>

                <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-[#0F3D5E] sm:text-4xl md:text-5xl">
                  Baramati’s everyday opportunities, all in one local place.
                </h1>

                <p className="mt-3 max-w-3xl text-lg font-bold leading-8 text-[#0F766E]">
                  बारामतीच्या रोजच्या गरजा आणि संधी—आता एकाच स्थानिक ठिकाणी.
                </p>

                <p className="mt-5 max-w-3xl text-base leading-8 text-[#475569]">
                  Find property, jobs, vehicles, agriculture needs, education, local services and business opportunities—or post your own advertisement and connect directly with interested people.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide">
                  <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-[#0F3D5E]">
                    {BRAND_SCOPE_EN}
                  </span>
                  <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-[#0F766E]">
                    {BRAND_SCOPE_MR}
                  </span>
                </div>

                <form
                  action="/ads"
                  className="mt-6 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-sm"
                >
                  <p className="mb-3 text-sm font-black text-[#0F172A]">
                    What are you looking for in and around Baramati?
                  </p>

                  <div className="grid gap-3 lg:grid-cols-[1.2fr_0.9fr_0.9fr_auto]">
                    <label className="sr-only" htmlFor="home-search-keyword">
                      Search keyword
                    </label>
                    <input
                      id="home-search-keyword"
                      name="q"
                      placeholder="Search jobs, property, services, vehicles…"
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
                      <option value="">All Maharashtra Locations</option>
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
                    Post an Advertisement
                  </Link>

                  <Link
                    href="/ads"
                    className="rounded-xl border border-[#CBD5E1] bg-white px-6 py-4 text-center text-sm font-black uppercase text-[#0F3D5E] hover:bg-slate-50"
                  >
                    Browse Local Ads
                  </Link>
                </div>

                <p className="mt-4 text-xs font-black uppercase leading-5 text-[#475569]">
                  Simple posting • Local discovery • Moderated ads • Direct contact
                </p>
              </div>

              <div className="min-w-0">
                <BrandHeroGraphic />
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#0F766E]">
                  Everything local, easier to find
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
                  Explore advertisements by category
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[#475569]">
                  Explore advertisements by category and connect directly with the person or business that posted them.
                </p>
              </div>
              <Link href="/ads" className="text-sm font-black uppercase text-[#0F3D5E]">
                Browse all ads
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HOME_CATEGORY_MICROCOPY.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 transition hover:-translate-y-0.5 hover:border-[#0F3D5E] hover:bg-white"
                >
                  <h3 className="text-sm font-black uppercase text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-[#475569]">
                    {item.text}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black uppercase text-[#0F172A]">
                From local need to direct contact
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#475569]">
                Post or search, check the details carefully, and contact the advertiser directly to take the conversation forward.
              </p>
            </div>
            <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black uppercase text-[#0F172A]">
                Have something useful to offer Baramati?
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#475569]">
                Whether it is a vacancy, property, local service, course, vehicle or business opportunity, create a clear advertisement and reach people already searching locally.
              </p>
            </div>
            <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black uppercase text-[#0F172A]">
                {BRAND_FUNCTIONAL_PROMISE}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#475569]">
                Baramati-first communication during launch, with the platform open for relevant Maharashtra advertisements.
              </p>
            </div>
          </section>

          {featuredAds.length > 0 && (
            <section className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-black uppercase text-[#0F172A]">
                    {t(language, "featuredClassifieds")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#475569]">
                    Paid placement can improve visibility, but it is not verification or endorsement.
                  </p>
                </div>

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
              <div>
                <h2 className="text-3xl font-black uppercase text-[#0F172A]">
                  Recently posted near you
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#475569]">
                  Fresh local advertisements from Baramati and other Maharashtra locations.
                </p>
              </div>

              <Link href="/ads" className="text-sm font-black uppercase text-[#0F3D5E]">
                {t(language, "viewAllAds")}
              </Link>
            </div>

            {latestAds.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-[#CBD5E1] bg-white p-8 text-center shadow-sm">
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
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {latestAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} language={language} />
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 rounded-3xl border border-[#CBD5E1] bg-[#0F3D5E] p-6 text-white shadow-sm">
            <h2 className="text-2xl font-black uppercase md:text-3xl">
              Connect locally. Decide carefully.
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-100">
              Verify the advertiser, item, service, documents and payment terms yourself. Never share an OTP, UPI PIN or banking password.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/safety" className="rounded-xl bg-white px-5 py-3 text-sm font-black uppercase text-[#0F3D5E]">
                Read Safety Tips
              </Link>
              <Link href="/report" className="rounded-xl border border-white/40 px-5 py-3 text-sm font-black uppercase text-white">
                Report an Advertisement
              </Link>
            </div>
            <p className="mt-6 text-lg font-black text-orange-100">
              {BRAND_SIGNATURE_MR}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-200">
              {BRAND_SIGNATURE_EN}
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
