import Link from "next/link";
import { cookies } from "next/headers";
import BrandLogo from "./BrandLogo";
import { getLanguageFromCookieStore, t } from "../lib/i18n";

const legalLinks = [
  { href: "/legal", labelEn: "Legal Hub", labelMr: "कायदेशीर माहिती" },
  { href: "/legal/terms", labelEn: "Terms", labelMr: "वापराच्या अटी" },
  { href: "/legal/privacy", labelEn: "Privacy", labelMr: "गोपनीयता" },
  { href: "/legal/listing-rules", labelEn: "Listing Rules", labelMr: "जाहिरात नियम" },
  { href: "/legal/advertiser-policy", labelEn: "Advertiser Policy", labelMr: "जाहिरातदार धोरण" },
  { href: "/legal/refunds", labelEn: "Refunds", labelMr: "परतावा" },
  { href: "/legal/safety", labelEn: "Safety", labelMr: "सुरक्षा" },
  { href: "/legal/grievance", labelEn: "Grievance", labelMr: "तक्रार निवारण" },
  { href: "/legal/ip", labelEn: "IP Complaints", labelMr: "IP तक्रार" },
  { href: "/legal/ranking", labelEn: "Ranking Disclosure", labelMr: "Ranking Disclosure" },
  { href: "/legal/ai-content", labelEn: "AI Content", labelMr: "AI Content" },
  { href: "/legal/business-terms", labelEn: "Business Terms", labelMr: "Business Terms" },
  { href: "/legal/corporate", labelEn: "Corporate Info", labelMr: "कंपनी माहिती" },
  { href: "/legal/accessibility", labelEn: "Accessibility", labelMr: "Accessibility" }
];

const localLinks = [
  { href: "/baramati/property", labelEn: "Baramati Property", labelMr: "बारामती मालमत्ता" },
  { href: "/baramati/jobs", labelEn: "Baramati Jobs", labelMr: "बारामती नोकरी" },
  { href: "/baramati/used-vehicles", labelEn: "Used Vehicles", labelMr: "वापरलेली वाहने" },
  { href: "/baramati/local-services", labelEn: "Local Services", labelMr: "स्थानिक सेवा" },
  { href: "/maharashtra/agriculture-equipment", labelEn: "Agriculture Equipment", labelMr: "शेती उपकरणे" }
];

function label(language, en, mr) {
  return language === "mr" ? mr : en;
}

function footerMission(language) {
  if (language === "mr") {
    return "बारामतीसारख्या tier-2 शहरांसाठी affordable online classifieds आणि local yellow-page style सेवा — मालमत्ता, नोकरी, वाहन, वस्तू, सेवा, freelancers आणि professionals शोधण्यासाठी व जाहिरात देण्यासाठी.";
  }

  return "Affordable online classifieds and local yellow-page style service for Baramati and tier-2 Maharashtra — built for property, jobs, vehicles, goods, services, freelancers and local professionals.";
}

export default async function Footer() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);

  return (
    <footer className="border-t border-[#0B2F49] bg-[#0F3D5E] px-4 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="inline-flex rounded-2xl bg-white px-3 py-2 shadow-sm">
            <BrandLogo compact />
          </Link>

          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
            {footerMission(language)}
          </p>

          <Link href="/about" className="mt-3 inline-flex text-sm font-black uppercase text-orange-200 hover:text-white">
            {label(language, "Read the platform story", "Platform बद्दल वाचा")}
          </Link>

          <div className="mt-5 space-y-1 text-sm text-slate-200">
            <p>
              WhatsApp:{" "}
              <a
                href="https://wa.me/919673931166"
                className="font-bold text-white hover:text-orange-200"
              >
                +91 9673931166
              </a>
            </p>

            <p>
              Email:{" "}
              <a
                href="mailto:connect@myclassifieds.in"
                className="font-bold text-white hover:text-orange-200"
              >
                connect@myclassifieds.in
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-white">
            {t(language, "classifieds")}
          </h2>

          <nav className="mt-4 space-y-2 text-sm text-slate-200">
            <Link href="/ads" className="block hover:text-orange-200">
              {t(language, "browseAds")}
            </Link>

            <Link href="/post-ad" className="block hover:text-orange-200">
              {label(language, "Post Free Ad", "मोफत जाहिरात द्या")}
            </Link>

            <Link href="/my-ads" className="block hover:text-orange-200">
              {label(language, "My Ads / Ad Status", "माझ्या जाहिराती / Status")}
            </Link>

            <Link href="/pricing" className="block hover:text-orange-200">
              {t(language, "pricing")}
            </Link>

            <Link href="/about" className="block hover:text-orange-200">
              {label(language, "About", "आमच्याबद्दल")}
            </Link>

            <Link href="/support" className="block hover:text-orange-200">
              {t(language, "support")}
            </Link>

            <Link href="/report" className="block hover:text-orange-200">
              {t(language, "report")}
            </Link>
          </nav>

          <h2 className="mt-6 text-sm font-black uppercase tracking-wide text-white">
            Local Pages
          </h2>

          <nav className="mt-4 space-y-2 text-sm text-slate-200">
            {localLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block hover:text-orange-200">
                {language === "mr" ? link.labelMr : link.labelEn}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-white">
            {t(language, "legal")}
          </h2>

          <nav className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-200">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block hover:text-orange-200">
                {language === "mr" ? link.labelMr : link.labelEn}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-white/15 pt-5 text-xs leading-6 text-slate-200">
        <p>{t(language, "companyDisclosure")}</p>
        <p className="mt-3">
          © 2026 {t(language, "brand")}. {t(language, "rightsReserved")}
        </p>
      </div>
    </footer>
  );
}
