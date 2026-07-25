import Link from "next/link";
import { cookies } from "next/headers";
import {
  FEATURED_FEATURES,
  getLocalizedApprovalTime,
  getLocalizedPlanDuration,
  getLocalizedPlanFeatures,
  getLocalizedPlanName,
  getPlanFeatureList,
  formatPlanAmount
} from "../lib/planFeatures";
import { getLanguageFromCookieStore, t } from "../lib/i18n";

export const metadata = {
  title: "Pricing | My Classifieds",
  description:
    "Pricing plans for free, paid, premium and featured classified ads on My Classifieds."
};

function getPlanHref(planKey) {
  if (planKey === "FREE_7_DAYS") return "/post-ad?plan=free";
  if (planKey === "PAID_7_DAYS") return "/post-ad?plan=paid";
  if (planKey === "PREMIUM_30_DAYS") return "/post-ad?plan=premium";

  return "/post-ad";
}

export default async function PricingPage() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const plans = getPlanFeatureList();

  return (
    <main className="bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-red-600">
                {t(language, "pricing")}
              </p>

              <h1 className="mt-1 text-2xl font-black uppercase text-slate-950 md:text-3xl">
                {t(language, "pricingTitle")}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
                {t(language, "pricingIntro")}
              </p>
            </div>

            <Link
              href="/post-ad"
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-700"
            >
              {t(language, "placeClassified")}
            </Link>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-900">
          {t(language, "manualUpiNotice")} {t(language, "gstInclusive")}.
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.key}
              className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-black uppercase text-slate-950">
                  {getLocalizedPlanName(plan, language)}
                </h2>

                <span className="rounded bg-slate-950 px-3 py-1 text-[11px] font-black uppercase text-white">
                  {plan.badge}
                </span>
              </div>

              <p className="mt-4 text-4xl font-black text-red-600">
                {formatPlanAmount(plan.price)}
              </p>

              <p className="mt-1 text-xs font-black uppercase text-slate-600">
                {t(language, "gstInclusive")} | {t(language, "validFor")}{" "}
                {getLocalizedPlanDuration(plan, language)}
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                <p>
                  <strong>{t(language, "headingLimit")}:</strong>{" "}
                  {plan.titleMaxLength} characters
                </p>
                <p>
                  <strong>{t(language, "descriptionLimit")}:</strong>{" "}
                  {plan.descriptionMaxLength} characters
                </p>
                <p>
                  <strong>{t(language, "approval")}:</strong>{" "}
                  {getLocalizedApprovalTime(plan, language)}
                </p>
              </div>

              <ul className="mt-5 space-y-2 text-sm font-semibold text-slate-700">
                {getLocalizedPlanFeatures(plan, language).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="font-black text-green-700">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={getPlanHref(plan.key)}
                className="mt-6 flex w-full justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-700"
              >
                {t(language, "choosePlanButton")}
              </Link>
            </article>
          ))}

          <article className="rounded-3xl border-2 border-orange-400 bg-orange-50 p-5 shadow-sm">
            <h2 className="text-xl font-black uppercase text-slate-950">
              {language === "mr"
                ? FEATURED_FEATURES.publicNameMr
                : FEATURED_FEATURES.publicName}
            </h2>

            <p className="mt-4 text-4xl font-black text-orange-600">
              {formatPlanAmount(FEATURED_FEATURES.price)}
            </p>

            <p className="mt-1 text-xs font-black uppercase text-slate-600">
              {t(language, "validFor")}{" "}
              {language === "mr"
                ? FEATURED_FEATURES.durationLabelMr
                : FEATURED_FEATURES.durationLabel}
            </p>

            <ul className="mt-5 space-y-2 text-sm font-semibold text-slate-700">
              {(language === "mr"
                ? FEATURED_FEATURES.featuresMr
                : FEATURED_FEATURES.features
              ).map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="font-black text-green-700">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/post-ad?plan=featured"
              className="mt-6 flex w-full justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-black uppercase text-white hover:bg-orange-600"
            >
              {t(language, "choosePlanButton")}
            </Link>
          </article>
        </div>

        <section className="mt-8 rounded-3xl border bg-yellow-50 p-6 shadow-sm">
          <h2 className="text-2xl font-black uppercase text-yellow-950">
            {t(language, "importantNote")}
          </h2>

          <p className="mt-4 text-sm leading-7 text-yellow-900">
            {t(language, "moderationNote")}
          </p>
        </section>
      </section>
    </main>
  );
}
