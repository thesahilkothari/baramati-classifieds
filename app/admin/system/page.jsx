import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";
import AdminLoginBox from "../../components/AdminLoginBox";
import { getEmailProviderStatus } from "../../lib/emailService";

export const dynamic = "force-dynamic";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://myclassifieds.in"
  ).replace(/\/+$/, "");
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}

function statusBadge(ok, labelWhenOk = "OK", labelWhenNotOk = "Check") {
  return (
    <span className={`rounded px-3 py-1 text-xs font-black uppercase ${ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
      {ok ? labelWhenOk : labelWhenNotOk}
    </span>
  );
}

function MaskedValue({ present, label }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-950">{label}</p>
        {statusBadge(present, "Set", "Missing")}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {present ? "Configured in deployment environment." : "Add this value in Vercel Environment Variables."}
      </p>
    </div>
  );
}

function MetricCard({ label, value, note }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      {note && <p className="mt-2 text-xs leading-5 text-slate-600">{note}</p>}
    </div>
  );
}

async function getSystemData() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const threeDaysAhead = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const [
    totalAds,
    pendingAds,
    activeAds,
    expiredAds,
    pendingPayments,
    paidPayments,
    paymentsLast7Days,
    expiryReminderTouched,
    lifecycleTouched,
    recentlySubmittedAds,
    recentlyApprovedAds,
    expiringSoonAds
  ] = await Promise.all([
    prisma.ad.count(),
    prisma.ad.count({ where: { status: "PENDING" } }),
    prisma.ad.count({ where: { status: "ACTIVE" } }),
    prisma.ad.count({ where: { status: "EXPIRED" } }),
    prisma.payment.count({ where: { provider: "MANUAL_UPI", status: "PENDING_MANUAL_VERIFICATION" } }),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.payment.count({ where: { status: "PAID", verifiedAt: { gte: sevenDaysAgo } } }),
    prisma.ad.count({ where: { expiryNoticeSentAt: { not: null } } }),
    prisma.ad.count({ where: { OR: [{ status: "EXPIRED" }, { isFeatured: false, featuredUntil: { lt: now } }] } }),
    prisma.ad.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: true, category: true, city: true } }),
    prisma.ad.findMany({ where: { approvedAt: { not: null } }, orderBy: { approvedAt: "desc" }, take: 5, include: { user: true, category: true, city: true } }),
    prisma.ad.findMany({ where: { status: "ACTIVE", expiresAt: { gt: now, lte: threeDaysAhead } }, orderBy: { expiresAt: "asc" }, take: 5, include: { user: true, category: true, city: true } })
  ]);

  return {
    totalAds,
    pendingAds,
    activeAds,
    expiredAds,
    pendingPayments,
    paidPayments,
    paymentsLast7Days,
    expiryReminderTouched,
    lifecycleTouched,
    recentlySubmittedAds,
    recentlyApprovedAds,
    expiringSoonAds
  };
}

function AdMiniList({ title, ads, emptyText }) {
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black uppercase text-slate-950">{title}</h2>
      <div className="mt-4 divide-y">
        {ads.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">{emptyText}</p>
        ) : (
          ads.map((ad) => (
            <div key={ad.id} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black text-slate-950">#{ad.id} {ad.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {ad.user?.email || "No email"} | {ad.mobile || "No mobile"} | {ad.city?.name || "-"}
                  </p>
                </div>
                <span className="rounded bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-700">
                  {ad.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Created: {formatDate(ad.createdAt)} | Approved: {formatDate(ad.approvedAt)} | Expires: {formatDate(ad.expiresAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default async function AdminSystemPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <AdminLoginBox />
      </main>
    );
  }

  const emailStatus = getEmailProviderStatus();
  const systemData = await getSystemData();
  const baseUrl = getBaseUrl();
  const cronSecretConfigured = Boolean(process.env.CRON_SECRET);

  const cronLinks = [
    {
      label: "Expiry Reminder Dry Run",
      href: `${baseUrl}/api/cron/ad-reminders?dryRun=1&token=YOUR_CRON_SECRET`
    },
    {
      label: "Ad Lifecycle Dry Run",
      href: `${baseUrl}/api/cron/ad-lifecycle?dryRun=1&token=YOUR_CRON_SECRET`
    }
  ];

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-6 md:px-4">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">Admin System</p>
          <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-5xl">
            Health & Integration Check
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700">
            Use this page after every deployment to confirm database connectivity, email provider configuration, cron protection, ad lifecycle automation, reminder automation, and payment flow readiness.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Ads" value={systemData.totalAds} note="All ads in database" />
          <MetricCard label="Active Ads" value={systemData.activeAds} note="Visible listings" />
          <MetricCard label="Pending Moderation" value={systemData.pendingAds} note="Needs admin review" />
          <MetricCard label="Pending UPI" value={systemData.pendingPayments} note="Needs payment verification" />
          <MetricCard label="Paid Payments" value={systemData.paidPayments} note="All verified payments" />
          <MetricCard label="Paid Last 7 Days" value={systemData.paymentsLast7Days} note="Recent payment momentum" />
          <MetricCard label="Expiry Reminders" value={systemData.expiryReminderTouched} note="Ads touched by reminder system" />
          <MetricCard label="Expired Ads" value={systemData.expiredAds} note="Reactivation opportunities" />
        </section>

        <section className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black uppercase text-slate-950">Email Provider</h2>
              <p className="mt-1 text-sm text-slate-600">Transactional emails, OTPs, reminders, lifecycle emails and outreach emails depend on this.</p>
            </div>
            {statusBadge(emailStatus.hasResendApiKey || emailStatus.hasSmtp, "Ready", "Not Ready")}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MaskedValue label="RESEND_API_KEY" present={emailStatus.hasResendApiKey} />
            <MaskedValue label="Resend Key Format" present={!emailStatus.hasResendApiKey || emailStatus.resendKeyLooksValid} />
            <MaskedValue label="SMTP Backup" present={emailStatus.hasSmtp} />
            <MaskedValue label="EMAIL_FROM" present={Boolean(emailStatus.from)} />
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <strong>Sender:</strong> {emailStatus.from || "Not configured"}
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black uppercase text-slate-950">Cron & Automation</h2>
              <p className="mt-1 text-sm text-slate-600">Checks protection and test URLs for reminder and lifecycle jobs.</p>
            </div>
            {statusBadge(cronSecretConfigured, "Protected", "Missing Secret")}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MaskedValue label="CRON_SECRET" present={cronSecretConfigured} />
            <MaskedValue label="NEXT_PUBLIC_SITE_URL" present={Boolean(process.env.NEXT_PUBLIC_SITE_URL)} />
            <MaskedValue label="JWT_SECRET" present={Boolean(process.env.JWT_SECRET)} />
            <MaskedValue label="DATABASE_URL" present={Boolean(process.env.DATABASE_URL)} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {cronLinks.map((link) => (
              <div key={link.href} className="rounded-2xl border bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-950">{link.label}</p>
                <p className="mt-2 break-all font-mono text-xs text-slate-600">{link.href}</p>
                <p className="mt-2 text-xs text-slate-500">Replace YOUR_CRON_SECRET manually before opening.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <AdMiniList title="Recent Submissions" ads={systemData.recentlySubmittedAds} emptyText="No recent submissions." />
          <AdMiniList title="Recently Approved" ads={systemData.recentlyApprovedAds} emptyText="No approvals yet." />
          <AdMiniList title="Expiring Soon" ads={systemData.expiringSoonAds} emptyText="No active ads expiring in next 3 days." />
        </section>

        <section className="rounded-3xl border bg-slate-950 p-5 text-white shadow-sm">
          <h2 className="text-xl font-black uppercase">Quick Links</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/dashboard" className="rounded-xl bg-white px-4 py-2 text-xs font-black uppercase text-slate-950">Dashboard</Link>
            <Link href="/admin/growth" className="rounded-xl bg-white px-4 py-2 text-xs font-black uppercase text-slate-950">Growth</Link>
            <Link href="/admin/outreach" className="rounded-xl bg-white px-4 py-2 text-xs font-black uppercase text-slate-950">Outreach</Link>
            <Link href="/admin/payments" className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase text-white">Payments</Link>
            <Link href="/admin" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black uppercase text-white">Moderation</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
