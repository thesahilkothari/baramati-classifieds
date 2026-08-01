import Link from "next/link";
import { buildPageMetadata } from "../lib/seo";
import { SAFETY_RULES } from "../lib/brandCopy";

export const metadata = buildPageMetadata({
  title: "Classified Ad Safety Tips | My Classifieds",
  description:
    "Read practical precautions for contacting advertisers, checking property, jobs, goods and services, making payments and reporting suspicious classified ads.",
  path: "/safety"
});

export default function SafetyPage() {
  return (
    <main className="bg-[#F8FAFC] px-4 py-12">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
          Safety Centre
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-[#0F3D5E] md:text-5xl">
          Good local connections begin with careful verification.
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-[#475569] md:text-lg">
          My Classifieds helps users discover advertisements and contact advertisers. Before paying, travelling, sharing documents or accepting an offer, independently verify the person, item, service and terms.
        </p>

        <div className="mt-8 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
          <ul className="space-y-4 text-[#475569]">
            {SAFETY_RULES.map((tip) => (
              <li key={tip} className="flex gap-3 text-sm leading-7 md:text-base">
                <span className="font-black text-[#0F766E]">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <section className="mt-6 rounded-3xl border border-[#CBD5E1] bg-[#0F3D5E] p-6 text-white shadow-sm">
          <h2 className="text-2xl font-black uppercase">Pause. Verify. Then proceed.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-100">
            My Classifieds publishes advertisements but does not guarantee the advertiser, goods, services, documents or transaction.
          </p>
          <Link
            href="/report"
            className="mt-5 inline-flex rounded-xl bg-[#C2410C] px-5 py-3 text-sm font-black uppercase text-white"
          >
            Report a Suspicious Ad
          </Link>
        </section>
      </section>
    </main>
  );
}
