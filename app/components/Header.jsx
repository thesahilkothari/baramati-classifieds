import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-extrabold text-blue-700">
          My Classifieds
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
          <Link href="/ads" className="hover:text-blue-700">
            Browse Ads
          </Link>
          <Link href="/pricing" className="hover:text-blue-700">
            Pricing
          </Link>
          <Link href="/safety" className="hover:text-blue-700">
            Safety
          </Link>
          <Link href="/legal" className="hover:text-blue-700">
            Legal
          </Link>
          <Link href="/contact" className="hover:text-blue-700">
            Contact
          </Link>
        </nav>

        <Link
          href="/post-ad"
          className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
        >
          Place Classified
        </Link>
      </div>
    </header>
  );
}
