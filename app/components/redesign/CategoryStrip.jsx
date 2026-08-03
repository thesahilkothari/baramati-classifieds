import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  Car,
  GraduationCap,
  Laptop,
  Sprout,
  Store,
  Wrench,
  Grid3X3
} from "lucide-react";

function getCategoryIcon(slug) {
  const normalized = String(slug || "").toLowerCase();

  if (normalized.includes("real") || normalized.includes("property")) return Building2;
  if (normalized.includes("job")) return BriefcaseBusiness;
  if (normalized.includes("vehicle") || normalized.includes("car")) return Car;
  if (normalized.includes("electronic")) return Laptop;
  if (normalized.includes("agriculture")) return Sprout;
  if (normalized.includes("education")) return GraduationCap;
  if (normalized.includes("service")) return Wrench;
  if (normalized.includes("business")) return Store;

  return Grid3X3;
}

export default function CategoryStrip({ categories = [], language = "en" }) {
  return (
    <section className="border-b border-[#E2E8F0] bg-white py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#002741]/60">
              Browse by Department
            </p>
            <h2 className="mt-1 font-[var(--font-plus-jakarta)] text-2xl font-black tracking-tight text-[#002741] md:text-3xl">
              What are you looking for today?
            </h2>
          </div>
          <Link
            href="/ads"
            className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-black uppercase text-[#002741] hover:border-[#002741] hover:bg-white"
          >
            View all categories
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden">
          <Link href="/ads" className="group flex min-w-[86px] flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#002741] text-white shadow-sm transition group-hover:-translate-y-1 md:h-20 md:w-20">
              <Grid3X3 className="h-6 w-6" strokeWidth={2.25} />
            </span>
            <span className="text-center text-[11px] font-black text-[#002741] md:text-xs">All Ads</span>
          </Link>

          {categories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            const name = language === "mr" ? category.nameMr || category.nameEn : category.nameEn;

            return (
              <Link
                key={category.id || category.slug}
                href={`/ads?category=${category.slug}`}
                className="group flex min-w-[86px] flex-col items-center gap-2"
                title={name}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2F4F6] text-[#002741] shadow-sm transition group-hover:-translate-y-1 group-hover:bg-[#CEE5FF] md:h-20 md:w-20">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <span className="line-clamp-2 text-center text-[11px] font-black text-[#42474E] group-hover:text-[#002741] md:text-xs">
                  {name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
