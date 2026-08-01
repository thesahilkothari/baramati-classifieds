import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "./lib/prisma";
import AdCard from "./components/AdCard";
import BrandLogo from "./components/BrandLogo";
import JsonLd from "./components/JsonLd";
import { getLanguageFromCookieStore } from "./lib/i18n";
import {
  APPROVED_LOCATION_COUNT,
  getAllowedTier2CitySearchOptions
} from "./lib/locations";
import { buildOrganizationSchema, buildWebSiteSchema } from "./lib/jsonLd";
import { buildPageMetadata } from "./lib/seo";
import { reactivateFutureDatedExpiredAds } from "./lib/adStatusRepair";
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

function isCurrentFeatured(ad, now) {
  if (!ad.isFeatured) return false;
  if (!ad.featuredUntil) return true;
  return ad.featuredUntil > now;
}

function getHomepageRank(ad, now) {
  const featuredNow = isCurrentFeatured(ad, now);

  if (featuredNow && ad.adType !== "FEATURED") return 1;
  if (ad.adType === "FEATURED") return 2;
  if (ad.adType === "PREMIUM") return 3;
  if (ad.adType === "PAID") return 4;
  if (ad.adType === "FREE") return 5;

  return 6;
}

async function getHomeAds() {
  const now = new Date();

  await reactivateFutureDatedExpiredAds(prisma);

  const ads = await prisma.ad.findMany({
    where: {
      status: "ACTIVE",
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
    },
    include: getAdInclude(),
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return ads.sort((first, second) => {
    const rankDifference = getHomepageRank(first, now) - getHomepageRank(second, now);
    if (rankDifference !== 0) return rankDifference;

    const firstTime = new Date(first.createdAt).getTime();
    const secondTime = new Date(second.createdAt).getTime();
    return secondTime - firstTime;
  });
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
  const [visibleAds, [categories, cities]] = await Promise.all([
    getHomeAds(),
    getHomeFilters()
  ]);

  return (
    <>
      <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />

      <main className="bg-[#F8FAFC] px-3 pb-24 pt-4 md:px-4 md:pb-10">
        <section className="mx-auto max-w-7xl">
          <section className="rounded-[1.35rem] border border-[#CBD5E1] bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <Link
                  href="/"
                  className="inline-flex max-w-full items-center overflow-visible rounded-2xl border border-[#CBD5E1] bg-white px-3 py-2 shadow-sm"
                  aria-label="My Classifieds home"
                >
                  <BrandLogo />
                </Link>

                <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#C2410C]">
                  Baramati’s local classifieds • {BRAND_SCOPE_EN}
                </p>

                <h1 className="mt-2 max-w-5xl text-2xl font-black leading-tight text-[#0F3D5E] sm:text-3xl md:text-4xl">
                  Baramati’s everyday opportunities, all in one local place.
                </h1>

                <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-[#0F766E] md:text-base">
                  बारामतीच्या रोजच्या गरजा आणि संधी—आता एकाच स्थानिक ठिकाणी.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/post-ad"
                  className="rounded-xl bg-[#C2410C] px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-orange-800"
                >
                  Post Ad
                </Link>

                <Link
                  href="/ads"
                  className="rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-center text-sm font-black uppercase text-[#0F3D5E] hover:bg-slate-50"
                >
                  Browse Ads
                </Link>
              </div>
            </div>

            <form
              action="/ads"
              className="mt-4 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-black text-[#0F172A]">
                  Search local advertisements
                </p>
                <p className="text-[11px] font-black uppercase text-[#475569]">
                  {APPROVED_LOCATION_COUNT} approved locations
                </p>
              </div>

              <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.4fr)_minmax(190px,0.75fr)_minmax(260px,0.95fr)_minmax(120px,0.35fr)]">
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
                  className="min-h-12 w-full min-w-0 rounded-xl border border-[#64748B] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
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
                  className="min-h-12 w-full rounded-xl bg-[#0F3D5E] px-5 py-3 text-sm font-black uppercase text-white hover:bg-[#0B2F49] md:col-span-2 xl:col-span-1"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap gap-2">
              {HOME_CATEGORY_MICROCOPY.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  title={item.text}
                  className="rounded-full border border-[#CBD5E1] bg-white px-3 py-2 text-[11px] font-black uppercase text-[#475569] hover:border-[#0F3D5E] hover:text-[#0F3D5E]"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
                  Active Classifieds
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#475569]">
                  Showing all active non-expired advertisements. Order: regular Featured, Business Annual, Premium, Paid and Free.
                </p>
              </div>

              <Link href="/ads" className="text-sm font-black uppercase text-[#0F3D5E]">
                Browse with filters
              </Link>
            </div>

            {visibleAds.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-[#CBD5E1] bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-bold text-[#475569]">
                  No active advertisements are available right now.
                </p>
                <Link
                  href="/post-ad"
                  className="mt-5 inline-flex rounded-xl bg-[#C2410C] px-6 py-3 text-sm font-black uppercase text-white"
                >
                  Post an Ad
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleAds.map((ad) => (
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
