import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatAmount(amountInPaise) {
  const amount = Number(amountInPaise || 0) / 100;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getStatusClass(status) {
  if (status === "PAID") return "bg-green-700 text-white";
  if (status === "CREATED") return "bg-blue-700 text-white";
  if (status?.startsWith("FAILED")) return "bg-red-700 text-white";
  return "bg-slate-800 text-white";
}

export default async function AdminPaymentsPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">
            Admin Login Required
          </h1>

          <p className="mt-3 text-slate-600">
            Please login to view payment records.
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

  const payments = await prisma.payment.findMany({
    include: {
      ad: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          adType: true,
          isFeatured: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 100
  });

  const webhookEvents = await prisma.paymentWebhookEvent.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 50
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Admin Payments
            </p>

            <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-4xl">
              Razorpay Payments & Webhooks
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Review payment orders, browser verification status and Razorpay
              webhook processing records.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border bg-white px-5 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
          >
            Back to Admin
          </Link>
        </div>

        <section className="mt-8 rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <h2 className="text-2xl font-black uppercase text-slate-950">
              Latest Payments
            </h2>

            <span className="rounded bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">
              {payments.length} Records
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1150px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="border border-slate-300 p-3">Date</th>
                  <th className="border border-slate-300 p-3">Status</th>
                  <th className="border border-slate-300 p-3">Amount</th>
                  <th className="border border-slate-300 p-3">Plan</th>
                  <th className="border border-slate-300 p-3">Ad</th>
                  <th className="border border-slate-300 p-3">Order ID</th>
                  <th className="border border-slate-300 p-3">Payment ID</th>
                  <th className="border border-slate-300 p-3">Verified</th>
                  <th className="border border-slate-300 p-3">Webhook</th>
                </tr>
              </thead>

              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="border border-slate-300 p-6 text-center text-slate-600"
                    >
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-300 p-3 align-top">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        <span className={`rounded px-3 py-1 text-xs font-black uppercase ${getStatusClass(payment.status)}`}>
                          {payment.status}
                        </span>
                        {payment.failureReason && (
                          <p className="mt-2 text-xs text-red-700">
                            {payment.failureReason}
                          </p>
                        )}
                      </td>

                      <td className="border border-slate-300 p-3 align-top font-black">
                        {formatAmount(payment.amount)}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {payment.plan || "-"}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {payment.ad ? (
                          <Link
                            href={`/ads/${payment.ad.slug}`}
                            target="_blank"
                            className="font-bold text-blue-700 underline"
                          >
                            #{payment.ad.id} {payment.ad.title}
                          </Link>
                        ) : (
                          "-"
                        )}

                        {payment.ad?.status && (
                          <p className="mt-1 text-xs font-bold uppercase text-slate-500">
                            {payment.ad.status} | {payment.ad.adType}
                          </p>
                        )}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        <span className="break-all font-mono text-xs">
                          {payment.razorpayOrderId}
                        </span>
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        <span className="break-all font-mono text-xs">
                          {payment.razorpayPaymentId || "-"}
                        </span>
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        {formatDate(payment.verifiedAt)}
                      </td>

                      <td className="border border-slate-300 p-3 align-top">
                        <span className="break-all font-mono text-xs">
                          {payment.webhookEventId || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <h2 className="text-2xl font-black uppercase text-slate-950">
              Latest Razorpay Webhook Events
            </h2>

            <span className="rounded bg-blue-700 px-3 py-1 text-xs font-black uppercase text-white">
              {webhookEvents.length} Events
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="border border-slate-300 p-3">Received</th>
                  <th className="border border-slate-300 p-3">Event</th>
                  <th className="border border-slate-300 p-3">Processed</th>
                  <th className="border border-slate-300 p-3">Order ID</th>
                  <th className="border border-slate-300 p-3">Payment ID</th>
                  <th className="border border-slate-300 p-3">Error / Note</th>
                </tr>
              </thead>

              <tbody>
                {webhookEvents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-slate-300 p-6 text-center text-slate-600"
                    >
                      No webhook events received yet.
                    </td>
                  </tr>
                ) : (
                  webhookEvents.map((event) => (
                    <tr key={event.id} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-300 p-3">
                        {formatDate(event.createdAt)}
                      </td>
                      <td className="border border-slate-300 p-3 font-bold">
                        {event.eventType}
                      </td>
                      <td className="border border-slate-300 p-3">
                        {event.processed ? "Yes" : "No"}
                      </td>
                      <td className="border border-slate-300 p-3">
                        <span className="break-all font-mono text-xs">
                          {event.razorpayOrderId || "-"}
                        </span>
                      </td>
                      <td className="border border-slate-300 p-3">
                        <span className="break-all font-mono text-xs">
                          {event.razorpayPaymentId || "-"}
                        </span>
                      </td>
                      <td className="border border-slate-300 p-3">
                        {event.error || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
