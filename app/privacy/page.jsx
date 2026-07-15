export const metadata = {
  title: "Privacy Policy | My Classifieds",
  description: "Privacy policy for My Classifieds users."
};

export default function PrivacyPage() {
  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: July 2026
        </p>

        <div className="mt-8 space-y-6 leading-7 text-slate-700">
          <p>
            This Privacy Policy explains how My Classifieds, operated by SAHIL
            KOTHARI ENTERPRISES PRIVATE LIMITED, collects and uses information
            submitted by users.
          </p>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              We may collect name, mobile number, WhatsApp number, email
              address, ad details, city, category, images, payment references
              and other information submitted while using the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              2. Use of Information
            </h2>
            <p className="mt-2">
              Information is used for publishing ads, contacting users, admin
              verification, fraud prevention, payment processing, support and
              platform improvement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              3. Public Listing Information
            </h2>
            <p className="mt-2">
              Information included in an approved ad, such as title,
              description, price, location and contact number, may be publicly
              visible to website visitors.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              4. Payments
            </h2>
            <p className="mt-2">
              Payments are processed through Razorpay. We do not store card
              numbers, UPI PINs, banking passwords or sensitive payment
              credentials on our servers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              5. Contact
            </h2>
            <p className="mt-2">
              For privacy-related requests, contact us at
              sahilkothariepl@gmail.com.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
