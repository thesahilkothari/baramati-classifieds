import Link from "next/link";
import { cookies } from "next/headers";
import { getLanguageFromCookieStore, t } from "../lib/i18n";

function label(language, en, mr) {
  return language === "mr" ? mr : en;
}

export default async function MobileBottomBar() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#CBD5E1] bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
      <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-black uppercase">
        <Link
          href="/"
          className="rounded-xl px-1 py-2 text-[#0F3D5E] hover:bg-slate-100"
        >
          {t(language, "home")}
        </Link>

        <Link
          href="/ads"
          className="rounded-xl px-1 py-2 text-[#0F3D5E] hover:bg-slate-100"
        >
          {t(language, "search")}
        </Link>

        <Link
          href="/post-ad"
          className="rounded-xl bg-[#C2410C] px-1 py-2 text-white"
        >
          {label(language, "Post Free", "जाहिरात")}
        </Link>

        <Link
          href="/my-ads"
          className="rounded-xl px-1 py-2 text-[#0F3D5E] hover:bg-slate-100"
        >
          {label(language, "My Ads", "माझ्या")}
        </Link>

        <Link
          href="/support"
          className="rounded-xl px-1 py-2 text-[#0F3D5E] hover:bg-slate-100"
        >
          {t(language, "support")}
        </Link>
      </div>
    </nav>
  );
}
