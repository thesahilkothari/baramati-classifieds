import Link from "next/link";
import { cookies } from "next/headers";
import {
  BUSINESS_ANNUAL_PLAN_KEY,
  FEATURED_FEATURES,
  getLocalizedApprovalTime,
  getLocalizedPlanDuration,
  getLocalizedPlanFeatures,
  getLocalizedPlanName,
  getPlanFeatureList,
  formatPlanAmount
} from "../lib/planFeatures";
import { getLanguageFromCookieStore, t } from "../lib/i18n";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Classified Ad Pricing | Free, Paid, Premium & Business Annual — My Classifieds",
  description:
    "Compare Free, Paid, Premium and Business Annual classified-advertising options on My Classifieds and choose the visibility suitable for your local advertisement.",
  path: "/pricing"
});

function getPlanHref(planKey) {
  if (planKey === "FREE_7_DAYS") return "/post-ad?plan=free";
  if (planKey === "PAID_7_DAYS") return "/post-ad?plan=paid";
  if (planKey === "PREMIUM_30_DAYS") return "/post-ad?plan=premium";
  if (planKey === BUSINESS_ANNUAL_PLAN_KEY) return "/post-ad?plan=business-annual";

  return "/post-ad";
}

function planSummary(planKey) {
  if (planKey === "FREE_7_DAYS") return "A simple way to publish a genuine local advertisement.";
  if (planKey === "PAID_7_DAYS") return "Better placement for advertisements that need added visibility.";
  if (planKey === "PREMIUM_30_DAYS") return "Higher visibility for property, jobs, business and urgent advertisements.";
  if (planKey === BUSINESS_ANNUAL_PLAN_KEY) return "A yearly visibility option for businesses, professionals and service providers.";
  return "Visibility according to the applicable plan terms.";
}

export default async function PricingPage() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const plans = getPlanFeatureList();

  return (
    <main className="bg-[#F8FAFC] px-4 py-6">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
                Classified Ad Pricing
              </p>

              <h1 className="mt-2 max-w-4xl text-3xl font-black leading-tight text-[#0F3D5E] md:text-5xl">
                Start free. Choose more visibility when it matters.
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#475569] md:text-base">
                Every advertiser can start with a standard advertisement. Paid options are available when you want stronger placement, longer visibility, or an annual business presence.
              </p>
            </div>

            <Link
              href="/post-ad"
              className="rounded-xl bg-[#C2410C] px-5 py-3 text-sm font-black uppercase text-white hover:bg-orange-800"
            >
              Post My Advertisement
            </Link>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          Paid placement improves visibility on the platform; it does not guarantee enquiries, a transaction, employment, sale or any particular result. {t(language, "manualUpiNotice")} {t(language, "gstInclusive")}.
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={`rounded-3xl border p-5 shadow-sm ${
                plan.key === BUSINESS_ANNUAL_PLAN_KEY
                  ? "border-[#F59E0B] bg-amber-50"
                  : "border-[#CBD5E1] bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black uppercase text-[#0F172A]">
                    {getLocalizedPlanName(plan, language)}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#475569]">
                    {planSummary(plan.key)}
                  </p>
                </div>

                <span className="rounded bg-[#0F3D5E] px-3 py-1 text-[11px] font-black uppercase text-white">
                  {plan.badge}
                </span>
              </div>

              <div className="mt-4">
                {plan.oldPrice && (
                  <p className="text-sm font-black uppercase text-[#475569] line-through">
                    {formatPlanAmount(plan.oldPrice)}
                  </p>
                )}
                <p className="text-4xl font-black text-[#C2410C]">
                  {formatPlanAmount(plan.price)}
                </p>
              </div>

              <p className="mt-1 text-xs font-black uppercase text-[#475569]">
                {t(language, "gstInclusive")} | {t(language, "validFor")} {getLocalizedPlanDuration(plan, language)}
              </p>

              {plan.defaultFeatured && (
                <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-black uppercase text-[#0F3D5E]">
                  Featured by default; ranked after regular Featured add-on ads.
                </p>
              )}

              <div className="mt-4 rounded-xl bg-[#F8FAFC] p-3 text-sm leading-6 text-[#475569]">
                <p><strong>{t(language, "headingLimit")}:</strong> {plan.titleMaxLength} characters</p>
                <p><strong>{t(language, "descriptionLimit")}:</strong> {plan.descriptionMaxLength} characters</p>
                <p><strong>{t(language, "approval")}:</strong> {getLocalizedApprovalTime(plan, language)}</p>
              </div>

              <ul className="mt-5 space-y-2 text-sm font-semibold text-[#475569]">
                {getLocalizedPlanFeatures(plan, language).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="font-black text-[#0F766E]">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={getPlanHref(plan.key)}
                className="mt-6 flex w-full justify-center rounded-xl bg-[#0F3D5E] px-5 py-3 text-sm font-black uppercase text-white hover:bg-[#0B2F49]"
              >
                {t(language, "choosePlanButton")}
              </Link>
            </article>
          ))}
        </div>

        <article className="mt-5 rounded-3xl border border-[#F59E0B] bg-white p-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-xl font-black uppercase text-[#0F172A]">
                {language === "mr" ? FEATURED_FEATURES.publicNameMr : FEATURED_FEATURES.publicName}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#475569]">
                Featured placement is available only for an eligible Paid or Premium listing and applies for the add-on period.
              </p>
              <p className="mt-4 text-4xl font-black text-[#C2410C]">
                {formatPlanAmount(FEATURED_FEATURES.price)}
              </p>
              <p className="mt-1 text-xs font-black uppercase text-[#475569]">
                {t(language, "validFor")} {language === "mr" ? FEATURED_FEATURES.durationLabelMr : FEATURED_FEATURES.durationLabel}
              </p>
            </div>

            <div>
              <ul className="space-y-2 text-sm font-semibold text-[#475569]">
                {(language === "mr" ? FEATURED_FEATURES.featuresMr : FEATURED_FEATURES.features).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="font-black text-[#0F766E]">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl border border-[#F59E0B] bg-amber-50 px-5 py-3 text-center text-sm font-black uppercase text-[#0F3D5E]">
                {language === "mr" ? "Paid किंवा Premium plan निवडल्यानंतर उपलब्ध" : "Available after selecting Paid or Premium"}
              </p>
            </div>
          </div>
        </article>

        <section className="mt-8 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black uppercase text-[#0F172A]">
            Not sure which option fits? Start with Free.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#475569]">
            You can choose an eligible upgrade later. Keep your advertisement accurate and complete—clarity matters as much as placement.
          </p>
          <Link href="/post-ad?plan=free" className="mt-5 inline-flex rounded-xl bg-[#C2410C] px-5 py-3 text-sm font-black uppercase text-white">
            Post My Advertisement
          </Link>
        </section>
      </section>
    </main>
  );
}
