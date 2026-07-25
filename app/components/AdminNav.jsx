import Link from "next/link";

const adminLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    description: "Counts and shortcuts"
  },
  {
    href: "/admin",
    label: "Moderation",
    description: "Approve/reject ads"
  },
  {
    href: "/admin/payments",
    label: "Payments",
    description: "Verify UPI payments"
  },
  {
    href: "/admin/grievances",
    label: "Grievances",
    description: "Reports and takedowns"
  },
  {
    href: "/admin/followups",
    label: "Follow-ups",
    description: "Sold/renewal reminders"
  },
  {
    href: "/admin/compliance",
    label: "Compliance",
    description: "Policy evidence"
  }
];

export default function AdminNav() {
  return (
    <section className="border-b bg-slate-950 px-4 py-4 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-blue-300">
              My Classifieds
            </p>

            <h2 className="text-xl font-black uppercase">
              Admin Control Centre
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/ads"
              target="_blank"
              className="rounded-xl border border-white/20 px-4 py-2 text-xs font-black uppercase text-white hover:bg-white/10"
            >
              Public Ads
            </Link>

            <Link
              href="/post-ad"
              target="_blank"
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase text-white hover:bg-red-700"
            >
              Post Test Ad
            </Link>
          </div>
        </div>

        <nav className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10"
            >
              <span className="block text-sm font-black uppercase">
                {link.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-300">
                {link.description}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
