export const metadata = {
  title: "Terms of Use | My Classifieds",
  description: "Terms and conditions for using My Classifieds."
};

export default function TermsPage() {
  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
          Terms of Use
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: July 2026
        </p>

        <div className="mt-8 space-y-6 leading-7 text-slate-700">
          <p>
            My Classifieds is operated by SAHIL KOTHARI ENTERPRISES PRIVATE
            LIMITED for providing an online local classified ads platform for
            users to post, browse and respond to listings.
          </p>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              1. Nature of Platform
            </h2>
            <p className="mt-2">
              My Classifieds is only an intermediary/local listing platform.
              We do not own, sell, inspect, verify, guarantee or endorse any
              product, property, job, service or listing posted by users.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              2. User Responsibility
            </h2>
            <p className="mt-2">
              Users are responsible for the accuracy, legality and authenticity
              of the information posted by them. Users must not post misleading,
              fraudulent, unlawful, defamatory, obscene, duplicate or prohibited
              content.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              3. Verification Before Transaction
            </h2>
            <p className="mt-2">
              Buyers and sellers must independently verify identity, ownership,
              documents, condition, price and all transaction details before
              making any payment or commitment.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              4. Ad Approval and Removal
            </h2>
            <p className="mt-2">
              We reserve the right to approve, reject, modify, suspend or remove
              any ad at our discretion, especially where the ad appears to be
              illegal, suspicious, misleading or against platform guidelines.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              5. Paid Promotions
            </h2>
            <p className="mt-2">
              Featured or premium ad payments provide better visibility on the
              platform. Payment does not guarantee sale, lead generation,
              business conversion or approval of unlawful content.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              6. Contact
            </h2>
            <p className="mt-2">
              For support, contact SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED at
              9673931166 or connect@myclassifieds.in.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
