import Link from "next/link";

export const metadata = {
  title: "Pricing | My Classifieds",
  description: "Free and featured classified ad listing plans."
};

const plans = [
  {
    name: "Free Ad",
    price: "₹0",
    description: "Best for normal local listings.",
    features: ["Basic listing", "Category visibility", "Admin approval", "7 days validity"],
    cta: "Post Free Ad",
    href: "/post-ad"
  },
    {
    name: "Paid Ad",
    price: "₹199",
    description: "Better visibility for faster response.",
    features: ["Priority display", "7 days visibility", "Admin approval"],
    cta: "Promote Ad",
    href: "/post-ad?plan=featured"
  },

  {
    name: "Premium Ad",
    price: "₹499",
    description: "For businesses and urgent listings.",
    features: ["Top placement", "Premium badge", "30 days visibility", "Suitable for business promotion"],
    cta: "Choose Premium",
    href: "/post-ad?plan=premium"
  }
    {
    name: "Featured Ad",
    price: "₹299",
    description: "Better visibility for faster response.",
    features: ["Featured add-on is available only for paid or premium ads.""Highlighted listing", "Priority display", "10 days featured visibility", "Admin approval"],
    cta: "Promote Ad",
    href: "/post-ad?plan=featured"
  },
];

export default function PricingPage() {
  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
            Post free ads or promote for better visibility
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Start with a free listing. Choose featured or premium promotion when
            you want more reach.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-3xl border bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
              <p className="mt-3 text-4xl font-extrabold text-blue-700">
                {plan.price}
              </p>
              <p className="mt-3 text-slate-600">{plan.description}</p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="mt-7 inline-flex w-full justify-center rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
