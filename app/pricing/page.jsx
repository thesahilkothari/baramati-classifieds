import Link from "next/link";

export const metadata = {
  title: "Pricing | My Classifieds",
  description:
    "Pricing plans for free, paid, premium and featured classified ads on My Classifieds."
};

const plans = [
  {
    name: "Free Classified",
    price: "Rs. 0",
    duration: "7 Days",
    badge: "Free",
    border: "border-slate-300",
    button: "bg-slate-950 hover:bg-slate-800",
    href: "/post-ad?plan=free",
    description: "Simple local classified listing after admin approval.",
    features: [
      "Visible for 7 days",
      "Text-only classified",
      "Category-wise display",
      "Admin approval required",
      "Can be upgraded before expiry"
    ]
  },
  {
    name: "Paid Classified",
    price: "Rs. 199",
    duration: "7 Days",
    badge: "Popular",
    border: "border-blue-600",
    button: "bg-blue-700 hover:bg-blue-800",
    href: "/post-ad?plan=paid",
    description: "Better option for sellers who want paid listing visibility.",
    features: [
      "Visible for 7 days",
      "GST inclusive price",
      "Paid classified listing",
      "Admin approval required",
      "Eligible for Featured add-on"
    ]
  },
  {
    name: "Premium Classified",
    price: "Rs. 499",
    duration: "30 Days",
    badge: "Premium",
    border: "border-red-600",
    button: "bg-red-600 hover:bg-red-700",
    href: "/post-ad?plan=premium",
    description: "Best for property, jobs, business and urgent advertisements.",
    features: [
      "Visible for 30 days",
      "GST inclusive price",
      "Premium classified listing",
      "Admin approval required",
      "Eligible for Featured add-on"
    ]
  },
  {
    name: "Featured Add-on",
    price: "Rs. 299",
    duration: "10 Days",
    badge: "Add-on",
    border: "border-orange-500",
    button: "bg-orange-500 hover:bg-orange-600",
    href: "/post-ad?plan=featured",
    description: "Highlight your paid or premium classified for faster response.",
    features: [
      "Featured highlighting for 10 days",
      "GST inclusive price",
      "Only for paid/premium ads",
      "Useful for urgent response",
      "Free ads must first be upgraded"
    ]
  }
];

export default function PricingPage() {
  return (
    <main className="bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-red-600">
                Pricing
              </p>

              <h1 className="mt-1 text-2xl font-black uppercase text-slate-950 md:text-3xl">
                Classified Advertisement Plans
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
                Choose a simple GST-inclusive plan to publish your newspaper-style classified advertisement on My Classifieds.
              </p>
            </div>

            <Link
              href="/post-ad"
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-red-700"
            >
              Place Classified
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border-2 bg-white p-5 shadow-sm ${plan.border}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-black uppercase text-slate-950">
                  {plan.name}
                </h2>

                <span className="rounded bg-slate-950 px-3 py-1 text-[11px] font-black uppercase text-white">
                  {plan.badge}
                </span>
              </div>

              <p className="mt-4 text-4xl font-black text-red-600">
                {plan.price}
              </p>

              <p className="mt-1 text-xs font-black uppercase text-slate-600">
                Valid for {plan.duration}
              </p>

              <p className="mt-4 min-h-12 text-sm leading-6 text-slate-700">
                {plan.description}
              </p>

              <ul className="mt-5 space-y-2 text-sm font-semibold text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="font-black text-green-700">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-6 flex w-full justify-center rounded-xl px-5 py-3 text-sm font-black uppercase text-white ${plan.button}`}
              >
                Choose Plan
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black uppercase text-slate-950">
              Expiry & Upgrade
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <p>Free classifieds stop displaying after 7 days unless upgraded or renewed.</p>
              <p>Users may be notified 2 days before free ad expiry and offered paid, premium and featured upgrade options.</p>
              <p>Featured add-on is available only for paid or premium classified ads.</p>
            </div>
          </div>

          <div className="rounded-3xl border bg-yellow-50 p-6 shadow-sm">
            <h2 className="text-2xl font-black uppercase text-yellow-950">
              Important Note
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-6 text-yellow-900">
              <p>All classifieds are subject to admin approval before publication.</p>
              <p>Payment does not guarantee approval, verification, enquiries, ranking, sale, purchase or transaction completion.</p>
              <p>
                For support, contact{" "}
                <a href="mailto:connect@myclassifieds.in" className="font-bold text-blue-700 hover:underline">
                  connect@myclassifieds.in
                </a>{" "}
                or WhatsApp{" "}
                <a href="https://wa.me/919673931166" className="font-bold text-blue-700 hover:underline">
                  +91 9673931166
                </a>.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
