import Link from "next/link";
import {
  ACTIVE_POLICY_VERSION,
  POLICY_EFFECTIVE_DATE_LABEL
} from "../../lib/compliance";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Terms and Conditions for Posting a Classified | My Classifieds",
  description:
    "Consolidated terms and conditions accepted before posting a classified advertisement on My Classifieds.",
  path: "/legal/posting-terms"
});

export default function PostingTermsPage() {
  return (
    <main className="bg-slate-100 px-4 py-10">
      <article className="mx-auto max-w-5xl rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-black uppercase tracking-wide text-blue-700">
          My Classifieds Legal
        </p>

        <h1 className="mt-3 text-3xl font-black uppercase leading-tight text-slate-950 md:text-5xl">
          Terms and Conditions for Posting a Classified
        </h1>

        <div className="mt-4 rounded-2xl border bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          <p>
            Policy Version: <strong>{ACTIVE_POLICY_VERSION}</strong>
          </p>
          <p>
            Effective Date: <strong>{POLICY_EFFECTIVE_DATE_LABEL}</strong>
          </p>
        </div>

        <section className="mt-8 space-y-7 text-sm leading-7 text-slate-700">
          <div>
            <h2 className="text-xl font-black uppercase text-slate-950">
              1. Age and Authority
            </h2>
            <p className="mt-2">
              By posting a classified advertisement, you confirm that you are at
              least 18 years old and have lawful authority to post the
              advertisement, sell/offer the relevant goods or services, and
              share the submitted contact details.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black uppercase text-slate-950">
              2. Truthful and Non-Misleading Information
            </h2>
            <p className="mt-2">
              You confirm that the title, description, price, category,
              location, contact details and all other information submitted by
              you are true, accurate, current and not misleading.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black uppercase text-slate-950">
              3. Prohibited and Restricted Listings
            </h2>
            <p className="mt-2">
              You confirm that your classified does not relate to illegal,
              fraudulent, unsafe, prohibited, infringing, obscene, defamatory,
              deceptive or restricted goods, services or activities. You must
              comply with the Listing Rules and all applicable laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black uppercase text-slate-950">
              4. Moderation and Publication
            </h2>
            <p className="mt-2">
              Submission of a classified, and payment where applicable, does not
              guarantee publication. My Classifieds may approve, reject, edit,
              remove, restrict, expire or reclassify any advertisement according
              to platform policy, legal requirements, user safety and moderation
              review.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black uppercase text-slate-950">
              5. Paid Plans, Featured Add-on and Refunds
            </h2>
            <p className="mt-2">
              Paid, premium and featured options provide platform visibility
              benefits only. They do not verify, certify, endorse or guarantee
              any user, advertiser, item, property, job, service or transaction.
              Payments are presently processed through manual UPI verification.
              Refunds, if any, will be governed by the published refund policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black uppercase text-slate-950">
              6. Contact Display and User Responses
            </h2>
            <p className="mt-2">
              You consent to the use and display of submitted contact details
              for ad responses, buyer/user enquiries, platform support,
              moderation, verification, dispute handling and legal compliance in
              relation to your classified.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black uppercase text-slate-950">
              7. User Responsibility and Platform Disclaimer
            </h2>
            <p className="mt-2">
              My Classifieds is a classified listing platform. Users must verify
              parties, documents, ownership, employment details, service quality
              and payment terms independently before entering into any
              transaction. The platform is not a party to user-to-user
              transactions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black uppercase text-slate-950">
              8. Linked Policies Incorporated
            </h2>
            <p className="mt-2">
              By accepting these posting terms, you also accept the following
              policies, as updated from time to time:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <Link href="/legal/terms" className="font-bold text-blue-700 underline">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="font-bold text-blue-700 underline">
                  Privacy and Cookies Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/listing-rules" className="font-bold text-blue-700 underline">
                  Listing Rules and Prohibited/Restricted Listings
                </Link>
              </li>
              <li>
                <Link href="/legal/advertiser-policy" className="font-bold text-blue-700 underline">
                  Advertiser, Seller and Service-Provider Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/refunds" className="font-bold text-blue-700 underline">
                  Paid Listings, Billing, Cancellation and Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/safety" className="font-bold text-blue-700 underline">
                  Transaction Safety and Platform Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/grievance" className="font-bold text-blue-700 underline">
                  Grievance, Report Abuse and Takedown Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/ranking" className="font-bold text-blue-700 underline">
                  Sponsored Listings and Ranking Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/post-ad"
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-700"
          >
            Back to Post Ad
          </Link>

          <Link
            href="/legal"
            className="rounded-xl border px-5 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
          >
            Legal Hub
          </Link>
        </div>
      </article>
    </main>
  );
}
