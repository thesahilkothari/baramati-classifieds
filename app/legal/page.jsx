import Link from "next/link";
import { LEGAL_PAGES, POLICY_EFFECTIVE_DATE, POLICY_VERSION } from "../lib/legalContent";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Legal Hub | My Classifieds",
  description: "Legal policies, privacy, refund, grievance and corporate information for My Classifieds.",
  path: "/legal"
});

export default function LegalHubPage() {
  return (
    <main className="bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Legal Hub
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase text-slate-950 md:text-5xl">
            My Classifieds Policies
          </h1>

          <p className="mt-4 max-w-3xl text-slate-700">
            Read the current legal, safety, privacy, grievance, refund and corporate documents for My Classifieds.
          </p>

          <div className="mt-5 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-950">
            Version {POLICY_VERSION} | Effective from {POLICY_EFFECTIVE_DATE}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {LEGAL_PAGES.map((page) => (
            <article key={page.slug} className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">{page.enTitle}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">{page.mrTitle}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/legal/${page.slug}?lang=en`}
                  className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-black uppercase text-white hover:bg-blue-800"
                >
                  English
                </Link>
                <Link
                  href={`/legal/${page.slug}?lang=mr`}
                  className="rounded-xl border px-4 py-2 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
                >
                  मराठी
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
