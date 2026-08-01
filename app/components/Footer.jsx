import Link from "next/link";
import { cookies } from "next/headers";
import BrandLogo from "./BrandLogo";
import { getLanguageFromCookieStore } from "../lib/i18n";
import {
  COMPANY_RULE26_DISCLOSURE_EN,
  COMPANY_RULE26_DISCLOSURE_MR
} from "../lib/companyDetails";
import { BRAND_SIGNATURE_MR } from "../lib/brandCopy";

const groups = [
  {
    title: "Explore",
    links: [
      ["/ads", "Browse Ads"],
      ["/ads", "Categories"],
      ["/pricing", "Pricing"],
      ["/post-ad", "Post an Advertisement"]
    ]
  },
  {
    title: "Know Us",
    links: [
      ["/about", "About"],
      ["/support", "Help Centre"],
      ["/safety", "Safety Centre"],
      ["/baramati/property", "Baramati Property"]
    ]
  },
  {
    title: "Policies",
    links: [
      ["/legal/terms", "Terms"],
      ["/legal/privacy", "Privacy"],
      ["/legal/listing-rules", "Listing Rules"],
      ["/legal/advertiser-policy", "Advertiser Policy"],
      ["/legal/refunds", "Refund Policy"],
      ["/legal/grievance", "Grievance Policy"],
      ["/legal/corporate", "Corporate Info"]
    ]
  },
  {
    title: "Support",
    links: [
      ["/contact", "Contact"],
      ["/report", "Report an Advertisement"],
      ["/my-ads", "My Ads"],
      ["/baramati/jobs", "Baramati Jobs"],
      ["/baramati/local-services", "Local Services"]
    ]
  }
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-wide text-white">{title}</h2>
      <nav className="mt-4 space-y-2 text-sm text-slate-200">
        {links.map(([href, label]) => (
          <Link key={`${href}-${label}`} href={href} className="block hover:text-orange-200">
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default async function Footer() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const companyDisclosure =
    language === "mr" ? COMPANY_RULE26_DISCLOSURE_MR : COMPANY_RULE26_DISCLOSURE_EN;

  return (
    <footer className="border-t border-[#0B2F49] bg-[#0F3D5E] px-4 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr_0.85fr]">
        <div>
          <Link href="/" className="inline-flex rounded-2xl bg-white px-3 py-2 shadow-sm">
            <BrandLogo compact />
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">
            My Classifieds helps people discover and publish local classified advertisements for Baramati and Maharashtra.
          </p>
          <p className="mt-3 text-sm font-black text-orange-200">{BRAND_SIGNATURE_MR}</p>
          <p className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs leading-6 text-slate-200">
            My Classifieds publishes advertisements and direct-contact information. Users must independently verify advertisements and transaction details.
          </p>
          <div className="mt-5 space-y-1 text-sm text-slate-200">
            <p>
              WhatsApp: <a href="https://wa.me/919673931166" className="font-bold text-white hover:text-orange-200">+91 9673931166</a>
            </p>
            <p>
              Email: <a href="mailto:connect@myclassifieds.in" className="font-bold text-white hover:text-orange-200">connect@myclassifieds.in</a>
            </p>
          </div>
        </div>

        {groups.map((group) => (
          <FooterColumn key={group.title} title={group.title} links={group.links} />
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-white/15 pt-5 text-xs leading-6 text-slate-200">
        <p>{companyDisclosure}</p>
        <p className="mt-3">© 2026 My Classifieds. All rights reserved.</p>
      </div>
    </footer>
  );
}
