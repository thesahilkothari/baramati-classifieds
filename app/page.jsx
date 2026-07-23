import Link from "next/link";
import SearchBar from "./components/SearchBar";
import AdCard from "./components/AdCard";
import CategoryChips from "./components/CategoryChips";
import { prisma } from "./lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories = [];
  let premiumAds = [];
  let featuredAds = [];
  let paidAds = [];
  let freeAds = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { nameEn: "asc" }
    });

    premiumAds = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "PREMIUM"
      },
      include: {
        category: true,
        city: true
      },
      orderBy: { createdAt: "desc" },
      take: 12
    });

    featuredAds = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FEATURED"
      },
      include: {
        category: true,
        city: true
      },
      orderBy: { createdAt: "desc" },
      take: 12
    });

    paidAds = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FREE",
        payments: {
          some: {
            status: "PAID"
          }
        }
      },
      include: {
        category: true,
        city: true
      },
      orderBy: { createdAt: "desc" },
      take: 12
    });

    freeAds = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FREE",
        payments: {
          none: {
            status: "PAID"
          }
        }
      },
      include: {
        category: true,
        city: true
      },
      orderBy: { createdAt: "desc" },
      take: 24
    });
  } catch (error) {
    console.error("Homepage classified fetch failed:", error);
  }

  const promotedAds = [...premiumAds, ...featuredAds];

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="bg-gradient-to-br from-blue-700 to-indigo-900 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-black uppercase tracking-wide text-blue-100">
              My Classifieds | Baramati & Maharashtra
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Buy, Sell, Rent & Find Jobs in Baramati
            </h1>

            <p className="mt-5 max-w-3xl text-lg text-blue-50">
              Good-old newspaper style classifieds, now available on every
              mobile phone.
            </p>
          </div>

          <div className="mt-8">
            <SearchBar />
            <CategoryChips categories={categories} />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/post-ad"
              className="rounded-xl bg-red-600 px-6 py-3 font-black uppercase text-white shadow-sm hover:bg-red-700"
            >
              Place Your Classified
            </Link>

            <Link
              href="/ads"
              className="rounded-xl border border-white/70 px-6 py-3 font-black uppercase text-white hover:bg-white/10"
            >
              View Classified Board
            </Link>

            <a
              href="#contact"
              className="rounded-xl border border-white/70 px-6 py-3 font-black uppercase text-white hover:bg-white/10"
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-5 md:px-4">
        {promotedAds.length > 0 && (
          <section className="rounded-2xl border-2 border-red-600 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3 border-b-2 border-red-600 pb-2">
              <div>
                <p className="text-xs font-black uppercase text-red-600">
                  Top Visibility
                </p>
                <h2 className="text-xl font-black uppercase text-slate-950">
                  Premium & Featured Classifieds
                </h2>
              </div>

              <Link
                href="/pricing"
                className="rounded bg-red-600 px-3 py-2 text-xs font-black uppercase text-white"
              >
                Promote Ad
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {promotedAds.map((ad, index) => (
                <AdCard key={ad.id} ad={ad} index={index} />
              ))}
            </div>
          </section>
        )}

        {paidAds.length > 0 && (
          <section className="mt-6 rounded-2xl border-2 border-blue-700 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3 border-b-2 border-blue-700 pb-2">
              <h2 className="text-xl font-black uppercase text-slate-950">
                Paid Classifieds
              </h2>

              <span className="rounded bg-blue-700 px-3 py-1 text-xs font-black uppercase text-white">
                {paidAds.length} Ads
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paidAds.map((ad, index) => (
                <AdCard key={ad.id} ad={ad} index={index} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border-2 border-slate-900 bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3 border-b-2 border-slate-900 pb-2">
            <h2 className="text-xl font-black uppercase text-slate-950">
              Latest Free Classifieds
            </h2>

            <Link
              href="/ads"
              className="rounded bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white"
            >
              View All
            </Link>
          </div>

          {freeAds.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-black text-slate-900">
                No classifieds published yet
              </h3>
              <p className="mt-2 text-slate-600">
                Post your first classified and approve it from admin panel.
              </p>
              <Link
                href="/post-ad"
                className="mt-5 inline-flex rounded-xl bg-red-600 px-6 py-3 font-black uppercase text-white"
              >
                Place Classified
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {freeAds.map((ad, index) => (
                <AdCard key={ad.id} ad={ad} index={index} />
              ))}
            </div>
          )}
        </section>
      </section>

      <section id="contact" className="border-t bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Contact
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Place your classified advertisement
          </h2>

          <div className="mt-5 rounded-2xl border bg-slate-50 p-5 text-slate-700">
            <p className="font-bold">
              SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED
            </p>

            <p className="mt-2">
              WhatsApp:{" "}
              <a
                href="https://wa.me/919673931166"
                className="font-bold text-blue-700"
              >
                +91 9673931166
              </a>
            </p>

            <p>
              Email:{" "}
              <a
                href="mailto:sahilkothariepl@gmail.com"
                className="font-bold text-blue-700"
              >
                sahilkothariepl@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
