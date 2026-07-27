import Link from "next/link";
import { buildPageMetadata } from "../lib/seo";
import BrandHeroGraphic from "../components/BrandHeroGraphic";
import JsonLd from "../components/JsonLd";
import { buildBreadcrumbSchema, buildOrganizationSchema } from "../lib/jsonLd";

export const metadata = buildPageMetadata({
  title: "About My Classifieds | Online Classifieds Platform",
  description:
    "Learn why My Classifieds was created as a lightweight online classifieds platform for Baramati and Maharashtra.",
  path: "/about"
});

const sections = [
  {
    title: "Why My Classifieds was created",
    text:
      "My Classifieds was created to give Baramati and nearby Maharashtra users a simple local classified board that feels familiar, fast and practical. The aim is to bring good-old newspaper-style classifieds to mobile and desktop users without making the website heavy or complicated.",
    mr:
      "My Classifieds हे बारामती व महाराष्ट्रातील वापरकर्त्यांसाठी साधे, जलद आणि स्थानिक classified board म्हणून तयार केले आहे. जुनी newspaper-style जाहिरात पद्धत mobile आणि desktop वर सोप्या पद्धतीने उपलब्ध करणे हा उद्देश आहे."
  },
  {
    title: "Local focus",
    text:
      "The platform focuses on Baramati and Maharashtra categories such as property, jobs, vehicles, agriculture equipment, electronics and local services. Public pages are intentionally lightweight and text-first so that they work well on ordinary mobile networks.",
    mr:
      "ही platform Baramati आणि Maharashtra मधील property, jobs, vehicles, agriculture equipment, electronics आणि local services यांसारख्या categories वर लक्ष केंद्रित करते. साध्या mobile network वरही website चांगली चालावी म्हणून public pages text-first व lightweight ठेवले आहेत."
  },
  {
    title: "Moderation and user safety",
    text:
      "Advertisements are subject to moderation, listing rules and report/takedown controls. Users should still independently verify property papers, vehicle documents, job offers, seller identity, service scope and payment details before any transaction.",
    mr:
      "जाहिराती moderation, listing rules आणि report/takedown controls अंतर्गत असतात. तरीही व्यवहारापूर्वी property papers, vehicle documents, job offers, seller identity, service scope आणि payment details स्वतंत्रपणे तपासणे आवश्यक आहे."
  },
  {
    title: "Platform role",
    text:
      "My Classifieds facilitates advertisements and paid listing visibility services. It does not own, inspect, deliver, verify, endorse or guarantee the advertised goods, property, employment, services or transactions unless expressly stated in a specific listing.",
    mr:
      "My Classifieds जाहिराती आणि paid listing visibility services उपलब्ध करून देते. विशिष्ट जाहिरातीत स्पष्ट नमूद केले नसेल तर advertised goods, property, employment, services किंवा transactions यांची मालकी, तपासणी, delivery, verification, endorsement किंवा guarantee platform देत नाही."
  }
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

          <header className="overflow-hidden rounded-3xl border border-[#CBD5E1] bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1fr]">
              <div className="p-6 md:p-8 lg:p-10">
                <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
                  About My Classifieds
                </p>

                <h1 className="mt-3 text-3xl font-black leading-tight text-[#0F3D5E] md:text-5xl">
                  A dependable online classifieds platform for Baramati and Maharashtra
                </h1>

                <p className="mt-5 text-base leading-8 text-[#475569]">
                  My Classifieds keeps local advertising simple: users can post and browse classified advertisements, contact advertisers directly, and use clear paid visibility options without automatic renewal.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/ads"
                    className="rounded-xl bg-[#0F3D5E] px-5 py-3 text-center text-sm font-black uppercase text-white"
                  >
                    Browse Ads
                  </Link>

                  <Link
                    href="/post-ad"
                    className="rounded-xl bg-[#C2410C] px-5 py-3 text-center text-sm font-black uppercase text-white"
                  >
                    Post Free Ad
                  </Link>
                </div>
              </div>

              <div className="border-t bg-[#F8FAFC] p-4 lg:border-l lg:border-t-0">
                <BrandHeroGraphic />
              </div>
            </div>
          </header>

          <div className="mt-6 grid gap-4">
            {sections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black uppercase text-[#0F172A]">
                  {section.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#475569]">
                  {section.text}
                </p>

                <p className="mt-3 rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-7 text-[#475569]">
                  {section.mr}
                </p>
              </article>
            ))}
          </div>

          <section className="mt-6 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black uppercase text-[#0F172A]">
              Operator disclosure
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#475569]">
              My Classifieds is owned and operated by SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED. CIN: U74999PN2014PTC150594. Registered Office: Vardhaman Capital, Plot No. 13, Gat No. 42/1, Mouje Rui, Taluka Baramati, District Pune, Maharashtra – 413133. Contact: connect@myclassifieds.in | +91 9673931166.
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
