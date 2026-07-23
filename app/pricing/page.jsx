import Link from "next/link";

export const metadata = {
  title: "Pricing | My Classifieds",
  description:
    "Pricing plans for free, paid, premium and featured classified ads on My Classifieds."
};

const plans = [
  {
    name: "Free Classified",
    price: "₹0",
    duration: "7 Days",
    badge: "Basic",
    border: "border-slate-300",
    button: "bg-slate-950 hover:bg-slate-800",
    href: "/post-ad?plan=free",
    description:
      "Best for simple local classifieds. Your ad will be visible after admin approval for 7 days.",
    features: [
      "Visible for 7 days",
      "Text-only classified listing",
      "Category-wise display",
      "Admin approval required",
      "Can upgrade before expiry"
    ]
  },
  {
    name: "Paid Classified",
    price: "₹199",
    duration: "7 Days",
    badge: "Paid",
    border: "border-blue-600",
    button: "bg-blue-700 hover:bg-blue-800",
    href: "/post-ad?plan=paid",
    description:
      "Suitable for sellers who want a paid listing with better seriousness and visibility.",
    features: [
      "Visible for 7 days",
      "Displayed above free ads",
      "Category-wise display",
      "Admin approval required",
      "Can add Featured upgrade"
    ]
  },
  {
    name: "Premium Classified",
    price: "₹499",
    duration: "30 Days",
    badge: "Premium",
    border: "border-red-600",
    button: "bg-red-600 hover:bg-red-700",
    href: "/post-ad?plan=premium",
    description:
      "Best for important, business, property, job, service and urgent classified advertisements.",
    features: [
      "Visible for 30 days",
      "Displayed at top priority",
      "Premium classified visibility",
      "Admin approval required",
      "Can add Featured upgrade"
    ]
  },
  {
    name: "Featured Add-on",
    price: "₹299",
    duration: "10 Days",
    badge: "Add-on",
    border: "border-orange-500",
    button: "bg-orange-500 hover:bg-orange-600",
    href: "/post-ad?plan=featured",
    description:
      "Optional highlighting add-on for paid or premium ads. Free ads must first be upgraded.",
    features: [
      "Featured highlighting for 10 days",
      "Available for paid/premium ads",
      "Shown in Featured section",
      "Useful for urgent response",
      "Admin approval rules still apply"
    ]
  }
];

export default function PricingPage() {
  return (
    <main className="bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-red-600">
            Pricing
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase text-slate-950 md:text-5xl">
            Classified Advertisement Plans
          </h1>

          <p className="mt-4 max-w-3xl text-slate-700">
            Choose a simple newspaper-style classified plan. Free ads are
            displayed for 7 days. Paid and premium ads receive higher visibility.
            Featured highlighting is available as an add-on for paid or premium
            ads.
          </p>

          <div className="mt-6 rounded-2xl border bg-yellow-50 p-5 text-sm leading-6 text-yellow-900">
            <p className="font-black uppercase">Important</p>
            <p className="mt-2">
              All classifieds are subject to admin approval. Payment does not
              guarantee publication of illegal, misleading, fraudulent or
              prohibited advertisements.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border-2 bg-white p-6 shadow-sm ${plan.border}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-black uppercase text-slate-950">
                  {plan.name}
                </h2>

                <span className="rounded bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">
                  {plan.badge}
                </span>
              </div>

              <p className="mt-5 text-4xl font-black text-red-600">
                {plan.price}
              </p>

              <p className="mt-1 text-sm font-black uppercase text-slate-600">
                Valid for {plan.duration}
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-700">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3 text-sm font-semibold text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="font-black text-green-700">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-7 flex w-full justify-center rounded-xl px-5 py-3 text-sm font-black uppercase text-white ${plan.button}`}
              >
                Choose Plan
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black uppercase text-slate-950">
              Display Priority
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <p>
                <span className="font-black text-red-600">1. Premium Ads:</span>{" "}
                Displayed first because they are valid for 30 days and have top
                visibility.
              </p>

              <p>
                <span className="font-black text-orange-600">
                  2. Featured Ads:
                </span>{" "}
                Paid or premium ads with featured add-on are highlighted for 10
                days.
              </p>

              <p>
                <span className="font-black text-blue-700">3. Paid Ads:</span>{" "}
                Displayed after premium and featured ads.
              </p>

              <p>
                <span className="font-black text-slate-900">4. Free Ads:</span>{" "}
                Displayed after paid ads and remain visible for 7 days.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black uppercase text-slate-950">
              Expiry & Upgrade
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
              <p>
                Free classifieds stop displaying after 7 days unless upgraded or
                renewed.
              </p>

              <p>
                Users may be notified 2 days before free ad expiry and offered
                paid, premium and featured upgrade options.
              </p>

              <p>
                Automatic WhatsApp/SMS/email reminders will be enabled in a later
                phase after connecting a notification provider.
              </p>

              <p>
                For support, contact{" "}
                <a
                  href="mailto:sahilkothariepl@gmail.com"
                  className="font-bold text-blue-700 hover:underline"
                >
                  sahilkothariepl@gmail.com
                </a>{" "}
                or WhatsApp{" "}
                <a
                  href="https://wa.me/919673931166"
                  className="font-bold text-blue-700 hover:underline"
                >
                  +91 9673931166
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border-2 border-slate-900 bg-slate-950 p-6 text-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-yellow-300">
                Ready to publish?
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase">
                Place your classified advertisement
              </h2>

              <p className="mt-3 max-w-2xl text-slate-300">
                Submit your classified text. It will be reviewed and published
                after approval.
              </p>
            </div>

            <Link
              href="/post-ad"
              className="rounded-xl bg-red-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-red-700"
            >
              Place Classified
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
