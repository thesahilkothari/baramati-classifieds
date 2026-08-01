import Link from "next/link";
import { buildPageMetadata } from "../lib/seo";
import JsonLd from "../components/JsonLd";
import { buildBreadcrumbSchema, buildOrganizationSchema } from "../lib/jsonLd";
import {
  COMPANY_CIN,
  COMPANY_LEGAL_NAME,
  COMPANY_PUBLIC_EMAIL,
  COMPANY_PUBLIC_PHONE,
  COMPANY_REGISTERED_OFFICE
} from "../lib/companyDetails";
import { BRAND_SIGNATURE_MR } from "../lib/brandCopy";

export const metadata = buildPageMetadata({
  title: "About My Classifieds | Baramati’s Local Advertising Platform",
  description:
    "Learn why My Classifieds was created to make local opportunities in Baramati and Maharashtra easier to advertise, discover and discuss directly.",
  path: "/about"
});

const differences = [
  {
    title: "Local relevance",
    text: "Baramati-first discovery instead of an overwhelming national feed."
  },
  {
    title: "Simple use",
    text: "Clear categories and straightforward advertisement posting."
  },
  {
    title: "Direct contact",
    text: "Interested users can contact advertisers by the available call or messaging options."
  },
  {
    title: "Moderated publishing",
    text: "Submitted advertisements are reviewed before publication under the platform’s listing rules."
  },
  {
    title: "Marathi and English accessibility",
    text: "Designed for the language preferences of local users."
  },
  {
    title: "Responsible operation",
    text: "Safety guidance, reporting tools, grievance support and public policies are available to users."
  }
];

const categories = [
  "Property",
  "Jobs",
  "Vehicles",
  "Agriculture",
  "Education",
  "Electronics",
  "Local Services",
  "Business & Commercial"
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" }
          ]),
          buildOrganizationSchema()
        ]}
      />

      <main className="min-h-screen bg-[#F8FAFC] px-3 pb-24 pt-5 md:px-4 md:pb-10">
        <section className="mx-auto max-w-6xl">
          <nav className="mb-4 text-xs font-bold uppercase text-[#475569]">
            <Link href="/" className="hover:text-[#0F3D5E]">
              Home
            </Link>{" "}
            / About
          </nav>

          <header className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-10">
            <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
              About My Classifieds
            </p>

            <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-[#0F3D5E] md:text-5xl">
              Local opportunities deserve a local place.
            </h1>

            <p className="mt-5 max-w-4xl text-base leading-8 text-[#475569] md:text-lg">
              My Classifieds is a simple local classified-advertising platform created for the everyday needs of Baramati and surrounding communities. It helps individuals, professionals, employers, institutions and businesses publish useful information and connect directly with interested people.
            </p>
          </header>

          <section className="mt-6 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-black uppercase tracking-wide text-[#0F766E]">
              Our story
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
              Why My Classifieds was created
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-8 text-[#475569] md:text-base">
              <p>
                For years, local classified advertisements helped people find homes, jobs, vehicles, services and business opportunities through newspapers and word of mouth. Today, much of this information is scattered across social-media posts, messaging groups and personal contacts. Useful advertisements are easily missed, become difficult to search, and often disappear quickly.
              </p>
              <p>
                My Classifieds was created to bring that familiar local-advertising experience into one simple digital place—easy to access on a mobile phone, organised by category and location, and designed for direct contact.
              </p>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
            <article className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black uppercase text-[#0F172A]">
                What people can find here
              </h2>
              <p className="mt-4 text-sm leading-8 text-[#475569]">
                Users can browse or publish advertisements relating to property, jobs, vehicles, agriculture, education, electronics, local services and business or commercial opportunities. The platform begins with a strong Baramati focus while remaining open to relevant advertisements from across Maharashtra.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-black uppercase text-[#475569]"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black uppercase text-[#0F172A]">
                What makes the platform different
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {differences.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4">
                    <h3 className="text-sm font-black uppercase text-[#0F3D5E]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#475569]">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-6 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
              Our purpose
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
              To make local information easier to advertise, easier to find and easier to act upon.
            </h2>
            <p className="mt-4 text-sm leading-8 text-[#475569] md:text-base">
              We want a local employer to find suitable applicants, a family to discover a rental, a skilled professional to reach nearby customers, an institute to announce an opportunity, and a business to communicate its genuine offering—all through a clear, searchable advertisement.
            </p>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black uppercase text-[#0F172A]">
                Our role—and the user’s role
              </h2>
              <p className="mt-4 text-sm leading-8 text-[#475569]">
                My Classifieds provides space for classified advertisements and direct connections. It does not act as the seller, buyer, broker, employer, recruiter, payment intermediary or guarantor of a transaction merely because an advertisement appears on the platform.
              </p>
              <p className="mt-4 text-sm leading-8 text-[#475569]">
                Users should independently verify identities, ownership, qualifications, goods, services, documents, prices and payment terms before acting. Advertisements that appear suspicious or violate the Listing Rules should be reported promptly.
              </p>
            </article>

            <article className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black uppercase text-[#0F172A]">
                Built locally, growing responsibly
              </h2>
              <p className="mt-4 text-sm leading-8 text-[#475569]">
                My Classifieds is operated by {COMPANY_LEGAL_NAME}. The platform is being developed gradually, with emphasis on useful local inventory, responsible moderation, practical user support and sustainable growth—not exaggerated claims or artificial popularity numbers.
              </p>
              <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-7 text-[#475569]">
                <p className="font-black text-[#0F172A]">Compact operator disclosure</p>
                <p className="mt-2">
                  {COMPANY_LEGAL_NAME}, CIN {COMPANY_CIN}, registered office: {COMPANY_REGISTERED_OFFICE}. For platform support or grievances, write to {COMPANY_PUBLIC_EMAIL} or call {COMPANY_PUBLIC_PHONE}.
                </p>
              </div>
            </article>
          </section>

          <section className="mt-6 rounded-3xl border border-[#CBD5E1] bg-[#0F3D5E] p-6 text-white shadow-sm md:p-8">
            <h2 className="text-3xl font-black uppercase md:text-4xl">
              Something to offer? Something to find? Start locally.
            </h2>
            <p className="mt-4 text-lg font-black text-orange-100">
              {BRAND_SIGNATURE_MR}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/post-ad"
                className="rounded-xl bg-[#C2410C] px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-orange-800"
              >
                Post an Advertisement
              </Link>
              <Link
                href="/ads"
                className="rounded-xl bg-white px-5 py-3 text-center text-sm font-black uppercase text-[#0F3D5E]"
              >
                Browse Local Ads
              </Link>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
