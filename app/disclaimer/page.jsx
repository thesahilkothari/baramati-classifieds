export const metadata = {
  title: "Disclaimer | My Classifieds",
  description: "Important disclaimer for My Classifieds users."
};

export default function DisclaimerPage() {
  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
          Disclaimer
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: July 2026
        </p>

        <div className="mt-8 space-y-6 leading-7 text-slate-700">
          <p>
            My Classifieds is a local classified ads platform. Listings are
            submitted by users and are not guaranteed, verified or endorsed by
            SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED.
          </p>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              User-Generated Listings
            </h2>
            <p className="mt-2">
              All ad content, pricing, product details, job details, property
              information, service details and contact information are submitted
              by users. Visitors must independently verify all details before
              entering into any transaction.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              No Transaction Guarantee
            </h2>
            <p className="mt-2">
              My Classifieds does not guarantee sale, purchase, employment,
              service quality, payment recovery, delivery, title, ownership or
              transaction completion.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Safety
            </h2>
            <p className="mt-2">
              Users should avoid advance payments, verify documents and never
              share OTP, UPI PIN, bank passwords or card details.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
