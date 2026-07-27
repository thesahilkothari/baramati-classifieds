import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import PostAdForm from "../components/PostAdForm";
import { getLanguageFromCookieStore, t } from "../lib/i18n";
import { getAllowedTier2Cities } from "../lib/locations";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Post Ad | My Classifieds",
  description:
    "Post a classified ad in English or Marathi on My Classifieds for approved tier-2 Maharashtra locations.",
  path: "/post-ad"
});

const PLAN_QUERY_MAP = {
  free: "FREE_7_DAYS",
  paid: "PAID_7_DAYS",
  premium: "PREMIUM_30_DAYS"
};

export default async function PostAdPage({ searchParams }) {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const resolvedSearchParams = await searchParams;
  const initialPlan =
    PLAN_QUERY_MAP[String(resolvedSearchParams?.plan || "").toLowerCase()] ||
    "FREE_7_DAYS";

  const [categories, cities] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
    getAllowedTier2Cities(prisma)
  ]);

  return (
    <main className="bg-slate-100 px-3 pb-24 pt-6 md:px-4 md:pb-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-red-600">
            {t(language, "postAd")}
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase leading-tight text-slate-950 md:text-5xl">
            {t(language, "postAdTitle")}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            {t(language, "postAdIntro")}
          </p>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-900">
            Ads can currently be posted only for approved tier-2 Maharashtra locations such as Baramati, Phaltan, Akluj, Solapur, Karad, Satara, Sangli, Indapur, Daund, Shirur, Nashik, Chhatrapati Sambhajinagar and Ahilyanagar. Pune, Mumbai and similar tier-1 cities are intentionally not included.
          </div>

          <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-900">
            {t(language, "englishMarathiAllowed")}
          </div>
        </div>

        <PostAdForm
          categories={categories}
          cities={cities}
          initialLanguage={language}
          initialPlan={initialPlan}
        />
      </section>
    </main>
  );
}
