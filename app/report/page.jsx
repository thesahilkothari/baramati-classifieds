import ReportForm from "../components/ReportForm";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Report Listing / Grievance | My Classifieds",
  description: "Report a classified listing, submit a grievance or raise a takedown request with My Classifieds.",
  path: "/report"
});

export default async function ReportPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const adId = String(resolvedSearchParams?.adId || "");
  const adSlug = String(resolvedSearchParams?.adSlug || "");
  return (
    <main className="bg-[#F8FAFC] px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-[#B91C1C]">
            Report / Grievance
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase text-[#0F172A] md:text-5xl">
            Report a genuine issue or raise a grievance
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#475569]">
            Use this form for fake listings, prohibited content, fraud, safety issues, duplicate ads, intellectual property complaints, privacy concerns, payment/refund support and other genuine grievances connected with My Classifieds.
          </p>
          <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-yellow-900">
            Reporting is a serious moderation tool. Please do not use it for bargaining pressure, rivalry, harassment or casual disagreement. False, abusive or weaponized reports may be rejected.
          </div>
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            For urgent legal or safety concerns, also email <a href="mailto:connect@myclassifieds.in" className="font-bold underline">connect@myclassifieds.in</a>. Grievance Officer / contact person: Shekhar V. K.
          </div>
        </div>
        <ReportForm initialAdId={adId} initialAdSlug={adSlug} />
      </section>
    </main>
  );
}
