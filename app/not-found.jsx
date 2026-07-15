import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="bg-slate-50 px-4 py-20">
      <section className="mx-auto max-w-3xl rounded-3xl border bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          404
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
          Page not found
        </h1>

        <p className="mt-4 text-slate-600">
          The page you are looking for may have been moved, removed or is not
          available.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
          >
            Go Home
          </Link>

          <Link
            href="/ads"
            className="rounded-xl border px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            Browse Ads
          </Link>
        </div>
      </section>
    </main>
  );
}
