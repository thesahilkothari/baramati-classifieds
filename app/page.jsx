import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, CheckCircle2, PlusCircle } from "lucide-react";
import { prisma } from "./lib/prisma";
import AdCard from "./components/AdCard";
import CategoryStrip from "./components/redesign/CategoryStrip";
import SafetyBand from "./components/redesign/SafetyBand";
import JsonLd from "./components/JsonLd";
import { getLanguageFromCookieStore } from "./lib/i18n";
import { buildOrganizationSchema, buildWebSiteSchema } from "./lib/jsonLd";
import { buildPageMetadata } from "./lib/seo";
import { reactivateFutureDatedExpiredAds } from "./lib/adStatusRepair";
import { BRAND_SIGNATURE_EN, BRAND_SIGNATURE_MR } from "./lib/brandCopy";
import { sortAdsForHomepage } from "./lib/redesign/adViewModel";

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
    images: {
      orderBy: { id: "asc" },
      take: 1
    },
    user: {
      select: {
        isVerified: true
      }
    }
  };
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

  return sortAdsForHomepage(ads, now);
}

async function getHomeData() {
  return Promise.all([
    getHomeAds(),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } })
  ]);
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const [visibleAds, categories] = await getHomeData();

  return (
    <>
      <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />

      <main className="bg-[#F8FAFC] pb-24 md:pb-12">
        <CategoryStrip categories={categories} language={language} />

        <section className="bg-white px-4 py-8 sm:px-6 md:py-10">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#AC3400]">
                Baramati-first local classifieds
              </p>
              <h1 className="mt-3 max-w-4xl font-[var(--font-plus-jakarta)] text-3xl font-black leading-tight tracking-tight text-[#002741] md:text-5xl">
                Find, post and connect directly through trusted local advertisements.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#42474E] md:text-lg">
                Browse active advertisements for property, jobs, vehicles, agriculture, education, services and business opportunities across Baramati and Maharashtra.
              </p>
              <p className="mt-3 text-sm font-black text-[#0F766E] md:text-base">
                {BRAND_SIGNATURE_MR} / {BRAND_SIGNATURE_EN}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/post-ad"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C2410C] px-6 py-3 text-sm font-black uppercase text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#FD6B36]"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post your ad
                </Link>
                <Link
                  href="/ads"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-black uppercase text-[#002741] transition hover:border-[#002741]"
                >
                  Browse all ads
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-[0_4px_12px_rgba(15,61,94,0.05)] md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#002741]/60">
                Why people use My Classifieds
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "All active ads are shown from your live database.",
                  "Featured and Business Annual ads get priority, without hiding other active ads.",
                  "Users contact advertisers directly by the details available in each ad.",
                  "Safety reminders, reporting and moderation support responsible use."
                ].map((item) => (
                  <p key={item} className="flex gap-3 text-sm font-semibold leading-6 text-[#42474E]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SafetyBand activeAdsCount={visibleAds.length} />

        <section className="px-4 py-6 sm:px-6 md:py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-4 md:flex-row md:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-[var(--font-plus-jakarta)] text-2xl font-black tracking-tight text-[#002741] md:text-4xl">
                    Fresh Recommendations
                  </h2>
                  <span className="rounded-full bg-[#CEE5FF] px-3 py-1 text-xs font-black uppercase text-[#002741]">
                    {visibleAds.length} active ad{visibleAds.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#72777E]">
                  Unified live ranking: regular Featured, Business Annual, Premium, Paid, Free, then any other active ad fallback.
                </p>
              </div>

              <Link
                href="/ads"
                className="inline-flex rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-black uppercase text-[#002741] hover:border-[#002741]"
              >
                View with filters
              </Link>
            </div>

            {visibleAds.length === 0 ? (
              <div className="mx-auto my-10 max-w-lg rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
                <h3 className="font-[var(--font-plus-jakarta)] text-xl font-black text-[#002741]">
                  No active advertisements found
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#72777E]">
                  Once an advertisement is approved and non-expired, it will appear here automatically.
                </p>
                <Link
                  href="/post-ad"
                  className="mt-6 inline-flex rounded-full bg-[#002741] px-6 py-3 text-xs font-black uppercase text-white"
                >
                  Post the first ad
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} language={language} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 md:py-12">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)] lg:grid-cols-[1fr_360px]">
            <div className="p-6 md:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#AC3400]">
                Ready to reach local users?
              </p>
              <h2 className="mt-3 font-[var(--font-plus-jakarta)] text-3xl font-black tracking-tight text-[#002741] md:text-4xl">
                Post your ad on My Classifieds today.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#42474E] md:text-base">
                Create a clear advertisement, choose the right category and let interested users contact you directly.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/post-ad"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FD6B36] px-6 py-3 text-sm font-black uppercase text-white shadow-md hover:bg-[#C2410C]"
                >
                  <PlusCircle className="h-4 w-4" />
                  Start selling
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center rounded-full bg-[#F2F4F6] px-6 py-3 text-sm font-black uppercase text-[#002741] hover:bg-[#E0E3E5]"
                >
                  How it works
                </Link>
              </div>
            </div>
            <div className="relative hidden bg-[radial-gradient(circle_at_top,#CEE5FF,transparent_42%),linear-gradient(135deg,#F8FAFC,#E0E3E5)] p-8 lg:block">
              <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-white p-5 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
                <p className="text-xs font-black uppercase tracking-wide text-[#0F766E]">
                  Local platform
                </p>
                <p className="mt-2 font-[var(--font-plus-jakarta)] text-xl font-black text-[#002741]">
                  Post local. Find local. Connect direct.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
