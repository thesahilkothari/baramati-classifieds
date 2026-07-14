export const metadata = {
  title: "Post Free Ad | My Classifieds",
  description: "Post a free classified ad in Baramati and Maharashtra."
};

export default function PostAdPage() {
  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          Post Ad
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
          Post your classified ad
        </h1>

        <p className="mt-4 text-slate-600">
          The full ad submission form will be connected in the next phase with
          category selection, city selection, image upload, admin approval and
          optional Razorpay featured listing.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-slate-50 p-5">
            <h2 className="font-bold text-slate-900">1. Add Details</h2>
            <p className="mt-2 text-sm text-slate-600">
              Title, category, price, description and contact details.
            </p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <h2 className="font-bold text-slate-900">2. Verification</h2>
            <p className="mt-2 text-sm text-slate-600">
              Ads are reviewed before becoming publicly visible.
            </p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <h2 className="font-bold text-slate-900">3. Promote</h2>
            <p className="mt-2 text-sm text-slate-600">
              Choose free listing or paid featured placement.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/919673931666?text=I%20want%20to%20post%20an%20ad%20on%20My%20Classifieds"
          className="mt-8 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
        >
          Post via WhatsApp for now
        </a>
      </section>
    </main>
  );
}
