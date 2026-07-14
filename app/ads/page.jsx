import Link from "next/link";
import SearchBar from "../components/SearchBar";
import AdCard from "../components/AdCard";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse Ads | My Classifieds",
  description: "Browse classified ads in Baramati and Maharashtra."
};

export default async function AdsPage({ searchParams }) {
  const params = await searchParams;

  const q = params?.q?.trim() || "";
  const city = params?.city?.trim() || "";
  const category = params?.category?.trim() || "";

  let ads = [];

  try {
    ads = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { description: { contains: q } },
                { address: { contains: q } }
              ]
            }
          : {}),
        ...(city
          ? {
              city: {
                slug: city
              }
            }
          : {}),
        ...(category
          ? {
              category: {
                slug: category
              }
            }
          : {})
      },
      include: {
        images: true,
        category: true,
        city: true
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 60
    });
  } catch (error) {
    console.error("Ads fetch failed:", error);
  }

  return (
    <main className="bg-slate-50">
      <section className="bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="text-sm font-semibold text-blue-300">
            ← Back to Home
          </Link>

          <h1 className="mt-4 text-4xl font-extrabold">
            Browse Classified Ads
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Find property, jobs, vehicles, electronics, agriculture equipment
            and local services in Baramati and nearby cities.
          </p>

          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {ads.length} Active Ads
          </h2>

          <Link
            href="/post-ad"
            className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
          >
            Post Free Ad
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="rounded-3xl border bg-white p-10 text-center text-slate-600">
            No ads found. Try another search or post the first ad.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
