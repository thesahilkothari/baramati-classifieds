import Link from "next/link";

export const metadata = {
  title: "Contact | My Classifieds",
  description: "Contact My Classifieds for classified advertisement support."
};

export default function ContactPage() {
  return (
    <main className="bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Contact
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase text-slate-950 md:text-5xl">
            Contact My Classifieds
          </h1>

          <p className="mt-4 max-w-3xl text-slate-700">
            For classified advertisement support, payment queries, upgrade
            assistance or general support, contact us through WhatsApp or email.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border bg-blue-50 p-6">
              <h2 className="text-2xl font-black uppercase text-blue-950">
                WhatsApp Support
              </h2>

              <p className="mt-3 text-blue-900">
                Message us for ad posting, approval, payment and upgrade
                support.
              </p>

              <a
                href="https://wa.me/919673931166"
                className="mt-5 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-black uppercase text-white hover:bg-blue-800"
              >
                +91 9673931166
              </a>
            </div>

            <div className="rounded-2xl border bg-yellow-50 p-6">
              <h2 className="text-2xl font-black uppercase text-yellow-950">
                Email Support
              </h2>

              <p className="mt-3 text-yellow-900">
                Send your support request with ad details, mobile number and
                payment reference, if any.
              </p>

              <a
                href="mailto:connect@myclassifieds.in"
                className="mt-5 inline-flex rounded-xl bg-yellow-500 px-6 py-3 font-black uppercase text-slate-950 hover:bg-yellow-400"
              >
                connect@myclassifieds.in
              </a>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border bg-slate-50 p-5 text-sm leading-6 text-slate-700">
            <p className="font-black uppercase text-slate-950">
              Before contacting
            </p>

            <p className="mt-2">
              For faster support, please keep your ad title, registered mobile
              number, payment ID and screenshot ready, wherever applicable.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/post-ad"
              className="rounded-xl bg-red-600 px-6 py-3 font-black uppercase text-white hover:bg-red-700"
            >
              Place Classified
            </Link>

            <Link
              href="/pricing"
              className="rounded-xl border px-6 py-3 font-black uppercase text-slate-700 hover:bg-slate-50"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
