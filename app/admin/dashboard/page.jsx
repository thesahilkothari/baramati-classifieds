import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";
import { ADMIN_OVERRIDE_PROVIDER } from "../../lib/adminAdTools";
import AdminLoginBox from "../../components/AdminLoginBox";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatCurrency(amountInPaise) {
  const amount = Number(amountInPaise || 0) / 100;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getTodayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getFutureDate(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function getDashboardData() {
  const todayStart = getTodayStart();
  const expiringUntil = getFutureDate(3);

  const [
    pendingAds,
    activeAds,
    rejectedAds,
    expiredAds,
    soldAds,
    featuredAds,
    adminOverrideAds,
    adsPostedToday,
    expiringSoon,
    pendingPayments,
    paidPayments,
    rejectedPayments,
    paymentRevenue,
    newReports,
    openReports,
    followupsDue,
    latestPendingAds,
    latestPayments,
    latestReports,
    latestAdminOverrides
  ] = await Promise.all([
    prisma.ad.count({ where: { status: "PENDING" } }),
    prisma.ad.count({ where: { status: "ACTIVE" } }),
    prisma.ad.count({ where: { status: "REJECTED" } }),
    prisma.ad.count({ where: { status: "EXPIRED" } }),
    prisma.ad.count({ where: { status: "SOLD" } }),
    prisma.ad.count({
      where: {
        status: "ACTIVE",
        isFeatured: true,
        OR: [{ featuredUntil: null }, { featuredUntil: { gt: new Date() } }]
      }
    }),
    prisma.ad.count({
      where: {
        payments: {
          some: {
            provider: ADMIN_OVERRIDE_PROVIDER
          }
        }
      }
    }),
    prisma.ad.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.ad.count({ where: { status: "ACTIVE", expiresAt: { lte: expiringUntil } } }),
    prisma.payment.count({ where: { provider: "MANUAL_UPI", status: "PENDING_MANUAL_VERIFICATION" } }),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.payment.count({ where: { status: { startsWith: "REJECTED" } } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.reportTicket.count({ where: { status: "NEW" } }).catch(() => 0),
    prisma.reportTicket
      .count({
        where: {
          status: { in: ["NEW", "ACKNOWLEDGED", "UNDER_REVIEW", "ACTION_REQUIRED"] }
        }
      })
      .catch(() => 0),
    prisma.ad.count({
      where: {
        OR: [
          { status: "ACTIVE", expiresAt: { lte: expiringUntil } },
          { status: "EXPIRED", updatedAt: { gte: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) } },
          { soldStatus: "AVAILABLE" }
        ]
      }
    }),
    prisma.ad.findMany({
      where: { status: "PENDING" },
      include: { category: true, city: true, user: true },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.payment.findMany({
      where: { provider: "MANUAL_UPI" },
      include: { ad: { select: { id: true, title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.reportTicket.findMany({ orderBy: { createdAt: "desc" }, take: 8 }).catch(() => []),
    prisma.payment.findMany({
      where: { provider: ADMIN_OVERRIDE_PROVIDER },
      include: { ad: { select: { id: true, title: true, slug: true, status: true, expiresAt: true, adType: true, isFeatured: true } } },
      orderBy: { createdAt: "desc" },
      take: 8
    })
  ]);

  return {
    counts: {
      pendingAds,
      activeAds,
      rejectedAds,
      expiredAds,
      soldAds,
      featuredAds,
      adminOverrideAds,
      adsPostedToday,
      expiringSoon,
      pendingPayments,
      paidPayments,
      rejectedPayments,
      revenueInPaise: paymentRevenue._sum.amount || 0,
      newReports,
      openReports,
      followupsDue
    },
    latestPendingAds,
    latestPayments,
    latestReports,
    latestAdminOverrides
  };
}

function StatCard({ title, value, subtitle, href, tone = "slate" }) {
  const toneClass =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-900"
      : tone === "green"
        ? "border-green-200 bg-green-50 text-green-900"
        : tone === "yellow"
          ? "border-yellow-200 bg-yellow-50 text-yellow-900"
          : tone === "blue"
            ? "border-blue-200 bg-blue-50 text-blue-900"
            : tone === "indigo"
              ? "border-indigo-200 bg-indigo-50 text-indigo-900"
              : "border-slate-200 bg-white text-slate-950";

  const content = (
    <article className={`rounded-3xl border p-5 shadow-sm ${toneClass}`}>
      <p className="text-xs font-black uppercase tracking-wide opacity-70">{title}</p>
      <p className="mt-3 text-4xl font-black">{value}</p>
      {subtitle && <p className="mt-2 text-sm font-semibold leading-6 opacity-80">{subtitle}</p>}
    </article>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block hover:-translate-y-0.5 hover:transition">
      {content}
    </Link>
  );
}

function MiniListCard({ title, href, emptyText, children }) {
  return (
    <article className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <h2 className="text-xl font-black uppercase text-slate-950">{title}</h2>
        <Link href={href} className="text-xs font-black uppercase text-blue-700">View All</Link>
      </div>
      <div className="mt-4 space-y-3">{children || <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{emptyText}</p>}</div>
    </article>
  );
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <AdminLoginBox />
      </main>
    );
  }

  const { counts, latestPendingAds, latestPayments, latestReports, latestAdminOverrides } = await getDashboardData();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-blue-700">Admin Dashboard</p>
              <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-5xl">Website Control Overview</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Manage moderation, payment verification, admin overrides, renewal follow-ups and compliance records from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/admin/ads/create" className="rounded-xl bg-indigo-700 px-5 py-3 text-sm font-black uppercase text-white hover:bg-indigo-800">Create Ad</Link>
              <Link href="/admin/ads" className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-black uppercase text-white hover:bg-blue-800">Review Ads</Link>
              <Link href="/admin/payments" className="rounded-xl bg-green-700 px-5 py-3 text-sm font-black uppercase text-white hover:bg-green-800">Verify Payments</Link>
            </div>
          </div>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Pending Ads" value={counts.pendingAds} subtitle="Needs moderation" href="/admin/ads?status=PENDING" tone="yellow" />
          <StatCard title="Pending Payments" value={counts.pendingPayments} subtitle="Manual UPI verification" href="/admin/payments" tone="green" />
          <StatCard title="Admin Overrides" value={counts.adminOverrideAds} subtitle="Ads changed by admin" href="/admin/ads?status=ADMIN_OVERRIDE" tone="indigo" />
          <StatCard title="Open Reports" value={counts.openReports} subtitle={`${counts.newReports} new report(s)`} href="/admin/grievances" tone="red" />
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Ads" value={counts.activeAds} subtitle={`${counts.featuredAds} currently featured`} href="/admin/ads?status=ACTIVE" />
          <StatCard title="Today Posted" value={counts.adsPostedToday} subtitle="New submissions today" />
          <StatCard title="Expiring Soon" value={counts.expiringSoon} subtitle="Within next 3 days" href="/admin/followups" tone="yellow" />
          <StatCard title="Paid Revenue" value={formatCurrency(counts.revenueInPaise)} subtitle={`${counts.paidPayments} paid payment(s)`} href="/admin/payments" tone="green" />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-4">
          <MiniListCard title="Latest Pending Ads" href="/admin/ads?status=PENDING" emptyText="No pending ads.">
            {latestPendingAds.length > 0 && latestPendingAds.map((ad) => (
              <div key={ad.id} className="rounded-2xl border p-4">
                <p className="font-black text-slate-950">#{ad.id} {ad.title}</p>
                <p className="mt-1 text-xs font-bold uppercase text-slate-500">{ad.category?.nameEn || "Category"} | {ad.city?.name || "City"}</p>
                <p className="mt-2 text-xs text-slate-500">Posted: {formatDate(ad.createdAt)}</p>
              </div>
            ))}
          </MiniListCard>

          <MiniListCard title="Latest Payments" href="/admin/payments" emptyText="No manual payments yet.">
            {latestPayments.length > 0 && latestPayments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-black text-slate-950">{formatCurrency(payment.amount)}</p>
                  <span className="rounded bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-white">{payment.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{payment.ad?.title || `Ad #${payment.adId}`}</p>
                <p className="mt-2 break-all font-mono text-xs text-slate-500">{payment.manualTransactionRef || payment.manualReferenceNumber || payment.razorpayOrderId}</p>
              </div>
            ))}
          </MiniListCard>

          <MiniListCard title="Admin Overrides" href="/admin/ads?status=ADMIN_OVERRIDE" emptyText="No admin override records yet.">
            {latestAdminOverrides.length > 0 && latestAdminOverrides.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="font-black text-indigo-950">#{payment.ad?.id} {payment.ad?.title || "Ad"}</p>
                <p className="mt-1 text-xs font-bold uppercase text-indigo-700">{payment.plan || "Override"} | {payment.ad?.status || "Status"}</p>
                <p className="mt-2 text-xs text-indigo-700">Expiry: {formatDate(payment.ad?.expiresAt)}</p>
              </div>
            ))}
          </MiniListCard>

          <MiniListCard title="Latest Reports" href="/admin/grievances" emptyText="No reports found.">
            {latestReports.length > 0 && latestReports.map((report) => (
              <div key={report.id} className="rounded-2xl border p-4">
                <p className="font-black text-slate-950">{report.referenceNumber}</p>
                <p className="mt-1 text-sm text-slate-600">{report.reason}</p>
                <p className="mt-2 text-xs font-bold uppercase text-slate-500">{report.status} | {formatDate(report.createdAt)}</p>
              </div>
            ))}
          </MiniListCard>
        </section>

        <section className="mt-8 rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black uppercase text-slate-950">Quick Operations</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { href: "/admin/ads", title: "Moderate Ads", text: "Approve, reject and manage status." },
              { href: "/admin/ads/create", title: "Create Ad", text: "Create an ad directly as admin." },
              { href: "/admin/ads?status=ADMIN_OVERRIDE", title: "Admin Overrides", text: "Review ads changed by admin." },
              { href: "/admin/payments", title: "Verify UPI", text: "Check UTR and apply paid plans." },
              { href: "/sitemap.xml", title: "View Sitemap", text: "Check generated SEO sitemap." }
            ].map((item) => (
              <Link key={item.href} href={item.href} target={item.href.startsWith("/sitemap") ? "_blank" : undefined} className="rounded-2xl border p-4 hover:border-blue-400 hover:bg-blue-50">
                <p className="font-black uppercase text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
