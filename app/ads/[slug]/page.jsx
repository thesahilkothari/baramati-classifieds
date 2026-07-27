import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { buildPageMetadata } from "../../lib/seo";

export const dynamic = "force-dynamic";

function formatPrice(price) {
  if (!price) return "Call for Price";
  const amount = Number(price);
  if (Number.isNaN(amount)) return "Call for Price";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function getWhatsAppUrl(ad) {
  const phone = ad.whatsapp || ad.mobile;
  const message = encodeURIComponent(`Hello, I am interested in your classified ad on My Classifieds: ${ad.title}`);
  return `https://wa.me/91${phone}?text=${message}`;
}

function isFeaturedAd(ad) {
  return Boolean(ad?.isFeatured && ad?.featuredUntil && new Date(ad.featuredUntil) > new Date());
}

export async function generateMetadata({ params }) {
  const now = new Date();
  const resolvedParams = await params;
  const ad = await prisma.ad.findFirst({
    where: { AND: [{ slug: resolvedParams.slug }, { status: "ACTIVE" }, { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }] },
    include: { city: true, category: true, images: true }
  });
  if (!ad) {
    return buildPageMetadata({
      title: "Ad Not Found | My Classifieds",
      path: `/ads/${resolvedParams.slug}`,
      noIndex: true
    });
  }

  const image = ad.images?.[0]?.url || "/og-image.jpg";

  return buildPageMetadata({
    title: `${ad.title} | My Classifieds`,
    description: ad.description.slice(0, 150),
    path: `/ads/${ad.slug}`,
    image
  });
}

export default async function AdDetailPage({ params }) {
  const now = new Date();
  const resolvedParams = await params;
  const ad = await prisma.ad.findFirst({
    where: { AND: [{ slug: resolvedParams.slug }, { status: "ACTIVE" }, { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }] },
    include: { images: true, category: true, city: true }
  });

  if (!ad) notFound();
  const featured = isFeaturedAd(ad);

  return (
    <main className="bg-slate-100 px-4 py-10">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <Link href="/ads" className="text-sm font-bold text-blue-700">← Back to Classified Board</Link>
          <article className="mt-5 rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {featured && <span className="rounded bg-orange-500 px-3 py-1 text-xs font-black uppercase text-white">Featured</span>}
              <span className="rounded bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">{ad.category?.nameEn || "Classified"}</span>
              {ad.city?.name && <span className="rounded bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-800">{ad.city.name}</span>}
            </div>
            <h1 className="mt-5 text-3xl font-black uppercase leading-tight text-slate-950 md:text-5xl">{ad.title}</h1>
            <p className="mt-4 text-3xl font-black text-red-700">{formatPrice(ad.price)}</p>
            <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-black uppercase text-slate-950">Classified Details</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-800">{ad.description}</p>
            </div>
            {ad.address && <div className="mt-6 rounded-2xl border bg-white p-5"><h2 className="text-xl font-black uppercase text-slate-950">Location</h2><p className="mt-3 text-slate-700">{ad.address}</p></div>}
            {ad.expiresAt && <p className="mt-5 text-sm font-semibold text-slate-500">This classified is valid until {new Date(ad.expiresAt).toLocaleDateString("en-IN")}.</p>}
          </article>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black uppercase text-slate-900">Contact Advertiser</h2>
            <p className="mt-3 text-sm text-slate-600">Contact directly through call or WhatsApp. Verify all details before payment.</p>
            <div className="mt-6 space-y-3">
              <a href={`tel:${ad.mobile}`} className="flex w-full justify-center rounded-xl bg-blue-700 px-5 py-3 font-black uppercase text-white hover:bg-blue-800">Call Advertiser</a>
              <a href={getWhatsAppUrl(ad)} target="_blank" rel="noreferrer" className="flex w-full justify-center rounded-xl bg-green-600 px-5 py-3 font-black uppercase text-white hover:bg-green-700">WhatsApp</a>
              <Link href="/safety" className="flex w-full justify-center rounded-xl border px-5 py-3 font-black uppercase text-slate-700 hover:bg-slate-50">Safety Tips</Link>
              <Link href={`/report?adId=${ad.id}&adSlug=${ad.slug}`} className="flex w-full justify-center rounded-xl border border-red-300 bg-red-50 px-5 py-3 font-black uppercase text-red-700 hover:bg-red-100">Report This Ad</Link>
            </div>
          </div>
          <div className="mt-5 rounded-3xl border bg-yellow-50 p-6 text-sm text-yellow-900"><h3 className="font-black uppercase">Safety Reminder</h3><p className="mt-2">Do not share OTP, UPI PIN, bank passwords or card details. Meet in safe public places and verify documents before payment.</p></div>
        </aside>
      </section>
    </main>
  );
}
