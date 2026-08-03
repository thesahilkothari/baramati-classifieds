import Link from "next/link";
import { cookies } from "next/headers";
import { Bell, MapPin, Plus, Search, ShieldCheck } from "lucide-react";
import BrandLogo from "./BrandLogo";
import LanguageToggle from "./LanguageToggle";
import { getLanguageFromCookieStore } from "../lib/i18n";

function label(language, en, mr) {
  return language === "mr" ? mr : en;
}

export default async function Header() {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 shadow-[0_1px_8px_rgba(15,61,94,0.08)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:h-20 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-2xl px-1 py-1 transition hover:bg-[#F8FAFC]"
          aria-label="My Classifieds home"
        >
          <span className="hidden sm:inline-flex">
            <BrandLogo compact />
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002741] font-[var(--font-plus-jakarta)] text-lg font-black text-white shadow-sm sm:hidden">
            M
          </span>
        </Link>

        <Link
          href="/ads?city=baramati"
          className="hidden min-w-[180px] items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F2F4F6] px-3 py-2 text-left transition hover:bg-[#E0E3E5] md:flex"
        >
          <MapPin className="h-4 w-4 shrink-0 text-[#002741]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-[#72777E]">
              Location
            </span>
            <span className="block truncate text-xs font-black text-[#191C1E]">
              Baramati / Maharashtra
            </span>
          </span>
        </Link>

        <form
          action="/ads"
          className="hidden flex-1 items-center rounded-lg border border-[#E2E8F0] bg-[#F2F4F6] px-3 py-2 transition focus-within:border-[#002741] focus-within:ring-2 focus-within:ring-[#002741]/10 sm:flex"
        >
          <Search className="mr-2 h-5 w-5 shrink-0 text-[#72777E]" />
          <input
            name="q"
            type="search"
            placeholder="Find cars, jobs, property, services..."
            className="w-full bg-transparent text-sm font-semibold text-[#191C1E] outline-none placeholder:text-[#72777E]"
          />
        </form>

        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/safety"
            className="hidden rounded-lg p-2 text-[#42474E] transition hover:bg-[#F2F4F6] hover:text-[#002741] lg:inline-flex"
            aria-label="Safety tips"
          >
            <ShieldCheck className="h-5 w-5" />
          </Link>

          <Link
            href="/support"
            className="hidden rounded-lg p-2 text-[#42474E] transition hover:bg-[#F2F4F6] hover:text-[#002741] md:inline-flex"
            aria-label="Support"
          >
            <Bell className="h-5 w-5" />
          </Link>

          <LanguageToggle currentLanguage={language} />

          <Link
            href="/my-ads"
            className="hidden whitespace-nowrap px-2 py-2 text-xs font-black text-[#42474E] transition hover:text-[#002741] md:inline-flex"
          >
            {label(language, "My Ads", "माझ्या जाहिराती")}
          </Link>

          <Link
            href="/post-ad"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] px-4 py-2.5 text-xs font-black uppercase text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#FD6B36] hover:shadow-lg sm:px-5"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            <span>{label(language, "Sell", "जाहिरात")}</span>
          </Link>
        </nav>
      </div>

      <form action="/ads" className="border-t border-[#E2E8F0] bg-white px-3 py-2 sm:hidden">
        <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-[#F2F4F6] px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 text-[#72777E]" />
          <input
            name="q"
            type="search"
            placeholder="Search classifieds..."
            className="w-full bg-transparent text-sm font-semibold text-[#191C1E] outline-none placeholder:text-[#72777E]"
          />
        </div>
      </form>
    </header>
  );
}
