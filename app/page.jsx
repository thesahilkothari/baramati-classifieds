import Link from "next/link";
import CategoryGrid from "./components/CategoryGrid";
import SearchBar from "./components/SearchBar";
import AdCard from "./components/AdCard";
import ContactSection from "./components/ContactSection";
import { prisma } from "./lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let ads = [];

  try {
    ads = await prisma.ad.findMany({
      where: { status: "ACTIVE" },
      include: {
        images: true,
        category: true,
        city: true
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 8
    });
  } catch (error) {
    console.error("Homepage ads fetch failed:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-blue-700 to-indigo-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-100">
              My Classifieds | Baramati & Maharashtra
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Buy, Sell, Rent & Find Jobs in Baramati
            </h1>

            <p className="mt-5 max-w-3xl text-lg text-blue-50">
              Trusted local classified ads platform for property, jobs,
              vehicles, electronics, agriculture equipment and local services.
            </p>
          </div>

          <div className="mt-8">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/post-ad"
              className="rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow-sm hover:bg-blue-50"
            >
              Post Free Ad
            </Link>

            <Link
              href="/ads"
              className="rounded-xl border border-white/70 px-6 py-3 font-bold text-white hover:bg-white/10"
            >
              View All Ads
            </Link>

            <a
              href="#contact"
              className="rounded-xl border border-white/70 px-6 py-3 font-bold text-white hover:bg-white/10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Popular Categories
          </h2>

          <Link href="/ads" className="font-semibold text-blue-700">
            View all ads
          </Link>
        </div>

        <CategoryGrid />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Latest Classified Ads
          </h2>

          <Link href="/post-ad" className="font-semibold text-blue-700">
            Post your ad
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-slate-600">
            No active ads are available yet. Be the first to post an ad.
            <div className="mt-5">
              <Link
                href="/post-ad"
                className="inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
              >
                Post Free Ad
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>

      <ContactSection />
    </main>
  );
}
