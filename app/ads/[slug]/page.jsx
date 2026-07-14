import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(price) {
  if (!price) return "Price on request";

  const amount = Number(price);

  if (Number.isNaN(amount)) return "Price on request";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getWhatsAppUrl(ad) {
  const phone = ad.whatsapp || ad.mobile;
  const message = encodeURIComponent(
    `Hello, I am interested in your ad on My Classifieds: ${ad.title}`
  );

  return `https://wa.me/91${phone}?text=${message}`;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const ad = await prisma.ad.findUnique({
    where: { slug: resolvedParams.slug },
    include: { city: true, category: true }
  });

  if (!ad) {
    return {
      title: "Ad Not Found | My Classifieds"
    };
  }

  return {
    title: `${ad.title} | My Classifieds`,
    description: ad.description.slice(0, 150)
  };
}

export default async function AdDetailPage({ params }) {
  const resolvedParams = await params;

  const ad = await prisma.ad.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      images: true,
      category: true,
      city: true
    }
  });

  if (!ad || ad.status !== "ACTIVE") {
    notFound();
  }

  return (
    <main className="bg-slate-50 px-4 py-10">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <Link href="/ads" className="text-sm font-semibold text-blue-700">
            ← Back to Ads
          </Link>

          <div className="mt-5 overflow-hidden rounded-3xl border bg-white shadow-sm">
            <div className="flex min-h-80 items-center justify-center bg-slate-100">
              {ad.images?.[0]?.url ? (
                <img
                  src={ad.images[0].url}
                  alt={ad.title}
                  className="h-full max-h-[520px] w-full object-cover"
                />
              ) : (
                <div className="p-16 text-center">
                  <div className="text-7xl">{ad.category?.icon || "📌"}</div>
                  <p className="mt-4 text-slate-500">No image uploaded</p>
                </div>
              )}
            </div>

            <div className="p-7">
              <div className="flex flex-wrap gap-2">
                {ad.isFeatured && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-800">
                    Featured
                  </span>
                )}

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {ad.category?.nameEn}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {ad.city?.name}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-extrabold text-slate-900 md:text-4xl">
                {ad.title}
              </h1>

              <p className="mt-4 text-3xl font-extrabold text-blue-700">
                {formatPrice(ad.price)}
              </p>

              <div className="mt-6 border-t pt-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Description
                </h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                  {ad.description}
                </p>
              </div>

              {ad.address && (
                <div className="mt-6 border-t pt-6">
                  <h2 className="text-xl font-bold text-slate-900">Location</h2>
                  <p className="mt-3 text-slate-700">{ad.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Contact Seller
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Contact directly through call or WhatsApp. Verify all details
              before making payment.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`tel:${ad.mobile}`}
                className="flex w-full justify-center rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
              >
                Call Seller
              </a>

              <a
                href={getWhatsAppUrl(ad)}
                target="_blank"
                rel="noreferrer"
                className="flex w-full justify-center rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
              >
                WhatsApp Seller
              </a>

              <Link
                href="/safety"
                className="flex w-full justify-center rounded-xl border px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                Read Safety Tips
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border bg-yellow-50 p-6 text-sm text-yellow-900">
            <h3 className="font-bold">Safety Reminder</h3>
            <p className="mt-2">
              Do not share OTP, UPI PIN, bank passwords or card details. Meet in
              safe public places and verify documents before payment.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
