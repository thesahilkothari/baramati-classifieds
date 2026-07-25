import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";
import {
  buildMailtoUrl,
  buildSoldStatusEmailBody,
  buildSoldStatusEmailSubject,
  buildSoldStatusMessage,
  buildWhatsAppUrl
} from "../../lib/renewalMessages";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function getDaysFromNow(value) {
  if (!value) return null;
  const ms = new Date(value).getTime() - Date.now();
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

export default async function AdminFollowupsPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">
            Admin Login Required
          </h1>
          <p className="mt-3 text-slate-600">
            Please login to view follow-up reminders.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-black uppercase text-white"
          >
            Go to Admin
          </Link>
        </section>
      </main>
    );
  }

  const now = new Date();
  const reminderFrom = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
  const reminderUntil = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const ads = await prisma.ad.findMany({
    where: {
      OR: [
        {
          status: "ACTIVE",
          expiresAt: {
            lte: reminderUntil
          }
        },
        {
          status: "EXPIRED",
          updatedAt: {
            gte: reminderFrom
          }
        },
        {
          soldStatus: "AVAILABLE"
        }
      ]
    },
    include: {
      user: true,
      category: true,
      city: true
    },
    orderBy: [
      {
        expiresAt: "asc"
      },
      {
        updatedAt: "desc"
      }
    ],
    take: 100
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Admin Follow-ups
            </p>

            <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-4xl">
              Sold Status & Renewal Reminders
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Use these generated Email and WhatsApp links to ask users whether
              their item/service is sold. If not sold, the same message invites
              them to renew or upgrade.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border bg-white px-5 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
          >
            Back to Admin
          </Link>
        </div>

        <div className="mt-8 space-y-5">
          {ads.length === 0 ? (
            <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                No follow-ups due
              </h2>
              <p className="mt-2 text-slate-600">
                Ads nearing expiry, expired recently, or marked available will
                appear here.
              </p>
            </div>
          ) : (
            ads.map((ad) => {
              const message = buildSoldStatusMessage(ad);
              const emailSubject = buildSoldStatusEmailSubject(ad);
              const emailBody = buildSoldStatusEmailBody(ad);
              const emailUrl = buildMailtoUrl(ad.user?.email, emailSubject, emailBody);
              const whatsappUrl = buildWhatsAppUrl(ad.whatsapp || ad.mobile, message);
              const daysLeft = getDaysFromNow(ad.expiresAt);

              return (
                <article
                  key={ad.id}
                  className="rounded-3xl border bg-white p-5 shadow-sm"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">
                          Ad #{ad.id}
                        </span>
                        <span className="rounded bg-blue-700 px-3 py-1 text-xs font-black uppercase text-white">
                          {ad.status}
                        </span>
                        <span className="rounded bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-800">
                          {ad.soldStatus || "UNKNOWN"}
                        </span>
                        {daysLeft !== null && (
                          <span className="rounded bg-yellow-100 px-3 py-1 text-xs font-black uppercase text-yellow-900">
                            {daysLeft >= 0
                              ? `${daysLeft} day(s) left`
                              : `${Math.abs(daysLeft)} day(s) expired`}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-2xl font-black text-slate-950">
                        {ad.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-600">
                        {ad.category?.nameEn || "Classified"} |{" "}
                        {ad.city?.name || "Location not specified"}
                      </p>

                      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                        <div className="rounded-2xl border p-4">
                          <p className="font-black uppercase text-slate-950">
                            User
                          </p>
                          <p className="mt-2">{ad.user?.name || "-"}</p>
                          <p>{ad.mobile}</p>
                          <p>{ad.user?.email || "No email saved"}</p>
                        </div>

                        <div className="rounded-2xl border p-4">
                          <p className="font-black uppercase text-slate-950">
                            Dates
                          </p>
                          <p className="mt-2">Approved: {formatDate(ad.approvedAt)}</p>
                          <p>Expires: {formatDate(ad.expiresAt)}</p>
                          <p>Updated: {formatDate(ad.updatedAt)}</p>
                        </div>
                      </div>

                      <textarea
                        readOnly
                        value={message}
                        className="mt-4 min-h-40 w-full rounded-2xl border bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                      />
                    </div>

                    <div className="rounded-2xl border bg-slate-50 p-4">
                      <p className="font-black uppercase text-slate-950">
                        Send Follow-up
                      </p>

                      <div className="mt-4 space-y-3">
                        {emailUrl ? (
                          <a
                            href={emailUrl}
                            className="flex w-full justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black uppercase text-white hover:bg-blue-800"
                          >
                            Send Email
                          </a>
                        ) : (
                          <div className="rounded-xl bg-slate-200 p-3 text-center text-xs font-bold text-slate-600">
                            Email not available
                          </div>
                        )}

                        {whatsappUrl ? (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex w-full justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-green-700"
                          >
                            Send WhatsApp
                          </a>
                        ) : (
                          <div className="rounded-xl bg-slate-200 p-3 text-center text-xs font-bold text-slate-600">
                            WhatsApp not available
                          </div>
                        )}

                        <Link
                          href={`/renew?adId=${ad.id}&mobile=${ad.mobile}`}
                          className="flex w-full justify-center rounded-xl border bg-white px-5 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
                        >
                          Open Renewal Page
                        </Link>

                        <Link
                          href={`/sold-status?adId=${ad.id}&mobile=${ad.mobile}`}
                          className="flex w-full justify-center rounded-xl border bg-white px-5 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
                        >
                          Open Sold Status Page
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
