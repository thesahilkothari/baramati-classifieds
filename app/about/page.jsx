import Link from "next/link";
import { buildPageMetadata } from "../lib/seo";
import BrandHeroGraphic from "../components/BrandHeroGraphic";
import JsonLd from "../components/JsonLd";
import { buildBreadcrumbSchema, buildOrganizationSchema } from "../lib/jsonLd";
import {
  COMPANY_CIN,
  COMPANY_LEGAL_NAME,
  COMPANY_PUBLIC_EMAIL,
  COMPANY_PUBLIC_PHONE,
  COMPANY_REGISTERED_OFFICE
} from "../lib/companyDetails";

export const metadata = buildPageMetadata({
  title: "About My Classifieds | Affordable Online Classifieds for Tier-2 Maharashtra",
  description:
    "My Classifieds is an affordable online classifieds platform designed for Baramati and tier-2 cities in Maharashtra, helping people post property, jobs, services and local ads easily.",
  path: "/about"
});

const publicMissionPoints = [
  "Built for tier-2 cities such as Baramati, where traditional newspaper classifieds can be costly for ordinary citizens and small businesses.",
  "Designed as an affordable local yellow-page style service for people who want to buy, sell, rent, hire, work, offer services or find nearby opportunities.",
  "Focused on simple text-first classifieds so the platform remains fast, searchable, mobile-friendly and accessible on ordinary internet connections.",
  "Open to legally permissible classifieds only, subject to moderation, listing rules, safety checks and user reporting mechanisms."
];

const publicMissionPointsMr = [
  "बारामतीसारख्या tier-2 शहरांसाठी तयार केलेले, जिथे वृत्तपत्रातील classified जाहिराती सामान्य नागरिक व छोट्या व्यवसायांसाठी खर्चिक ठरू शकतात.",
  "खरेदी, विक्री, भाडे, नोकरी, सेवा, freelancers आणि स्थानिक संधींसाठी affordable local yellow-page style सेवा म्हणून विकसित केलेले.",
  "जलद, शोधण्यास सोपे आणि mobile-first अनुभवासाठी text-first classifieds वर भर.",
  "केवळ कायदेशीरदृष्ट्या अनुमत जाहिराती, moderation, listing rules, safety checks आणि user reporting mechanisms अंतर्गत."
];

const categoryGroups = [
  {
    title: "Buy, sell or rent",
    text:
      "Property, vehicles, furniture, electronics, appliances, equipment and other legally saleable or rentable items.",
    mr:
      "मालमत्ता, वाहने, फर्निचर, electronics, appliances, equipment आणि कायदेशीररीत्या विक्री/भाड्याने देता येणाऱ्या वस्तू.",
    accent: "#C2410C"
  },
  {
    title: "Jobs and work opportunities",
    text:
      "Job seekers can discover local openings, while employers and businesses can post simple hiring classifieds.",
    mr:
      "नोकरी शोधणाऱ्यांसाठी स्थानिक openings आणि employers/businesses साठी सोपी hiring classifieds.",
    accent: "#0F3D5E"
  },
  {
    title: "Daily local services",
    text:
      "Electricians, plumbers, carpenters, packers and movers, transporters, cabs, tutors, drivers, contractors and more.",
    mr:
      "Electrician, plumber, carpenter, packers and movers, transporter, cab, tutor, driver, contractor आणि इतर स्थानिक सेवा.",
    accent: "#0F766E"
  },
  {
    title: "Care, support and professionals",
    text:
      "Nurses, caregivers, caretakers, freelancers and local professionals such as CAs, architects, doctors, lawyers and consultants.",
    mr:
      "Nurses, caregivers, caretakers, freelancers आणि CA, architect, doctor, lawyer, consultant यांसारखे local professionals.",
    accent: "#0F3D5E"
  }
];

const platformPrinciples = [
  {
    title: "Affordable reach",
    text:
      "Local visibility should not be limited only to those who can afford repeated print advertisements. My Classifieds gives a simpler digital route for public notices, local needs and everyday opportunities."
  },
  {
    title: "Search-first utility",
    text:
      "The platform is designed around search, category and location rather than clutter. A user should be able to quickly find what is useful nearby."
  },
  {
    title: "Local city focus",
    text:
      "The purpose is not to imitate a luxury marketplace. It is to become a practical city-level classifieds and yellow-page style layer for Baramati and similar Maharashtra cities."
  },
  {
    title: "Responsible publishing",
    text:
      "Every ad remains subject to platform rules. My Classifieds facilitates publishing and contact, but users must independently verify people, documents, services and payments before transacting."
  }
];

function NumberedStep({ number, title, text }) {
  return (
    <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F3D5E] text-sm font-black text-white">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-black uppercase text-[#0F172A]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#475569]">{text}</p>
    </div>
  );
}

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

          <header className="overflow-hidden rounded-3xl border border-[#CBD5E1] bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[0.96fr_1fr]">
              <div className="p-6 md:p-8 lg:p-10">
                <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
                  My Classifieds • Online Classifieds Platform
                </p>

                <h1 className="mt-3 text-3xl font-black leading-tight text-[#0F3D5E] md:text-5xl">
                  Local classifieds made affordable for Baramati and tier-2 Maharashtra
                </h1>

                <p className="mt-5 text-base leading-8 text-[#475569]">
                  My Classifieds was created for cities where a simple classified advertisement in a newspaper, local weekly or fortnightly can still be costly and inconvenient for the common public. We bring everyday local needs to your fingertips: buy, sell, rent, hire, find jobs, offer services and connect with nearby people through a simple online classifieds platform.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/post-ad"
                    className="rounded-xl bg-[#C2410C] px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-orange-800"
                  >
                    Post Free Ad
                  </Link>

                  <Link
                    href="/ads"
                    className="rounded-xl bg-[#0F3D5E] px-5 py-3 text-center text-sm font-black uppercase text-white hover:bg-[#0B2F49]"
                  >
                    Browse Local Ads
                  </Link>
                </div>
              </div>

              <div className="border-t bg-[#F8FAFC] p-4 lg:border-l lg:border-t-0">
                <BrandHeroGraphic />
              </div>
            </div>
          </header>

          <section className="mt-6 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-black uppercase tracking-wide text-[#0F766E]">
              The idea behind the platform
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
              A digital yellow page for the local city
            </h2>
            <p className="mt-4 text-sm leading-8 text-[#475569] md:text-base">
              My Classifieds is built as an affordable local utility. It is not meant to be a crowded luxury marketplace. It is meant to be useful: a clean, searchable, city-focused classifieds service where people in Baramati and similar Maharashtra cities can publish everyday requirements and discover nearby opportunities without depending only on costly print ads.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {publicMissionPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm leading-7 text-[#475569]">
                  {point}
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {publicMissionPointsMr.map((point) => (
                <div key={point} className="rounded-2xl border border-[#CBD5E1] bg-white p-4 text-sm leading-7 text-[#475569]">
                  {point}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
                  What people can use it for
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
                  Classifieds for real local life
                </h2>
              </div>
              <Link href="/post-ad" className="text-sm font-black uppercase text-[#0F3D5E]">
                Start with a free ad
              </Link>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {categoryGroups.map((group) => (
                <article key={group.title} className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
                  <div className="h-2 w-16 rounded-full" style={{ backgroundColor: group.accent }} />
                  <h3 className="mt-4 text-xl font-black uppercase text-[#0F172A]">
                    {group.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">{group.text}</p>
                  <p className="mt-3 rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-7 text-[#475569]">
                    {group.mr}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-4">
            {platformPrinciples.map((principle) => (
              <article key={principle.title} className="rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
                <h3 className="text-base font-black uppercase text-[#0F3D5E]">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#475569]">
                  {principle.text}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-black uppercase tracking-wide text-[#0F766E]">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase text-[#0F172A] md:text-3xl">
              Simple for users, moderated for safety
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <NumberedStep
                number="1"
                title="Post your need"
                text="Write a plain-text classified for a legal item, property, job, service or local requirement. Keep it short, clear and useful."
              />
              <NumberedStep
                number="2"
                title="Admin moderation"
                text="Ads are reviewed before publication so prohibited, misleading or unsafe content can be restricted under platform rules."
              />
              <NumberedStep
                number="3"
                title="Connect directly"
                text="Interested people can contact the advertiser directly. Users should verify details independently before payment or commitment."
              />
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-[#CBD5E1] bg-[#0F3D5E] p-6 text-white shadow-sm md:p-8">
            <p className="text-xs font-black uppercase tracking-wide text-orange-200">
              Our positioning
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase md:text-4xl">
              My Classifieds brings local opportunities to your fingertips.
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-100 md:text-base">
              For a local resident, it can be a place to sell a used item. For a job seeker, it can be a place to find work. For a small business, it can be a low-cost visibility channel. For a service provider, it can become a local city directory. That is the purpose of My Classifieds: affordable, searchable, responsible local advertising for Baramati and Maharashtra.
            </p>
          </section>

          <section className="mt-6 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black uppercase text-[#0F172A]">
              Operator disclosure
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#475569]">
              My Classifieds is owned and operated by {COMPANY_LEGAL_NAME}. CIN: {COMPANY_CIN}. Registered Office: {COMPANY_REGISTERED_OFFICE}. Contact: {COMPANY_PUBLIC_EMAIL} | {COMPANY_PUBLIC_PHONE}.
            </p>

            <p className="mt-3 rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-7 text-[#475569]">
              My Classifieds facilitates advertisement publication and contact between users. The platform does not independently verify ownership, title, employment offers, professional qualifications, service quality, documents, product condition or payments. Users must carry out their own due diligence before any transaction.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/ads"
                className="rounded-xl bg-[#0F3D5E] px-5 py-3 text-center text-sm font-black uppercase text-white"
              >
                Browse Ads
              </Link>

              <Link
                href="/legal/corporate"
                className="rounded-xl border border-[#CBD5E1] px-5 py-3 text-center text-sm font-black uppercase text-[#0F3D5E]"
              >
                Legal Information
              </Link>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
