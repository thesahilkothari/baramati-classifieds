import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getAdminSession } from "../../lib/adminAuth";
import AdminManualPaymentActions from "../../components/AdminManualPaymentActions";

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
  if (status === "PENDING_MANUAL_VERIFICATION") {
    return "bg-yellow-400 text-slate-950";
  }
  if (status === "CREATED") return "bg-blue-700 text-white";
  if (status?.startsWith("FAILED") || status?.startsWith("REJECTED")) {
    return "bg-red-700 text-white";
  }
  return "bg-slate-800 text-white";
}

function parsePaymentDetails(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return {
      note: value || ""
    };
  }
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

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Admin Payments
            </p>

            <h1 className="mt-2 text-3xl font-black uppercase text-slate-950 md:text-4xl">
              Manual UPI Payments
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Review UPI transaction references submitted by users, verify them
              against your bank/UPI statement, and apply the selected plan.
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
            <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="border border-slate-300 p-3">Date</th>
                  <th className="border border-slate-300 p-3">Status</th>
                  <th className="border border-slate-300 p-3">Amount</th>
                  <th className="border border-slate-300 p-3">Plan</th>
                  <th className="border border-slate-300 p-3">Ad</th>
                  <th className="border border-slate-300 p-3">Reference</th>
                  <th className="border border-slate-300 p-3">UPI UTR</th>
                  <th className="border border-slate-300 p-3">Payer / Note</th>
                  <th className="border border-slate-300 p-3">Verified</th>
                  <th className="border border-slate-300 p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="border border-slate-300 p-6 text-center text-slate-600"
                    >
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => {
                    const details = parsePaymentDetails(payment.failureReason);
                    const isManual =
                      payment.status === "PENDING_MANUAL_VERIFICATION" ||
                      String(payment.razorpayOrderId || "").startsWith("MC-");

                    return (
                      <tr key={payment.id} className="odd:bg-white even:bg-slate-50">
                        <td className="border border-slate-300 p-3 align-top">
                          {formatDate(payment.createdAt)}
                        </td>

                        <td className="border border-slate-300 p-3 align-top">
                          <span className={`rounded px-3 py-1 text-xs font-black uppercase ${getStatusClass(payment.status)}`}>
                            {payment.status}
                          </span>
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
                          {isManual ? (
                            <>
                              <p>{details.payerName || "-"}</p>
                              <p className="text-xs text-slate-500">
                                {details.payerMobile || "-"}
                              </p>
                              {details.note && (
                                <p className="mt-2 text-xs text-slate-600">
                                  {details.note}
                                </p>
                              )}
                              {details.adminNote && (
                                <p className="mt-2 text-xs font-bold text-blue-700">
                                  Admin: {details.adminNote}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-slate-500">
                              Razorpay / old gateway record
                            </p>
                          )}
                        </td>

                        <td className="border border-slate-300 p-3 align-top">
                          {formatDate(payment.verifiedAt)}
                        </td>

                        <td className="border border-slate-300 p-3 align-top">
                          <AdminManualPaymentActions payment={payment} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
