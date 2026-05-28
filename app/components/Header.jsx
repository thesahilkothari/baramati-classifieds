import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-blue-700">
          Baramati Classifieds
        </Link>

        <nav className="hidden gap-6 text-sm font-semibold md:flex">
          <Link href="/ads">All Ads</Link>
          <Link href="/category/real-estate">Real Estate</Link>
          <Link href="/category/jobs">Jobs</Link>
          <Link href="/category/agriculture-equipment">Agriculture</Link>
        </nav>

        <div className="flex gap-3">
          <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold">
            Login
          </Link>

          <Link
            href="/ads/post"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white"
          >
            Post Ad
          </Link>
        </div>
      </div>
    </header>
  );
}
