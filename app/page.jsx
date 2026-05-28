import Link from "next/link";
import { prisma } from "./lib/prisma";
import AdCard from "./components/AdCard";
import SearchBar from "./components/SearchBar";
import CategoryGrid from "./components/CategoryGrid";

export default async function HomePage() {
  const ads = await prisma.ad.findMany({
    where: { status: "ACTIVE" },
    include: {
      images: true,
      category: true,
      city: true,
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
    take: 8,
  });

  return (
    <main>
      <section className="bg-blue-700 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-3xl text-4xl font-extrabold md:text-6xl">
            Buy, Sell, Rent & Find Jobs in Baramati
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Local classified ads platform for Baramati and Maharashtra.
          </p>

          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link href="/ads" className="font-semibold text-blue-700">
            View all
          </Link>
        </div>

        <CategoryGrid />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="mb-6 text-2xl font-bold">Latest Ads</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </section>
    </main>
  );
}
