import Link from "next/link";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact My Classifieds | Support and Grievance Help",
  description:
    "Contact My Classifieds about platform use, advertisement status, payments made to the platform, technical issues or general support.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <main className="bg-[#F8FAFC] px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-black uppercase tracking-wide text-[#C2410C]">
            Contact and Support
          </p>

          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-[#0F3D5E] md:text-5xl">
            Questions, corrections or support—we’re here to help.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#475569] md:text-base">
            Contact us about using the platform, advertisement status, payments made to the platform, technical issues or general support. For a complaint about a specific advertisement, include its link or reference number.
          </p>

          <div className="mt-5 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm leading-7 text-[#475569]">
            Please do not submit passwords, OTPs, UPI PINs, full card details or unrelated identity documents.
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-[#CBD5E1] bg-white p-6">
              <h2 className="text-2xl font-black uppercase text-[#0F172A]">
                WhatsApp Support
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#475569]">
                Message us for ad posting, approval, payment and upgrade support.
              </p>

              <a
                href="https://wa.me/919673931166"
                className="mt-5 inline-flex rounded-xl bg-[#0F766E] px-6 py-3 font-black uppercase text-white hover:bg-teal-800"
              >
                +91 9673931166
              </a>
            </div>

            <div className="rounded-2xl border border-[#CBD5E1] bg-white p-6">
              <h2 className="text-2xl font-black uppercase text-[#0F172A]">
                Email Support
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#475569]">
                Send your support request with ad details, mobile number and payment reference, if any.
              </p>

              <a
                href="mailto:connect@myclassifieds.in"
                className="mt-5 inline-flex rounded-xl bg-[#0F3D5E] px-6 py-3 font-black uppercase text-white hover:bg-[#0B2F49]"
              >
                connect@myclassifieds.in
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/post-ad"
              className="rounded-xl bg-[#C2410C] px-6 py-3 font-black uppercase text-white hover:bg-orange-800"
            >
              Send My Message
            </Link>

            <Link
              href="/report"
              className="rounded-xl border border-[#CBD5E1] px-6 py-3 font-black uppercase text-[#0F3D5E] hover:bg-slate-50"
            >
              Report an Advertisement
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
