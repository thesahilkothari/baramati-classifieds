import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";
import AdminLoginBox from "../../components/AdminLoginBox";

export const dynamic = "force-dynamic";

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function daysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

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

function formatPercent(value) {
  if (!Number.isFinite(value)) return "0%";

  return `${Math.round(value)}%`;
}

function safeDivide(numerator, denominator) {
  if (!denominator) return 0;
  return (Number(numerator || 0) / Number(denominator)) * 100;
}

function getPlanLabel(adType) {
  if (adType === "PREMIUM") return "Premium";
  if (adType === "PAID") return "Paid";
  if (adType === "FEATURED") return "Featured";
  return "Free";
}

function getPaymentPlanLabel(plan) {
  if (!plan) return "-";
  return String(plan)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function aggregateRevenue(where) {
  const result = await prisma.payment.aggregate({
    where,
    _sum: {
      amount: true
    }
  });

  return result._sum.amount || 0;
}

async function getGrowthData() {
  const today = startOfToday();
  const last7Days = daysAgo(7);
  const last30Days = daysAgo(30);
  const next7Days = daysFromNow(7);

  const [
    totalAds,
    totalActiveAds,
    freeActiveAds,
    paidActiveAds,
    premiumActiveAds,
    featuredActiveAds,
    totalExpiredAds,
    totalSoldAds,
    adsLast7Days,
    adsLast30Days,
    freeAdsLast30Days,
    paidAdsLast30Days,
    premiumAdsLast30Days,
    paidPaymentsCount,
    paidPaymentsLast30Days,
    pendingManualPayments,
    revenueTotal,
    revenueLast7Days,
    revenueLast30Days,
    remindersLast30Days,
    followupsLast30Days,
    lifecycleExpiredLast30Days,
    expiringFreeAds,
    expiringPaidAds,
    expiredReactivationAds,
    topViewedAds,
    recentPaidPayments
  ] = await Promise.all([
    prisma.ad.count(),
    prisma.ad.count({ where: { status: "ACTIVE" } }),
    prisma.ad.count({ where: { status: "ACTIVE", adType: "FREE" } }),
    prisma.ad.count({ where: { status: "ACTIVE", adType: "PAID" } }),
    prisma.ad.count({ where: { status: "ACTIVE", adType: "PREMIUM" } }),
    prisma.ad.count({
      where: {
        status: "ACTIVE",
        isFeatured: true,
        OR: [{ featuredUntil: null }, { featuredUntil: { gt: new Date() } }]
      }
    }),
    prisma.ad.count({ where: { status: "EXPIRED" } }),
    prisma.ad.count({ where: { status: "SOLD" } }),
    prisma.ad.count({ where: { createdAt: { gte: last7Days } } }),
    prisma.ad.count({ where: { createdAt: { gte: last30Days } } }),
    prisma.ad.count({
      where: {
        createdAt: { gte: last30Days },
        adType: "FREE"
      }
    }),
    prisma.ad.count({
      where: {
        createdAt: { gte: last30Days },
        adType: "PAID"
      }
    }),
    prisma.ad.count({
      where: {
        createdAt: { gte: last30Days },
        adType: "PREMIUM"
      }
    }),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.payment.count({
      where: {
        status: "PAID",
        createdAt: { gte: last30Days }
      }
    }),
    prisma.payment.count({
      where: {
        provider: "MANUAL_UPI",
        status: "PENDING_MANUAL_VERIFICATION"
      }
    }),
    aggregateRevenue({ status: "PAID" }),
    aggregateRevenue({ status: "PAID", createdAt: { gte: last7Days } }),
    aggregateRevenue({ status: "PAID", createdAt: { gte: last30Days } }),
    prisma.ad.count({
      where: {
        expiryNoticeSentAt: { gte: last30Days }
      }
    }),
    prisma.ad.count({
      where: {
        followUpNoticeSentAt: { gte: last30Days }
      }
    }),
    prisma.ad.count({
      where: {
        status: "EXPIRED",
        updatedAt: { gte: last30Days }
      }
    }),
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: "FREE",
        expiresAt: {
          gt: today,
          lte: next7Days
        }
      },
      include: {
        user: true,
        category: true,
        city: true
      },
      orderBy: {
        expiresAt: "asc"
      },
      take: 10
    }),
    prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        adType: {
          in: ["PAID", "PREMIUM", "FEATURED"]
        },
        expiresAt: {
          gt: today,
          lte: next7Days
        }
      },
      include: {
        user: true,
        category: true,
        city: true
      },
      orderBy: {
        expiresAt: "asc"
      },
      take: 10
    }),
    prisma.ad.findMany({
      where: {
        status: "EXPIRED",
        soldStatus: {
          notIn: ["SOLD_MYCLASSIFIEDS", "SOLD_ELSEWHERE"]
        },
        updatedAt: {
          gte: last30Days
        }
      },
      include: {
        user: true,
        category: true,
        city: true
      },
      orderBy: [
        { views: "desc" },
        { updatedAt: "desc" }
      ],
      take: 10
    }),
    prisma.ad.findMany({
      where: {
        status: "ACTIVE"
      },
      include: {
        user: true,
        category: true,
        city: true
      },
      orderBy: {
        views: "desc"
      },
      take: 10
    }),
    prisma.payment.findMany({
      where: {
        status: "PAID"
      },
      include: {
        ad: {
          include: {
            user: true,
            category: true,
            city: true
          }
        }
      },
      orderBy: {
        verifiedAt: "desc"
      },
      take: 10
    })
  ]);

  const paidOrPremiumCreatedLast30Days = paidAdsLast30Days + premiumAdsLast30Days;
  const estimatedPlanConversionRate = safeDivide(
    paidOrPremiumCreatedLast30Days,
    Math.max(adsLast30Days, 1)
  );
  const paidShareOfActiveAds = safeDivide(
    paidActiveAds + premiumActiveAds + featuredActiveAds,
    Math.max(totalActiveAds, 1)
  );
  const soldRate = safeDivide(totalSoldAds, Math.max(totalAds, 1));
  const averageRevenuePerPaidPayment = paidPaymentsCount
    ? revenueTotal / paidPaymentsCount
    : 0;

  return {
    totals: {
      totalAds,
      totalActiveAds,
      freeActiveAds,
      paidActiveAds,
      premiumActiveAds,
      featuredActiveAds,
      totalExpiredAds,
      totalSoldAds,
      adsLast7Days,
      adsLast30Days,
      freeAdsLast30Days,
      paidAdsLast30Days,
      premiumAdsLast30Days,
      paidPaymentsCount,
      paidPaymentsLast30Days,
      pendingManualPayments,
      revenueTotal,
      revenueLast7Days,
      revenueLast30Days,
      remindersLast30Days,
      followupsLast30Days,
      lifecycleExpiredLast30Days,
      paidOrPremiumCreatedLast30Days,
      estimatedPlanConversionRate,
      paidShareOfActiveAds,
      soldRate,
      averageRevenuePerPaidPayment
    },
    expiringFreeAds,
    expiringPaidAds,
    expiredReactivationAds,
    topViewedAds,
    recentPaidPayments
  };
}

function MetricCard({ title, value, note, tone = "slate" }) {
  const toneClasses = {
    slate: "border-slate-200 bg-white text-slate-950",
    blue: "border-blue-200 bg-blue-50 text-blue-950",
    green: "border-green-200 bg-green-50 text-green-950",
    orange: "border-orange-200 bg-orange-50 text-orange-950",
    red: "border-red-200 bg-red-50 text-red-950"
  };

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${toneClasses[tone] || toneClasses.slate}`}>
      <p className="text-xs font-black uppercase tracking-wide opacity-70">
        {title}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      {note && <p className="mt-2 text-sm font-semibold opacity-80">{note}</p>}
    </div>
  );
}

function AdMiniTable({ title, description, ads, emptyText, actionLabel, actionBuilder }) {
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black uppercase text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed bg-slate-50 p-6 text-sm font-bold text-slate-600">
          {emptyText}
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Ad</th>
                <th className="px-3 py-3">Plan</th>
                <th className="px-3 py-3">City</th>
                <th className="px-3 py-3">Views</th>
                <th className="px-3 py-3">Expires</th>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b last:border-0">
                  <td className="px-3 py-3">
                    <p className="font-black text-slate-950">#{ad.id} {ad.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{ad.category?.nameEn || "-"}</p>
                  </td>
                  <td className="px-3 py-3 font-bold">{getPlanLabel(ad.adType)}</td>
                  <td className="px-3 py-3">{ad.city?.name || "-"}</td>
                  <td className="px-3 py-3 font-bold">{ad.views || 0}</td>
                  <td className="px-3 py-3">{formatDate(ad.expiresAt)}</td>
                  <td className="px-3 py-3">
                    <p>{ad.user?.name || "-"}</p>
                    <p className="text-xs text-slate-500">{ad.user?.email || "-"}</p>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={actionBuilder ? actionBuilder(ad) : `/ads/${ad.slug}`}
                      target="_blank"
                      className="rounded-xl bg-blue-700 px-3 py-2 text-xs font-black uppercase text-white"
                    >
                      {actionLabel || "Open"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PaymentsTable({ payments }) {
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black uppercase text-slate-950">Recent Paid Payments</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Use this to understand which plan types are producing revenue.
      </p>

      {payments.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed bg-slate-50 p-6 text-sm font-bold text-slate-600">
          No paid payments found yet.
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Plan</th>
                <th className="px-3 py-3">Ad</th>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Verified</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b last:border-0">
                  <td className="px-3 py-3 font-mono text-xs">
                    {payment.manualReferenceNumber || payment.razorpayOrderId || `#${payment.id}`}
                  </td>
                  <td className="px-3 py-3 font-black text-green-700">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-3 py-3">{getPaymentPlanLabel(payment.plan)}</td>
                  <td className="px-3 py-3">
                    {payment.ad ? (
                      <Link href={`/ads/${payment.ad.slug}`} target="_blank" className="font-bold text-blue-700">
                        #{payment.ad.id} {payment.ad.title}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <p>{payment.ad?.user?.name || "-"}</p>
                    <p className="text-xs text-slate-500">{payment.ad?.user?.email || "-"}</p>
                  </td>
                  <td className="px-3 py-3">{formatDate(payment.verifiedAt || payment.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default async function AdminGrowthPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <AdminLoginBox />
      </main>
    );
  }

  const data = await getGrowthData();
  const { totals } = data;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-green-700">
            Growth Intelligence
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-5xl">
            Revenue, Retention & Upgrade Dashboard
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700">
            Track whether free users are converting, which plans are producing revenue,
            which ads are nearing expiry, and where admin follow-up can create renewals.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Revenue" value={formatCurrency(totals.revenueTotal)} note="Verified paid payments" tone="green" />
          <MetricCard title="Revenue Last 30 Days" value={formatCurrency(totals.revenueLast30Days)} note={`${totals.paidPaymentsLast30Days} paid payments`} tone="green" />
          <MetricCard title="Pending UPI Payments" value={totals.pendingManualPayments} note="Verify quickly to reduce drop-off" tone="orange" />
          <MetricCard title="Average Paid Payment" value={formatCurrency(totals.averageRevenuePerPaidPayment)} note="Revenue per verified payment" tone="blue" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Active Ads" value={totals.totalActiveAds} note={`${totals.freeActiveAds} free, ${totals.paidActiveAds + totals.premiumActiveAds} paid/premium`} />
          <MetricCard title="Featured Active" value={totals.featuredActiveAds} note="Highest visibility inventory" tone="orange" />
          <MetricCard title="Paid Share" value={formatPercent(totals.paidShareOfActiveAds)} note="Paid/premium/featured share of active ads" tone="blue" />
          <MetricCard title="Sold Rate" value={formatPercent(totals.soldRate)} note="Based on ads marked sold" tone="green" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Ads Last 7 Days" value={totals.adsLast7Days} note="Recent posting momentum" />
          <MetricCard title="Ads Last 30 Days" value={totals.adsLast30Days} note={`${totals.freeAdsLast30Days} free, ${totals.paidOrPremiumCreatedLast30Days} paid/premium`} />
          <MetricCard title="Estimated Plan Conversion" value={formatPercent(totals.estimatedPlanConversionRate)} note="Paid/premium created ÷ total created in 30 days" tone="blue" />
          <MetricCard title="Reminder Touches" value={totals.remindersLast30Days} note={`${totals.followupsLast30Days} sold/renewal follow-ups`} tone="orange" />
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-black uppercase text-slate-950">Recommended Sales Actions</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="font-black text-orange-950">Convert Free Expiring Ads</p>
                <p className="mt-2 text-sm leading-6 text-orange-900">
                  Call or email owners of free ads expiring in 7 days and offer Paid or Premium renewal.
                </p>
              </div>
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                <p className="font-black text-green-950">Push Featured Add-on</p>
                <p className="mt-2 text-sm leading-6 text-green-900">
                  High-view active ads are the best candidates for Featured placement conversion.
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="font-black text-blue-950">Recover Expired Ads</p>
                <p className="mt-2 text-sm leading-6 text-blue-900">
                  Expired ads with views are warm leads. Ask whether sold; if not, send renewal link.
                </p>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="font-black text-red-950">Clear Payment Queue</p>
                <p className="mt-2 text-sm leading-6 text-red-900">
                  Pending manual payments should be verified quickly because delay reduces user trust.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-slate-950 p-5 text-white shadow-sm">
            <h2 className="text-xl font-black uppercase">Retention Snapshot</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-3 border-b border-white/10 pb-3">
                <dt className="text-slate-300">Expired ads</dt>
                <dd className="font-black">{totals.totalExpiredAds}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-white/10 pb-3">
                <dt className="text-slate-300">Expired in 30 days</dt>
                <dd className="font-black">{totals.lifecycleExpiredLast30Days}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-white/10 pb-3">
                <dt className="text-slate-300">Paid payments</dt>
                <dd className="font-black">{totals.paidPaymentsCount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-300">Revenue 7 days</dt>
                <dd className="font-black">{formatCurrency(totals.revenueLast7Days)}</dd>
              </div>
            </dl>
            <Link href="/admin/payments" className="mt-6 inline-flex rounded-xl bg-red-600 px-4 py-3 text-xs font-black uppercase text-white">
              Verify Payments
            </Link>
          </div>
        </section>

        <AdMiniTable
          title="Free Ads Expiring Soon"
          description="Best source for free-to-paid upgrade conversion. Follow up before visibility ends."
          ads={data.expiringFreeAds}
          emptyText="No free ads expiring in the next 7 days."
          actionLabel="Renew Link"
          actionBuilder={(ad) => `/renew?adId=${ad.id}&mobile=${ad.mobile}`}
        />

        <AdMiniTable
          title="Paid / Premium Ads Expiring Soon"
          description="Ask whether sold. If still available, push renewal or Featured visibility."
          ads={data.expiringPaidAds}
          emptyText="No paid or premium ads expiring in the next 7 days."
          actionLabel="Status Link"
          actionBuilder={(ad) => `/sold-status?adId=${ad.id}&mobile=${ad.mobile}`}
        />

        <AdMiniTable
          title="Expired Ads Worth Reactivating"
          description="Expired ads with recent activity are warm retention opportunities."
          ads={data.expiredReactivationAds}
          emptyText="No recent expired ads requiring reactivation follow-up."
          actionLabel="Renew Link"
          actionBuilder={(ad) => `/renew?adId=${ad.id}&mobile=${ad.mobile}`}
        />

        <AdMiniTable
          title="Top Viewed Active Ads"
          description="High-view ads are the strongest candidates for Premium or Featured upgrade offers."
          ads={data.topViewedAds}
          emptyText="No active ads found."
          actionLabel="Open Ad"
          actionBuilder={(ad) => `/ads/${ad.slug}`}
        />

        <PaymentsTable payments={data.recentPaidPayments} />
      </section>
    </main>
  );
}
