import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import PostAdForm from "../components/PostAdForm";
import { getLanguageFromCookieStore } from "../lib/i18n";
import { getAllowedTier2Cities } from "../lib/locations";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Post a Classified Ad in Baramati | My Classifieds",
  description:
    "Create a local classified advertisement for property, jobs, services, education, agriculture, vehicles and business opportunities in Baramati and Maharashtra.",
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
    <main className="bg-[#F8FAFC] px-3 pb-24 pt-6 md:px-4 md:pb-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
            Post an Advertisement
          </p>

          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-[#0F3D5E] md:text-5xl">
            Tell the right local people what you have to offer.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#475569] md:text-base">
            Create a clear advertisement in a few simple steps. Add accurate details, choose the right category and location, and help interested users contact you directly.
          </p>

          <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-[#0F766E]">
            अचूक माहिती भरा, योग्य विभाग व ठिकाण निवडा आणि इच्छुकांना तुमच्याशी थेट संपर्क करू द्या.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#475569]">
              <p className="font-black uppercase text-[#0F172A]">Clear ads get better responses</p>
              <p className="mt-2">
                Use a specific title, mention the actual location and price or salary where relevant, and describe important conditions honestly. Do not include misleading claims or unnecessary personal information.
              </p>
            </div>
            <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#475569]">
              <p className="font-black uppercase text-[#0F172A]">Built for Baramati. Open across Maharashtra.</p>
              <p className="mt-2">
                Select the real location where the opportunity, item or service is available. Mumbai, Pune, Nagpur and similar metro-first locations remain outside the current launch focus.
              </p>
            </div>
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
