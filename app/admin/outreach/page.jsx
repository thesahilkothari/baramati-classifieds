import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";
import AdminLoginBox from "../../components/AdminLoginBox";
import AdminOutreachActions from "../../components/AdminOutreachActions";
import { getOutreachTemplate } from "../../lib/outreachTemplates";

export const dynamic = "force-dynamic";

function getDateAfterDays(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function getDateBeforeDays(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatCurrency(amount) {
  if (!amount) return "Call for price";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(amount));
}

function getRecipientEmail(ad) {
  const email = String(ad.user?.email || "").trim().toLowerCase();
  return email.includes("@") ? email : "-";
}

function getRecipientMobile(ad) {
  return ad.whatsapp || ad.mobile || ad.user?.mobile || "";
}

function makeLeadCardTitle(ad) {
  return `${ad.title} #${ad.id}`;
}

async function fetchOutreachData() {
  const now = new Date();
  const soon = getDateAfterDays(5);
  const expiredSince = getDateBeforeDays(45);

  const [freeExpiring, paidExpiring, expiredWorthReactivating, highViewFreeAds] = await Promise.all([
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FREE",
        expiresAt: {
          gt: now,
          lte: soon
        }
      },
      include: { user: true, category: true, city: true },
      orderBy: { expiresAt: "asc" },
      take: 25
    }),
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: { in: ["PAID", "PREMIUM", "FEATURED"] },
        expiresAt: {
          gt: now,
          lte: soon
        }
      },
      include: { user: true, category: true, city: true },
      orderBy: { expiresAt: "asc" },
      take: 25
    }),
    prisma.ad.findMany({
      where: {
        status: "EXPIRED",
        updatedAt: {
          gte: expiredSince
        },
        soldStatus: {
          notIn: ["SOLD_MYCLASSIFIEDS", "SOLD_ELSEWHERE"]
        }
      },
      include: { user: true, category: true, city: true },
      orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
      take: 25
    }),
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FREE",
        views: {
          gte: 10
        }
      },
      include: { user: true, category: true, city: true },
      orderBy: [{ views: "desc" }, { createdAt: "desc" }],
      take: 25
    })
  ]);

  return {
    freeExpiring,
    paidExpiring,
    expiredWorthReactivating,
    highViewFreeAds
  };
}

function LeadTable({ title, subtitle, ads, templateKey, emptyText }) {
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black uppercase text-slate-950">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
          {ads.length} leads
        </span>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-2xl border bg-slate-50 p-6 text-sm font-semibold text-slate-600">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => {
            const outreach = getOutreachTemplate(ad, templateKey);
            const mobile = getRecipientMobile(ad);

            return (
              <article key={`${templateKey}-${ad.id}`} className="rounded-2xl border bg-slate-50 p-4">
                <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded bg-slate-950 px-2 py-1 text-xs font-black uppercase text-white">
                        {ad.adType}
                      </span>
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-black uppercase text-blue-700">
                        {ad.status}
                      </span>
                      {ad.isFeatured && (
                        <span className="rounded bg-orange-500 px-2 py-1 text-xs font-black uppercase text-white">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-black text-slate-950">
                      {makeLeadCardTitle(ad)}
                    </h3>

                    <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2 lg:grid-cols-4">
                      <p><span className="font-black">Email:</span> {getRecipientEmail(ad)}</p>
                      <p><span className="font-black">Mobile:</span> {mobile || "-"}</p>
                      <p><span className="font-black">City:</span> {ad.city?.name || "-"}</p>
                      <p><span className="font-black">Category:</span> {ad.category?.nameEn || "-"}</p>
                      <p><span className="font-black">Price:</span> {formatCurrency(ad.price)}</p>
                      <p><span className="font-black">Views:</span> {ad.views || 0}</p>
                      <p><span className="font-black">Expiry:</span> {formatDate(ad.expiresAt)}</p>
                      <p><span className="font-black">Created:</span> {formatDate(ad.createdAt)}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {ad.slug && (
                        <Link
                          href={`/ads/${ad.slug}`}
                          target="_blank"
                          className="rounded-xl border bg-white px-3 py-2 text-xs font-black uppercase text-slate-700 hover:bg-slate-50"
                        >
                          Public Ad
                        </Link>
                      )}
                      <Link
                        href={`/admin/growth`}
                        className="rounded-xl border bg-white px-3 py-2 text-xs font-black uppercase text-slate-700 hover:bg-slate-50"
                      >
                        Growth Dashboard
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-black uppercase text-slate-500">Suggested Template</p>
                    <p className="mt-1 text-sm font-black text-slate-950">{outreach.subject}</p>
                    <p className="mt-3 line-clamp-4 whitespace-pre-line text-xs leading-5 text-slate-600">
                      {outreach.text}
                    </p>
                    <div className="mt-4">
                      <AdminOutreachActions
                        adId={ad.id}
                        templateKey={templateKey}
                        whatsappMobile={mobile}
                        whatsappMessage={outreach.whatsappText}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default async function AdminOutreachPage() {
  const session = await getAdminSession();

  if (!session) {
    return <AdminLoginBox />;
  }

  const data = await fetchOutreachData();
  const totalLeads =
    data.freeExpiring.length +
    data.paidExpiring.length +
    data.expiredWorthReactivating.length +
    data.highViewFreeAds.length;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-red-600">
            Admin Outreach Centre
          </p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-tight text-slate-950 md:text-5xl">
            Convert, Renew & Reactivate Sellers
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700">
            This page turns growth analytics into direct action. Use ready email and WhatsApp templates to convert free users, renew paid users, reactivate expired ads and upsell high-view listings.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-500">Total Outreach Leads</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{totalLeads}</p>
            </div>
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-500">Free Expiring</p>
              <p className="mt-2 text-3xl font-black text-blue-700">{data.freeExpiring.length}</p>
            </div>
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-500">Paid Renewals</p>
              <p className="mt-2 text-3xl font-black text-green-700">{data.paidExpiring.length}</p>
            </div>
            <div className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-500">Reactivation Leads</p>
              <p className="mt-2 text-3xl font-black text-red-700">{data.expiredWorthReactivating.length}</p>
            </div>
          </div>
        </div>

        <LeadTable
          title="Free Ads Expiring Soon"
          subtitle="Best conversion opportunity. Contact these users before free visibility ends and offer Paid or Premium renewal."
          ads={data.freeExpiring}
          templateKey="FREE_UPGRADE"
          emptyText="No free ads are expiring in the next 5 days."
        />

        <LeadTable
          title="Paid / Premium Ads Expiring Soon"
          subtitle="High-intent sellers. Ask whether the item is sold. If still available, push renewal or Featured placement."
          ads={data.paidExpiring}
          templateKey="PAID_RENEWAL"
          emptyText="No paid or premium ads are expiring in the next 5 days."
        />

        <LeadTable
          title="Expired Ads Worth Reactivating"
          subtitle="Warm leads from the last 45 days. Prioritize high-view ads first."
          ads={data.expiredWorthReactivating}
          templateKey="EXPIRED_REACTIVATION"
          emptyText="No recent expired ads are available for reactivation follow-up."
        />

        <LeadTable
          title="High-View Free Ads"
          subtitle="These ads already have demand signals. Suggest Premium or Featured placement for better performance."
          ads={data.highViewFreeAds}
          templateKey="HIGH_VIEW_UPGRADE"
          emptyText="No high-view free ads found yet."
        />
      </section>
    </main>
  );
}
