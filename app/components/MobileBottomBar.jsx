import Link from "next/link";
import { cookies } from "next/headers";
import { getLanguageFromCookieStore, t } from "../lib/i18n";

export default async function MobileBottomBar() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
      <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-black uppercase">
        <Link
          href="/"
          className="rounded-xl px-2 py-2 text-slate-700 hover:bg-slate-100"
        >
          {t(language, "home")}
        </Link>

        <Link
          href="/ads"
          className="rounded-xl px-2 py-2 text-slate-700 hover:bg-slate-100"
        >
          {t(language, "search")}
        </Link>

        <Link
          href="/post-ad"
          className="rounded-xl bg-red-600 px-2 py-2 text-white"
        >
          {t(language, "postAd")}
        </Link>

        <Link
          href="/support"
          className="rounded-xl px-2 py-2 text-slate-700 hover:bg-slate-100"
        >
          {t(language, "support")}
        </Link>
      </div>
    </nav>
  );
}
