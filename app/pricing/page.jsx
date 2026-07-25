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
    description:
      "Better option for sellers who want paid listing visibility after manual UPI payment verification.",
    features: [
      "Visible for 7 days",
      "Paid classified listing",
      "Category-wise display",
      "Admin approval required",
      "Manual UPI payment verification"
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
    description:
      "Best for property, jobs, business and urgent advertisements after manual UPI payment verification.",
    features: [
      "Visible for 30 days",
      "Premium classified listing",
      "Longer validity",
      "Admin approval required",
      "Manual UPI payment verification"
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
                Choose a simple plan to publish your newspaper-style classified
                advertisement on My Classifieds.
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

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-900">
          Online gateway checkout is currently not active. Paid plans are
          processed through manual UPI payment to the company UPI ID and admin
          verification from the bank/UPI statement. All prices are GST inclusive.
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                GST inclusive | Valid for {plan.duration}
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
      </section>
    </main>
  );
}
