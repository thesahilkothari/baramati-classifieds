import Link from "next/link";
import SearchBar from "../components/SearchBar";
import AdCard from "../components/AdCard";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdsPage({ searchParams }) {
  const params = await searchParams;

  const query = params?.q?.trim() || "";
  const citySlug = params?.city?.trim() || "";

  let ads = [];

  try {
    ads = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        ...(query
          ? {
              OR: [
                { title: { contains: query } },
                { description: { contains: query } }
              ]
            }
          : {}),
        ...(citySlug
          ? {
              city: {
                slug: citySlug
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
      take: 50
    });
  } catch (error) {
    console.error("Ads page fetch failed:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm font-semibold text-blue-300">
            ← Back to Home
          </Link>

          <h1 className="mt-4 text-4xl font-bold">Browse Classified Ads</h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Search local ads for property, jobs, vehicles, electronics,
            agriculture equipment and services.
          </p>

          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {ads.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-slate-600">
            No active ads found.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
