import Link from "next/link";

export default function CategoryChips({ categories = [] }) {
  if (!categories.length) {
    return null;
  }

  return (
    <div className="mt-4 overflow-x-auto pb-1">
      <div className="flex w-max gap-2">
        <Link
          href="/ads"
          className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase text-white"
        >
          All
        </Link>

        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/ads?category=${category.slug}`}
            className="rounded-full border bg-white px-4 py-2 text-xs font-black uppercase text-slate-800 shadow-sm hover:border-blue-700 hover:bg-blue-50"
          >
            {category.nameEn}
          </Link>
        ))}
      </div>
    </div>
  );
}
