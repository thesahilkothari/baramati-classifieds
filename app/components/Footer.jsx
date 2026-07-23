import Link from "next/link";
import { LEGAL_PAGES } from "../lib/legalContent";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="text-2xl font-black uppercase">
            My Classifieds
          </Link>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Good-old newspaper-style local classifieds, now available on every
            mobile phone for Baramati and Maharashtra.
          </p>

          <div className="mt-5 space-y-1 text-sm text-slate-300">
            <p>
              WhatsApp:{" "}
              <a
                href="https://wa.me/919673931166"
                className="font-bold text-white hover:text-blue-300"
              >
                +91 9673931166
              </a>
            </p>

            <p>
              Email:{" "}
              <a
                href="mailto:connect@myclassifieds.in"
                className="font-bold text-white hover:text-blue-300"
              >
                connect@myclassifieds.in
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">
            Classifieds
          </h2>

          <nav className="mt-4 space-y-2 text-sm text-slate-300">
            <Link href="/ads" className="block hover:text-white">
              Browse Ads
            </Link>

            <Link href="/post-ad" className="block hover:text-white">
              Place Classified
            </Link>

            <Link href="/pricing" className="block hover:text-white">
              Pricing
            </Link>

            <Link href="/safety" className="block hover:text-white">
              Safety Tips
            </Link>

            <Link href="/contact" className="block hover:text-white">
              Contact
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">
            Legal
          </h2>

          <nav className="mt-4 space-y-2 text-sm text-slate-300">
            <Link href="/legal" className="block hover:text-white">
              Legal Hub
            </Link>
            {LEGAL_PAGES.slice(0, 6).map((page) => (
              <Link
                key={page.slug}
                href={`/legal/${page.slug}`}
                className="block hover:text-white"
              >
                {page.enTitle}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-slate-800 pt-5 text-xs leading-6 text-slate-400">
        <p>
          My Classifieds is owned and operated by SAHIL KOTHARI ENTERPRISES
          PRIVATE LIMITED | CIN: U74999PN2014PTC150594 | Registered Office:
          Vardhaman Capital, Plot No. 13, Gat No. 42/1, Mouje Rui, Taluka
          Baramati, District Pune, Maharashtra – 413133 | Tel: +91 9673931166 |
          Email: connect@myclassifieds.in | Contact person for queries/grievances:
          Shekhar V. K., Contact Person under Rule 26.
        </p>
        <p className="mt-3">© 2026 My Classifieds. All rights reserved.</p>
      </div>
    </footer>
  );
}
