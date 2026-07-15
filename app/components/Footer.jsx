import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div>
          <h2 className="text-xl font-extrabold">My Classifieds</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Local classified ads platform for Baramati and Maharashtra. Buy,
            sell, rent, find jobs and promote local services.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Categories</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <Link href="/category/real-estate" className="block hover:text-white">
              Real Estate
            </Link>
            <Link href="/category/jobs" className="block hover:text-white">
              Jobs
            </Link>
            <Link href="/category/vehicles" className="block hover:text-white">
              Vehicles
            </Link>
            <Link href="/category/electronics" className="block hover:text-white">
              Electronics
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold">Useful Links</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <Link href="/ads" className="block hover:text-white">
              Browse Ads
            </Link>
            <Link href="/post-ad" className="block hover:text-white">
              Post Free Ad
            </Link>
            <Link href="/pricing" className="block hover:text-white">
              Promote Ad
            </Link>
            <Link href="/safety" className="block hover:text-white">
              Safety Tips
            </Link>
            <Link href="/terms" className="block hover:text-white">
  Terms of Use
</Link>
<Link href="/privacy" className="block hover:text-white">
  Privacy Policy
</Link>
<Link href="/refund" className="block hover:text-white">
  Refund Policy
</Link>
<Link href="/disclaimer" className="block hover:text-white">
  Disclaimer
</Link>
          </div>
        </div>

      <div>
  <h3 className="font-bold">Contact</h3>
  <div className="mt-3 space-y-2 text-sm text-slate-300">
    <p>SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED</p>
    <p>Baramati, Maharashtra</p>
    <a href="https://wa.me/919673931166" className="block hover:text-white">
      WhatsApp: +91 9673931166
    </a>
    <a
      href="mailto:sahilkothariepl@gmail.com"
      className="block hover:text-white"
    >
      sahilkothariepl@gmail.com
    </a>
  </div>
</div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-slate-800 pt-5 text-sm text-slate-400">
        © {new Date().getFullYear()} My Classifieds. All rights reserved.
      </div>
    </footer>
  );
}
