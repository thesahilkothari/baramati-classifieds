export const metadata = {
  title: "Refund & Cancellation Policy | My Classifieds",
  description: "Refund and cancellation policy for My Classifieds paid promotions."
};

export default function RefundPage() {
  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
          Refund & Cancellation Policy
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: July 2026
        </p>

        <div className="mt-8 space-y-6 leading-7 text-slate-700">
          <p>
            This policy applies to paid ad promotions purchased on My
            Classifieds.
          </p>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              1. Free Ads
            </h2>
            <p className="mt-2">
              Free ad posting does not involve payment and therefore no refund
              applies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              2. Paid Promotions
            </h2>
            <p className="mt-2">
              Payments for featured or premium ad visibility are generally
              non-refundable once the promotion is activated or processed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              3. Failed or Duplicate Payments
            </h2>
            <p className="mt-2">
              If a payment is debited but not reflected on the platform, users
              may contact support with payment details. Valid duplicate or
              failed payment cases may be reviewed and refunded as per payment
              gateway records.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              4. Rejected Ads
            </h2>
            <p className="mt-2">
              If an ad is rejected for illegality, fraud, misleading content,
              prohibited services or violation of platform guidelines, refund
              may be denied.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              5. Contact for Refund Requests
            </h2>
            <p className="mt-2">
              Refund-related requests may be sent to sahilkothariepl@gmail.com
              with payment ID, registered mobile number and ad details.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
