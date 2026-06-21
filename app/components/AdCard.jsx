import Link from "next/link";

export default function AdCard({ ad }) {
  const image = ad.images?.[0]?.url || "/placeholder.jpg";

  return (
    <Link
      href={`/ads/${ad.slug}`}
      className="overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        <img src={image} alt={ad.title} className="h-full w-full object-cover" />

        {ad.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase text-blue-700">
          {ad.category?.nameEn}
        </p>

        <h3 className="mt-1 line-clamp-2 font-bold">{ad.title}</h3>

        <p className="mt-2 text-lg font-extrabold">
          {ad.price ? `₹${Number(ad.price).toLocaleString("en-IN")}` : "Price on request"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {ad.city?.name}, Maharashtra
        </p>
      </div>
    </Link>
  );
}
