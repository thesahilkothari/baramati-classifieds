import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";
import ExpiryNoticeButton from "../../components/ExpiryNoticeButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Expiring Free Ads | Admin | My Classifieds",
  description: "Admin page for free classified ads expiring soon."
};

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function normalizePhoneNumber(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.length === 10) {
    return `91${digits}`;
  }

  return digits;
}

function buildWhatsAppExpiryMessage(ad) {
  const expiryDate = formatDate(ad.expiresAt);

  return [
    "Namaskar,",
    "",
    `Your free classified ad "${ad.title}" on My Classifieds will expire on ${expiryDate}.`,
    "",
    "Free ads are visible for 7 days only.",
    "",
    "To continue visibility, you can upgrade your ad:",
    "Paid Ad: ?199 for 7 days",
    "Premium Ad: ?499 for 30 days",
    "Featured Add-on: ?299 for 10 days for paid/premium ads",
    "",
    "Upgrade/payment options:",
    "https://myclassifieds.in/pricing",
    "",
    "Support:",
    "+91 9673931166",
    "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED"
  ].join("\n");
}

function buildWhatsAppUrl(ad) {
  const phone = normalizePhoneNumber(ad.whatsapp || ad.mobile);
  const message = encodeURIComponent(buildWhatsAppExpiryMessage(ad));

  return `https://wa.me/${phone}?text=${message}`;
}

function getDaysLeft(expiresAt) {
  if (!expiresAt) return "Unknown";

  const now = new Date();
  const expiry = new Date(expiresAt);
  const difference = expiry.getTime() - now.getTime();
  const days = Math.ceil(difference / (24 * 60 * 60 * 1000));

  if (days <= 0) {
    return "Expires today";
  }

  if (days === 1) {
    return "1 day left";
  }

  return `${days} days left`;
}

export default async function AdminExpiringAdsPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <main className="bg-slate-100 px-4 py-12">
        <section className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">
            Admin Login Required
          </h1>

          <p className="mt-3 text-slate-600">
            Please login as admin to view expiring classifieds.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white"
          >
            Go to Admin Login
          </Link>
        </section>
      </main>
    );
  }

  const now = new Date();
  const twoDaysLater = addDays(now, 2);

  let expiringAds = [];
  let recentlyNotifiedAds = [];

  try {
    expiringAds = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FREE",
        expiresAt: {
          gt: now,
          lte: twoDaysLater
        },
        expiryNoticeSentAt: null
      },
      include: {
        category: true,
        city: true,
        user: true
      },
      orderBy: {
        expiresAt: "asc"
      },
      take: 100
    });

    recentlyNotifiedAds = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FREE",
        expiresAt: {
          gt: now,
          lte: twoDaysLater
        },
        expiryNoticeSentAt: {
          not: null
        }
      },
      include: {
        category: true,
        city: true,
        user: true
      },
      orderBy: {
        expiryNoticeSentAt: "desc"
      },
      take: 50
    });
  } catch (error) {
    console.error("Expiring ads fetch failed:", error);
  }

  return (
    <main className="bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-red-600">
                Admin Reminder Center
              </p>

              <h1 className="mt-2 text-4xl font-black uppercase text-slate-950">
                Expiring Free Classifieds
              </h1>

              <p className="mt-3 max-w-3xl text-slate-600">
                These free ads will expire within the next 2 days. Open the
                ready WhatsApp message, send the reminder, and then mark notice
                as sent.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/ads"
                className="rounded-xl border px-5 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
              >
                Admin Ads
              </Link>

              <Link
                href="/pricing"
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-black uppercase text-white hover:bg-blue-800"
              >
                View Plans
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border bg-red-50 p-5">
              <p className="text-sm font-black uppercase text-red-700">
                Pending Notices
              </p>
              <p className="mt-2 text-4xl font-black text-red-700">
                {expiringAds.length}
              </p>
            </div>

            <div className="rounded-2xl border bg-green-50 p-5">
              <p className="text-sm font-black uppercase text-green-700">
                Already Notified
              </p>
              <p className="mt-2 text-4xl font-black text-green-700">
                {recentlyNotifiedAds.length}
              </p>
            </div>

            <div className="rounded-2xl border bg-yellow-50 p-5">
              <p className="text-sm font-black uppercase text-yellow-800">
                Reminder Window
              </p>
              <p className="mt-2 text-lg font-black text-yellow-900">
                Next 2 Days
              </p>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-3xl border-2 border-red-600 bg-white p-4 shadow-sm">
          <div className="border-b-2 border-red-600 pb-3">
            <h2 className="text-2xl font-black uppercase text-slate-950">
              Notices To Be Sent
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Free ads expiring soon and not yet marked as notified.
            </p>
          </div>

          {expiringAds.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-black text-slate-900">
                No free ads need expiry notice right now
              </h3>

              <p className="mt-2 text-slate-600">
                When free ads come within 2 days of expiry, they will appear
                here.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {expiringAds.map((ad) => (
                <article
                  key={ad.id}
                  className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="rounded bg-red-600 px-3 py-1 text-xs font-black uppercase text-white">
                        {getDaysLeft(ad.expiresAt)}
                      </span>

                      <h3 className="mt-3 text-xl font-black uppercase text-slate-950">
                        {ad.title}
                      </h3>
                    </div>

                    <span className="rounded bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">
                      Free Ad
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                    <p>
                      <span className="font-black text-slate-900">
                        Category:
                      </span>{" "}
                      {ad.category?.nameEn || "Not available"}
                    </p>

                    <p>
                      <span className="font-black text-slate-900">City:</span>{" "}
                      {ad.city?.name || "Not available"}
                    </p>

                    <p>
                      <span className="font-black text-slate-900">
                        Mobile:
                      </span>{" "}
                      {ad.mobile}
                    </p>

                    <p>
                      <span className="font-black text-slate-900">
                        WhatsApp:
                      </span>{" "}
                      {ad.whatsapp || ad.mobile}
                    </p>

                    <p>
                      <span className="font-black text-slate-900">
                        Expires:
                      </span>{" "}
                      {formatDate(ad.expiresAt)}
                    </p>

                    <p>
                      <span className="font-black text-slate-900">
                        Posted By:
                      </span>{" "}
                      {ad.user?.name || "Not provided"}
                    </p>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {ad.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <ExpiryNoticeButton
                      adId={ad.id}
                      whatsappUrl={buildWhatsAppUrl(ad)}
                    />

                    <Link
                      href={`/ads/${ad.slug}`}
                      target="_blank"
                      className="rounded-xl border px-4 py-3 text-sm font-black uppercase text-slate-700 hover:bg-white"
                    >
                      View Ad
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {recentlyNotifiedAds.length > 0 && (
          <section className="mt-6 rounded-3xl border bg-white p-4 shadow-sm">
            <div className="border-b pb-3">
              <h2 className="text-2xl font-black uppercase text-slate-950">
                Already Notified
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Free ads expiring soon where expiry notice has already been
                marked as sent.
              </p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {recentlyNotifiedAds.map((ad) => (
                <article
                  key={ad.id}
                  className="rounded-2xl border bg-green-50 p-5"
                >
                  <h3 className="text-lg font-black uppercase text-slate-950">
                    {ad.title}
                  </h3>

                  <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                    <p>
                      <span className="font-black text-slate-900">
                        Expires:
                      </span>{" "}
                      {formatDate(ad.expiresAt)}
                    </p>

                    <p>
                      <span className="font-black text-slate-900">
                        Notice Sent:
                      </span>{" "}
                      {formatDate(ad.expiryNoticeSentAt)}
                    </p>

                    <p>
                      <span className="font-black text-slate-900">
                        Mobile:
                      </span>{" "}
                      {ad.mobile}
                    </p>

                    <p>
                      <span className="font-black text-slate-900">
                        Category:
                      </span>{" "}
                      {ad.category?.nameEn || "Not available"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}