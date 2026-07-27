import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "./lib/prisma";
import AdCard from "./components/AdCard";
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

async function getHomeAds() {
  const now = new Date();
  const include = {
    category: true,
    city: true
  };

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

export default async function HomePage() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const { featuredAds, latestAds } = await getHomeAds();

  return (
    <>
      <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />

      <main className="bg-slate-100 px-3 pb-24 pt-5 md:px-4 md:pb-10">
        <section className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border-2 border-slate-900 bg-white shadow-sm">
            <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-red-600">
                  {t(language, "homeHeroEyebrow")}
                </p>

                <h1 className="mt-3 text-4xl font-black uppercase leading-tight text-slate-950 md:text-6xl">
                  {t(language, "homeHeroTitle")}
                </h1>

                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
                  {t(language, "homeHeroText")}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/ads"
                    className="rounded-xl bg-blue-700 px-6 py-4 text-center text-sm font-black uppercase text-white hover:bg-blue-800"
                  >
                    {t(language, "startBrowsing")}
                  </Link>

                  <Link
                    href="/post-ad"
                    className="rounded-xl bg-red-600 px-6 py-4 text-center text-sm font-black uppercase text-white hover:bg-red-700"
                  >
                    {t(language, "placeClassified")}
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950 p-6 text-white">
                <h2 className="text-2xl font-black uppercase">
                  {t(language, "whyChooseUs")}
                </h2>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      title: t(language, "mobileFirst"),
                      text: t(language, "mobileFirstText")
                    },
                    {
                      title: t(language, "simplePricing"),
                      text: t(language, "simplePricingText")
                    },
                    {
                      title: t(language, "localReach"),
                      text: t(language, "localReachText")
                    }
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl bg-white/10 p-4">
                      <p className="font-black uppercase">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {featuredAds.length > 0 && (
            <section className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-3xl font-black uppercase text-slate-950">
                  {t(language, "featuredClassifieds")}
                </h2>

                <Link href="/ads" className="text-sm font-black uppercase text-blue-700">
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
              <h2 className="text-3xl font-black uppercase text-slate-950">
                {t(language, "latestClassifieds")}
              </h2>

              <Link href="/ads" className="text-sm font-black uppercase text-blue-700">
                {t(language, "viewAllAds")}
              </Link>
            </div>

            {latestAds.length === 0 ? (
              <div className="mt-5 rounded-3xl border bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-bold text-slate-600">
                  {t(language, "noAdsYet")}
                </p>
                <Link
                  href="/post-ad"
                  className="mt-5 inline-flex rounded-xl bg-red-600 px-6 py-3 text-sm font-black uppercase text-white"
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
