import SoldStatusForm from "../components/SoldStatusForm";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Confirm Sold Status | My Classifieds",
  description:
    "Confirm whether your listed product or service is sold or still available.",
  path: "/sold-status",
  noIndex: true
});

export default async function SoldStatusPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const adId = String(resolvedSearchParams?.adId || "");
  const mobile = String(resolvedSearchParams?.mobile || "");
  const email = String(resolvedSearchParams?.email || "");

  return (
    <main className="bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Ad Status Confirmation
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase text-slate-950 md:text-5xl">
            Is your item or service sold?
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            Confirm whether the product/service in your classified is sold
            through My Classifieds, sold elsewhere, or still available.
          </p>
        </div>

        <SoldStatusForm initialAdId={adId} initialMobile={mobile} initialEmail={email} />
      </section>
    </main>
  );
}
