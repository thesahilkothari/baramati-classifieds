import Link from "next/link";
import { cookies } from "next/headers";
import BrandLogo from "./BrandLogo";
import LanguageToggle from "./LanguageToggle";
import { getLanguageFromCookieStore, t } from "../lib/i18n";

function label(language, en, mr) {
  return language === "mr" ? mr : en;
}

export default async function Header() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);

  return (
    <header className="sticky top-0 z-30 border-b border-[#0B2F49] bg-[#0F3D5E] px-3 py-2.5 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-white/20"
          aria-label="My Classifieds home"
        >
          <BrandLogo compact />
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-bold text-white lg:flex">
          <Link href="/ads" className="hover:text-orange-200">
            {t(language, "browseAds")}
          </Link>
          <Link href="/my-ads" className="hover:text-orange-200">
            {label(language, "My Ads", "माझ्या जाहिराती")}
          </Link>
          <Link href="/pricing" className="hover:text-orange-200">
            {t(language, "pricing")}
          </Link>
          <Link href="/about" className="hover:text-orange-200">
            {label(language, "About", "आमच्याबद्दल")}
          </Link>
          <Link href="/support" className="hover:text-orange-200">
            {t(language, "support")}
          </Link>
          <Link href="/legal" className="hover:text-orange-200">
            {t(language, "legal")}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle currentLanguage={language} />

          <Link
            href="/post-ad"
            className="hidden rounded-xl bg-[#C2410C] px-4 py-2 text-xs font-black uppercase text-white shadow-sm hover:bg-orange-800 sm:inline-flex"
          >
            {label(language, "Post Free Ad", "मोफत जाहिरात द्या")}
          </Link>
        </div>
      </div>
    </header>
  );
}
