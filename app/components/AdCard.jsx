import Link from "next/link";

function formatPrice(price) {
  if (!price) return "Price on request";

  const amount = Number(price);

  if (Number.isNaN(amount)) return "Price on request";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export default function AdCard({ ad }) {
  const imageUrl = ad.images?.[0]?.url;

  return (
    <Link
      href={`/ads/${ad.slug}`}
      className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-44 items-center justify-center bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={ad.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-5xl">{ad.category?.icon || "📌"}</div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2">
          {ad.isFeatured && (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-800">
              Featured
            </span>
          )}

          <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
            {ad.category?.nameEn || "Classified"}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900 group-hover:text-blue-700">
          {ad.title}
        </h3>

        <p className="mt-2 text-xl font-extrabold text-slate-900">
          {formatPrice(ad.price)}
        </p>

        <p className="mt-2 text-sm text-slate-500">
          {ad.city?.name || "Maharashtra"}
        </p>
      </div>
    </Link>
  );
}
