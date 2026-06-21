import Link from "next/link";
import CategoryGrid from "./components/CategoryGrid";
import SearchBar from "./components/SearchBar";
import AdCard from "./components/AdCard";
import { prisma } from "./lib/prisma";

export default async function HomePage() {
  const ads = await prisma.ad.findMany({
    where: {
      status: "ACTIVE"
    },
    include: {
      images: true,
      category: true,
      city: true
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" }
    ],
    take: 12
  });

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-700 to-indigo-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Buy, Sell, Rent & Find Jobs in Baramati
            </h1>

            <p className="mt-5 text-lg text-blue-100">
              Trusted local classified ads platform for Baramati and major
              cities of Maharashtra.
            </p>
          </div>

          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link href="/ads" className="text-sm font-semibold text-blue-700">
            View all ads
          </Link>
        </div>

        <CategoryGrid />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="mb-6 text-2xl font-bold">Latest Ads in Baramati</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </section>
    </div>
  );
}
