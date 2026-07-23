import Link from "next/link";

const colorClasses = [
  "border-red-300 bg-red-50",
  "border-blue-300 bg-blue-50",
  "border-yellow-300 bg-yellow-50",
  "border-green-300 bg-green-50",
  "border-purple-300 bg-purple-50",
  "border-orange-300 bg-orange-50",
  "border-pink-300 bg-pink-50",
  "border-cyan-300 bg-cyan-50"
];

function formatPrice(price) {
  if (!price) return "Call for Price";

  const amount = Number(price);

  if (Number.isNaN(amount)) return "Call for Price";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export default function AdCard({ ad, index = 0 }) {
  const colorClass = colorClasses[index % colorClasses.length];

  return (
    <article
      className={`rounded-xl border-2 p-3 shadow-sm ${colorClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded bg-slate-950 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
          {ad.category?.nameEn || "Classified"}
        </span>

        {ad.isFeatured && (
          <span className="rounded bg-red-600 px-2 py-1 text-[10px] font-black uppercase text-white">
            Prime
          </span>
        )}
      </div>

      <Link href={`/ads/${ad.slug}`}>
        <h3 className="mt-2 text-base font-black uppercase leading-tight text-slate-950 hover:text-blue-700">
          {ad.title}
        </h3>
      </Link>

      <p className="mt-1 text-sm font-extrabold text-red-700">
        {formatPrice(ad.price)}
      </p>

      <p className="mt-2 line-clamp-4 text-sm leading-5 text-slate-800">
        {ad.description}
      </p>

      <div className="mt-3 border-t border-slate-300 pt-2 text-xs font-bold text-slate-700">
        <p>{ad.city?.name || "Maharashtra"}</p>
        {ad.address && <p>{ad.address}</p>}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={`tel:${ad.mobile}`}
          className="rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-black text-white"
        >
          Call
        </a>

        <a
          href={`https://wa.me/91${ad.whatsapp || ad.mobile}?text=${encodeURIComponent(
            `I am interested in your classified ad: ${ad.title}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-green-600 px-3 py-2 text-center text-xs font-black text-white"
        >
          WhatsApp
        </a>
      </div>
    </article>
  );
}
