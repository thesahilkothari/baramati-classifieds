import Link from "next/link";

function formatPrice(price) {
  if (!price) return "Call for Price";
  const amount = Number(price);
  if (Number.isNaN(amount)) return "Call for Price";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function isFeaturedAd(ad) {
  return Boolean(ad?.isFeatured && ad?.featuredUntil && new Date(ad.featuredUntil) > new Date());
}

export default function AdCard({ ad, index = 0 }) {
  const featured = isFeaturedAd(ad);
  const borderClasses = featured ? "border-2 border-orange-500 bg-orange-50" : "border border-slate-200 bg-white";

  return (
    <article className={`flex h-full flex-col rounded-2xl p-4 shadow-sm ${borderClasses}`}>
      <div className="flex flex-wrap gap-2">
        {featured && <span className="rounded bg-orange-500 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">Featured</span>}
        {ad.category?.nameEn && <span className="rounded bg-slate-950 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">{ad.category.nameEn}</span>}
        {ad.city?.name && <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-700">{ad.city.name}</span>}
      </div>

      <h3 className="mt-3 line-clamp-2 text-lg font-black uppercase leading-snug text-slate-950">
        <Link href={`/ads/${ad.slug}`} className="hover:text-blue-700">{ad.title}</Link>
      </h3>

      <p className="mt-2 text-xl font-black text-red-700">{formatPrice(ad.price)}</p>
      <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-slate-700">{ad.description}</p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3">
        <Link href={`/ads/${ad.slug}`} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-black uppercase text-white hover:bg-blue-800">View Details</Link>
        <span className="text-xs font-bold text-slate-500">#{String(index + 1).padStart(2, "0")}</span>
      </div>
    </article>
  );
}
