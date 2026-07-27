import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { buildPageMetadata } from "../../lib/seo";
import { getAllowedAdCityWhere } from "../../lib/locations";
import JsonLd from "../../components/JsonLd";
import {
  buildBreadcrumbSchema,
  buildClassifiedProductSchema
} from "../../lib/jsonLd";

export const dynamic = "force-dynamic";

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

function getWhatsAppUrl(ad) {
  const phone = ad.whatsapp || ad.mobile;
  const message = encodeURIComponent(
    `Hello, I am interested in your classified ad on My Classifieds: ${ad.title}`
  );
  return `https://wa.me/91${phone}?text=${message}`;
}

function isFeaturedAd(ad) {
  return Boolean(
    ad?.isFeatured &&
      (!ad?.featuredUntil || new Date(ad.featuredUntil) > new Date())
  );
}

function getAdWhere(slug, now) {
  return {
    AND: [
      { slug },
      { status: "ACTIVE" },
      getAllowedAdCityWhere(),
      { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }
    ]
  };
}

export async function generateMetadata({ params }) {
  const now = new Date();
  const resolvedParams = await params;
  const ad = await prisma.ad.findFirst({
    where: getAdWhere(resolvedParams.slug, now),
    include: { city: true, category: true, images: true }
  });

  if (!ad) {
    return buildPageMetadata({
      title: "Ad Not Found | My Classifieds",
      path: `/ads/${resolvedParams.slug}`,
      noIndex: true
    });
  }

  const image = ad.images?.[0]?.url || "/opengraph-image";

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
    where: getAdWhere(resolvedParams.slug, now),
    include: { images: true, category: true, city: true }
  });

  if (!ad) notFound();

  const featured = isFeaturedAd(ad);
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Browse Ads", path: "/ads" },
      {
        name: ad.category?.nameEn || "Classified",
        path: `/ads?category=${ad.category?.slug || ""}`
      },
      { name: ad.title, path: `/ads/${ad.slug}` }
    ]),
    buildClassifiedProductSchema(ad)
  ];

  return (
    <>
      <JsonLd data={structuredData} />

      <main className="bg-[#F8FAFC] px-4 py-10">
        <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <Link href="/ads" className="text-sm font-bold text-[#0F3D5E]">
              ← Back to Classified Board
            </Link>

            <article className="mt-5 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {featured && (
                  <span className="rounded bg-[#F59E0B] px-3 py-1 text-xs font-black uppercase text-[#0F172A]">
                    Featured
                  </span>
                )}
                <span className="rounded bg-[#0F3D5E] px-3 py-1 text-xs font-black uppercase text-white">
                  {ad.category?.nameEn || "Classified"}
                </span>
                {ad.city?.name && (
                  <span className="rounded border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-1 text-xs font-black uppercase text-[#475569]">
                    {ad.city.name}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-black uppercase leading-tight text-[#0F172A] md:text-5xl">
                {ad.title}
              </h1>

              <p className="mt-4 text-3xl font-black text-[#C2410C]">
                {formatPrice(ad.price)}
              </p>

              <div className="mt-6 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-5">
                <h2 className="text-xl font-black uppercase text-[#0F172A]">
                  Classified Details
                </h2>
                <p className="mt-3 whitespace-pre-line text-base leading-7 text-[#475569]">
                  {ad.description}
                </p>
              </div>

              {ad.address && (
                <div className="mt-6 rounded-2xl border border-[#CBD5E1] bg-white p-5">
                  <h2 className="text-xl font-black uppercase text-[#0F172A]">
                    Location
                  </h2>
                  <p className="mt-3 text-[#475569]">{ad.address}</p>
                </div>
              )}

              {ad.expiresAt && (
                <p className="mt-5 text-sm font-semibold text-[#475569]">
                  This classified is valid until{" "}
                  {new Date(ad.expiresAt).toLocaleDateString("en-IN")}.
                </p>
              )}
            </article>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black uppercase text-[#0F172A]">
                Contact Advertiser
              </h2>
              <p className="mt-3 text-sm text-[#475569]">
                Contact directly through call or WhatsApp. Verify all details before payment.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href={`tel:${ad.mobile}`}
                  className="flex w-full justify-center rounded-xl bg-[#0F3D5E] px-5 py-3 font-black uppercase text-white hover:bg-[#0B2F49]"
                >
                  Call Advertiser
                </a>
                <a
                  href={getWhatsAppUrl(ad)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full justify-center rounded-xl bg-[#0F766E] px-5 py-3 font-black uppercase text-white hover:bg-teal-800"
                >
                  WhatsApp
                </a>
                <Link
                  href="/safety"
                  className="flex w-full justify-center rounded-xl border border-[#CBD5E1] px-5 py-3 font-black uppercase text-[#0F3D5E] hover:bg-[#F8FAFC]"
                >
                  Safety Tips
                </Link>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-sm text-yellow-900">
              <h3 className="font-black uppercase">Safety Reminder</h3>
              <p className="mt-2 leading-6">
                Do not share OTP, UPI PIN, bank passwords or card details. Meet in safe public places and verify documents before payment.
              </p>
            </div>

            <details className="mt-5 rounded-3xl border border-[#CBD5E1] bg-white p-5 text-sm text-[#475569] open:border-[#B91C1C] open:bg-red-50">
              <summary className="cursor-pointer list-none text-sm font-black uppercase text-[#B91C1C] underline-offset-4 hover:underline">
                Report a serious issue with this listing
              </summary>
              <p className="mt-3 leading-6">
                Use reporting only for spam, fraud, prohibited/illegal content, duplicate ads, safety concerns, IP/privacy issues or genuine grievances. Do not use it for negotiation pressure, rivalry or casual disagreement.
              </p>
              <Link
                href={`/report?adId=${ad.id}&adSlug=${ad.slug}&source=detail`}
                className="mt-4 inline-flex rounded-xl border border-[#B91C1C] bg-white px-4 py-2 text-xs font-black uppercase text-[#B91C1C] hover:bg-red-100"
              >
                Continue to report
              </Link>
            </details>
          </aside>
        </section>
      </main>
    </>
  );
}
