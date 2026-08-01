import Link from "next/link";
import { HELP_FAQS } from "../lib/brandCopy";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Help Centre: Posting, Pricing & Ad Approval | My Classifieds",
  description:
    "Find clear answers about posting, moderation, pricing, upgrades, renewals, safety and grievances on My Classifieds.",
  path: "/support"
});

export default function SupportPage() {
  return (
    <main className="bg-[#F8FAFC] px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
            Help Centre
          </p>

          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-[#0F3D5E] md:text-5xl">
            Quick answers. Local support when you need it.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#475569] md:text-base">
            Find clear answers about posting, moderation, pricing, upgrades, renewals, safety and grievances.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/post-ad"
              className="rounded-xl bg-[#C2410C] px-5 py-3 text-sm font-black uppercase text-white hover:bg-orange-800"
            >
              Post an Advertisement
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-black uppercase text-[#0F3D5E] hover:bg-slate-50"
            >
              Contact Support
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {HELP_FAQS.map((faq) => (
            <article key={faq.question} className="rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-[#0F172A]">
                {faq.question}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#475569]">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
