import Link from "next/link";
import { SUPPORT_FAQS, getSupportWhatsAppUrl } from "../lib/supportFaq";

export const metadata = {
  title: "Help Centre | My Classifieds",
  description:
    "Get quick answers about posting ads, pricing, approval time and manual UPI payment on My Classifieds."
};

export default function SupportPage() {
  return (
    <main className="bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-green-700">
            Help Centre
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase text-slate-950 md:text-5xl">
            My Classifieds Support
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            Quick answers to common questions. For more help, use the WhatsApp
            support button.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/post-ad"
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-700"
            >
              Post Ad
            </Link>
            <a
              href={getSupportWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-green-700"
            >
              WhatsApp Support
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SUPPORT_FAQS.map((faq) => (
            <article key={faq.id} className="rounded-3xl border bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">{faq.question}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{faq.answer}</p>
              <a
                href={getSupportWhatsAppUrl(faq.id)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-xl border border-green-600 px-4 py-2 text-xs font-black uppercase text-green-700"
              >
                Ask on WhatsApp
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
