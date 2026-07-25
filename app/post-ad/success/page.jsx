import Link from "next/link";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatAmount(amountInPaise) {
  const amount = Number(amountInPaise || 0) / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default async function PostAdSuccessPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const adId = Number(resolvedSearchParams?.adId);
  let ad = null;

  if (adId) {
    ad = await prisma.ad.findUnique({
      where: { id: adId },
      include: {
        category: true,
        city: true,
        payments: { orderBy: { createdAt: "desc" }, take: 1 }
      }
    });
  }

  const payment = ad?.payments?.[0] || null;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-4xl rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-green-700">Classified Submitted</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-slate-950 md:text-5xl">Your classified is pending approval</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700">The classified has been submitted to My Classifieds. It will be reviewed by admin before publication. Paid/featured benefits are applied only after manual UPI payment verification.</p>

        {ad ? (
          <div className="mt-6 rounded-2xl border bg-slate-50 p-5">
            <h2 className="text-xl font-black text-slate-950">{ad.title}</h2>
            <div className="mt-3 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-black">Ad ID:</span> {ad.id}</p>
              <p><span className="font-black">Status:</span> {ad.status}</p>
              <p><span className="font-black">Category:</span> {ad.category?.nameEn || "-"}</p>
              <p><span className="font-black">City:</span> {ad.city?.name || "-"}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm leading-6 text-yellow-900">The ad reference was not found in the page URL. Please check the admin panel for the latest submitted classified.</div>
        )}

        {payment ? (
          <div className="mt-6 rounded-2xl border-2 border-blue-700 bg-blue-50 p-5 text-blue-950">
            <p className="text-sm font-black uppercase tracking-wide">Manual UPI Payment Submitted</p>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <p><span className="font-black">Payment Status:</span> {payment.status}</p>
              <p><span className="font-black">Amount:</span> {formatAmount(payment.amount)}</p>
              <p><span className="font-black">Plan:</span> {payment.plan}</p>
              <p><span className="font-black">Submitted:</span> {formatDate(payment.manualSubmittedAt || payment.createdAt)}</p>
              <p className="md:col-span-2"><span className="font-black">Reference:</span> {payment.manualReferenceNumber || "-"}</p>
            </div>
            <p className="mt-4 text-sm leading-6">Admin will verify your UPI transaction from the company bank/UPI statement. After verification and ad approval, the selected plan will be applied.</p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-green-700 bg-green-50 p-5 text-green-950">
            <p className="font-black uppercase">Free Classified</p>
            <p className="mt-2 text-sm leading-6">No payment is required. The free classified will go live after admin approval.</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/post-ad" className="rounded-xl bg-red-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-red-700">Post Another Classified</Link>
          <Link href="/ads" className="rounded-xl border px-6 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50">View Classified Board</Link>
          <a href="https://wa.me/919673931166" className="rounded-xl border px-6 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50">Contact Support</a>
        </div>
      </section>
    </main>
  );
}
