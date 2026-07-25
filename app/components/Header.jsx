import Link from "next/link";
import { cookies } from "next/headers";
import LanguageToggle from "./LanguageToggle";
import { getLanguageFromCookieStore, t } from "../lib/i18n";

function label(language, en, mr) {
  return language === "mr" ? mr : en;
}

export default async function Header() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="min-w-0">
          <p className="truncate text-xl font-black uppercase text-slate-950">
            {t(language, "brand")}
          </p>
          <p className="hidden text-xs font-bold uppercase tracking-wide text-slate-500 sm:block">
            {t(language, "tagline")}
          </p>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-bold text-slate-700 lg:flex">
          <Link href="/ads" className="hover:text-blue-700">
            {t(language, "browseAds")}
          </Link>
          <Link href="/my-ads" className="hover:text-blue-700">
            {label(language, "My Ads", "माझ्या जाहिराती")}
          </Link>
          <Link href="/pricing" className="hover:text-blue-700">
            {t(language, "pricing")}
          </Link>
          <Link href="/support" className="hover:text-blue-700">
            {t(language, "support")}
          </Link>
          <Link href="/legal" className="hover:text-blue-700">
            {t(language, "legal")}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle currentLanguage={language} />

          <Link
            href="/post-ad"
            className="hidden rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase text-white hover:bg-red-700 sm:inline-flex"
          >
            {t(language, "postAd")}
          </Link>
        </div>
      </div>
    </header>
  );
}
