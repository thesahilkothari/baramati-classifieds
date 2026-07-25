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

export default function AdCard({ ad, language = "en" }) {
  const showFeatured = shouldShowFeatured(ad);

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border-2 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        showFeatured ? "border-orange-400" : "border-slate-200"
      }`}
    >
      <div className="flex flex-wrap gap-2">
        {showFeatured && (
          <span className="rounded bg-orange-500 px-2 py-1 text-[10px] font-black uppercase text-white">
            {t(language, "featured")}
          </span>
        )}

        {ad.category?.nameEn && (
          <span className="rounded bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-white">
            {language === "mr" ? ad.category.nameMr || ad.category.nameEn : ad.category.nameEn}
          </span>
        )}

        {ad.city?.name && (
          <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-700">
            {ad.city.name}
          </span>
        )}
      </div>

      <Link href={`/ads/${ad.slug}`} className="mt-3 block">
        <h3 className="line-clamp-2 text-lg font-black uppercase leading-tight text-slate-950 group-hover:text-blue-700">
          {ad.title}
        </h3>
      </Link>

      <p className="mt-3 text-xl font-black text-red-700">
        {formatPrice(ad.price, language)}
      </p>

      <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-slate-700">
        {ad.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase text-slate-500">
        {ad.condition && ad.condition !== "NOT_APPLICABLE" && (
          <span className="rounded bg-slate-100 px-2 py-1">
            {getConditionLabel(ad.condition, language)}
          </span>
        )}

        {ad.createdAt && (
          <span className="rounded bg-slate-100 px-2 py-1">
            {new Date(ad.createdAt).toLocaleDateString("en-IN")}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/ads/${ad.slug}`}
          className="rounded-xl bg-blue-700 px-3 py-2 text-center text-xs font-black uppercase text-white hover:bg-blue-800"
        >
          {t(language, "view")}
        </Link>

        <Link
          href={`/report?adId=${ad.id}&adSlug=${ad.slug}`}
          className="rounded-xl border px-3 py-2 text-center text-xs font-black uppercase text-slate-700 hover:bg-slate-50"
        >
          {t(language, "report")}
        </Link>
      </div>
    </article>
  );
}
