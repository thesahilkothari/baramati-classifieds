import Link from "next/link";

export default function MobileBottomBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
      <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-black uppercase">
        <Link href="/" className="rounded-xl px-2 py-2 text-slate-700 hover:bg-slate-100">
          Home
        </Link>
        <Link href="/ads" className="rounded-xl px-2 py-2 text-slate-700 hover:bg-slate-100">
          Search
        </Link>
        <Link href="/post-ad" className="rounded-xl bg-red-600 px-2 py-2 text-white">
          Post Ad
        </Link>
        <Link href="/support" className="rounded-xl px-2 py-2 text-slate-700 hover:bg-slate-100">
          Help
        </Link>
      </div>
    </nav>
  );
}
