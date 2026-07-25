import Link from "next/link";
import { cookies } from "next/headers";
import { getLanguageFromCookieStore, t } from "../lib/i18n";

const legalLinks = [
  { href: "/legal", labelEn: "Legal Hub", labelMr: "कायदेशीर माहिती" },
  { href: "/legal/terms", labelEn: "Terms", labelMr: "वापराच्या अटी" },
  { href: "/legal/privacy", labelEn: "Privacy", labelMr: "गोपनीयता" },
  { href: "/legal/refunds", labelEn: "Refunds", labelMr: "परतावा" },
  { href: "/legal/grievance", labelEn: "Grievance", labelMr: "तक्रार निवारण" },
  { href: "/legal/corporate", labelEn: "Corporate Info", labelMr: "कंपनी माहिती" }
];

function label(language, en, mr) {
  return language === "mr" ? mr : en;
}

export default async function Footer() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);

  return (
    <footer className="border-t bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="text-2xl font-black uppercase">
            {t(language, "brand")}
          </Link>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            {t(language, "footerAbout")}
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
            {t(language, "classifieds")}
          </h2>

          <nav className="mt-4 space-y-2 text-sm text-slate-300">
            <Link href="/ads" className="block hover:text-white">
              {t(language, "browseAds")}
            </Link>

            <Link href="/post-ad" className="block hover:text-white">
              {t(language, "postAd")}
            </Link>

            <Link href="/my-ads" className="block hover:text-white">
              {label(language, "My Ads / Ad Status", "माझ्या जाहिराती / Status")}
            </Link>

            <Link href="/pricing" className="block hover:text-white">
              {t(language, "pricing")}
            </Link>

            <Link href="/support" className="block hover:text-white">
              {t(language, "support")}
            </Link>

            <Link href="/report" className="block hover:text-white">
              {t(language, "report")}
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">
            {t(language, "legal")}
          </h2>

          <nav className="mt-4 space-y-2 text-sm text-slate-300">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block hover:text-white">
                {language === "mr" ? link.labelMr : link.labelEn}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-slate-800 pt-5 text-xs leading-6 text-slate-400">
        <p>{t(language, "companyDisclosure")}</p>
        <p className="mt-3">
          © 2026 {t(language, "brand")}. {t(language, "rightsReserved")}
        </p>
      </div>
    </footer>
  );
}
