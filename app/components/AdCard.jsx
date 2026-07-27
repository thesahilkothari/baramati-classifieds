import Link from "next/link";
import BrandMark from "./BrandMark";
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

export default function AdCard({ ad, language = "en" }) {
  const showFeatured = shouldShowFeatured(ad);
  const verifiedSeller = Boolean(ad?.user?.isVerified);
  const categoryName = language === "mr" ? ad.category?.nameMr || ad.category?.nameEn : ad.category?.nameEn;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        showFeatured ? "border-[#F59E0B]" : "border-[#CBD5E1]"
      }`}
    >
      <Link
        href={`/ads/${ad.slug}`}
        className="relative block border-b border-[#CBD5E1] bg-[#F8FAFC]"
        style={{ aspectRatio: "4 / 3" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] p-4 text-center">
          <BrandMark className="h-14 w-14 opacity-95" />
          <div>
            <p className="text-4xl font-black text-[#0F3D5E]">
              {getCategoryIcon(ad.category?.slug)}
            </p>
            <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#475569]">
              {categoryName || "Classified"}
            </p>
          </div>
        </div>

        {showFeatured && (
          <span className="absolute left-3 top-3 rounded bg-[#F59E0B] px-2.5 py-1 text-[10px] font-black uppercase text-[#0F172A] shadow-sm">
            {t(language, "featured")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2">
          {verifiedSeller && (
            <span className="rounded bg-[#0F766E] px-2 py-1 text-[10px] font-black uppercase text-white">
              Verified Seller
            </span>
          )}

          {categoryName && (
            <span className="rounded bg-[#0F3D5E] px-2 py-1 text-[10px] font-black uppercase text-white">
              {categoryName}
            </span>
          )}

          {ad.city?.name && (
            <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-[#475569]">
              {ad.city.name}
            </span>
          )}
        </div>

        <Link href={`/ads/${ad.slug}`} className="mt-3 block">
          <h3 className="line-clamp-2 text-lg font-black uppercase leading-tight text-[#0F172A] group-hover:text-[#0F3D5E]">
            {ad.title}
          </h3>
        </Link>

        <p className="mt-3 text-xl font-black text-[#C2410C]">
          {formatPrice(ad.price, language)}
        </p>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#475569]">
          {ad.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase text-[#475569]">
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
            className="rounded-xl bg-[#0F3D5E] px-3 py-2 text-center text-xs font-black uppercase text-white hover:bg-[#0B2F49]"
          >
            {t(language, "view")}
          </Link>

          <Link
            href={`/report?adId=${ad.id}&adSlug=${ad.slug}`}
            className="rounded-xl border border-[#CBD5E1] px-3 py-2 text-center text-xs font-black uppercase text-[#B91C1C] hover:bg-red-50"
          >
            {t(language, "report")}
          </Link>
        </div>
      </div>
    </article>
  );
}
