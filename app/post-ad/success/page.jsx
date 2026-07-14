import Link from "next/link";

export const metadata = {
  title: "Ad Submitted | My Classifieds",
  description: "Your classified ad has been submitted for approval."
};

export default function PostAdSuccessPage() {
  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
          Ad submitted successfully
        </h1>

        <p className="mt-4 text-slate-600">
          Your ad has been received and is pending admin approval. Once approved,
          it will become visible on My Classifieds.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/post-ad"
            className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
          >
            Post Another Ad
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
