import Link from "next/link";
import { getConditionLabel } from "../lib/itemConditions";
import { t } from "../lib/i18n";

function formatPrice(price, language) {
  if (!price) return t(language, "callForPrice");

  const amount = Number(price);

  if (Number.isNaN(amount)) {
    return t(language, "callForPrice");
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function shouldShowFeatured(ad) {
  if (!ad?.isFeatured) return false;
  if (!ad?.featuredUntil) return true;

  return new Date(ad.featuredUntil) > new Date();
}

function getCategoryIcon(categorySlug) {
  const slug = String(categorySlug || "");
  if (slug.includes("real-estate")) return "⌂";
  if (slug.includes("job")) return "▣";
  if (slug.includes("vehicle")) return "▰";
  if (slug.includes("electronic")) return "▯";
  if (slug.includes("agriculture")) return "⚑";
  if (slug.includes("service")) return "⚙";
  return "▤";
}

function getReportCopy(language) {
  if (language === "mr") {
    return {
      summary: "Report issue",
      warning:
        "फक्त spam, fraud, prohibited/illegal content, duplicate ad किंवा safety concern असल्यासच report करा.",
      action: "Continue to report"
    };
  }

  return {
    summary: "Report issue",
    warning:
      "Use only for spam, fraud, prohibited/illegal content, duplicate ads or safety concerns.",
    action: "Continue to report"
  };
}

export default function AdCard({ ad, language = "en" }) {
  const showFeatured = shouldShowFeatured(ad);
  const isBusinessAnnual = ad?.adType === "FEATURED";
  const verifiedSeller = Boolean(ad?.user?.isVerified);
  const categoryName = language === "mr" ? ad.category?.nameMr || ad.category?.nameEn : ad.category?.nameEn;
  const categoryIcon = getCategoryIcon(ad.category?.slug);
  const reportCopy = getReportCopy(language);

  return (
    <article
      className={`group flex h-full flex-col rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        showFeatured ? "border-[#F59E0B]" : "border-[#CBD5E1]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {showFeatured && (
            <span className="rounded bg-[#F59E0B] px-2.5 py-1 text-[10px] font-black uppercase text-[#0F172A]">
              {t(language, "featured")}
            </span>
          )}

          {isBusinessAnnual && (
            <span className="rounded bg-purple-100 px-2.5 py-1 text-[10px] font-black uppercase text-purple-800">
              Annual
            </span>
          )}

          {verifiedSeller && (
            <span className="rounded bg-[#0F766E] px-2.5 py-1 text-[10px] font-black uppercase text-white">
              Verified Seller
            </span>
          )}

          {categoryName && (
            <span className="rounded bg-[#0F3D5E] px-2.5 py-1 text-[10px] font-black uppercase text-white">
              {categoryName}
            </span>
          )}
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-lg font-black text-[#0F3D5E]" aria-hidden="true">
          {categoryIcon}
        </div>
      </div>

      <Link href={`/ads/${ad.slug}`} className="mt-4 block">
        <h3 className="line-clamp-2 text-xl font-black uppercase leading-tight text-[#0F172A] group-hover:text-[#0F3D5E]">
          {ad.title}
        </h3>
      </Link>

      <p className="mt-3 text-2xl font-black text-[#C2410C]">
        {formatPrice(ad.price, language)}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold uppercase text-[#475569]">
        {ad.city?.name && (
          <span className="rounded border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-1">
            {ad.city.name}
          </span>
        )}

        {ad.createdAt && (
          <span className="rounded border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-1">
            {new Date(ad.createdAt).toLocaleDateString("en-IN")}
          </span>
        )}

        {ad.condition && ad.condition !== "NOT_APPLICABLE" && (
          <span className="rounded border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-1">
            {getConditionLabel(ad.condition, language)}
          </span>
        )}
      </div>

      <p className="mt-4 line-clamp-4 flex-1 border-t border-[#CBD5E1] pt-4 text-sm leading-6 text-[#475569]">
        {ad.description}
      </p>

      <div className="mt-4">
        <Link
          href={`/ads/${ad.slug}`}
          className="block rounded-xl bg-[#0F3D5E] px-3 py-2.5 text-center text-xs font-black uppercase text-white hover:bg-[#0B2F49]"
        >
          {t(language, "view")}
        </Link>

        <details className="mt-2 rounded-xl border border-transparent text-xs text-[#475569] open:border-[#CBD5E1] open:bg-[#F8FAFC] open:p-3">
          <summary className="cursor-pointer list-none text-center text-[11px] font-bold uppercase text-[#B91C1C] underline-offset-4 hover:underline">
            {reportCopy.summary}
          </summary>

          <p className="mt-2 text-center text-[11px] leading-5 text-[#475569]">
            {reportCopy.warning}
          </p>

          <Link
            href={`/report?adId=${ad.id}&adSlug=${ad.slug}&source=card`}
            className="mt-3 block rounded-lg border border-[#B91C1C] bg-white px-3 py-2 text-center text-[11px] font-black uppercase text-[#B91C1C] hover:bg-red-50"
          >
            {reportCopy.action}
          </Link>
        </details>
      </div>
    </article>
  );
}
