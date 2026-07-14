export const metadata = {
  title: "Contact | My Classifieds",
  description: "Contact My Classifieds for ad posting and support."
};

export default function ContactPage() {
  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
            Need help with an ad?
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Contact us for ad posting support, featured listings, business
            listings, fraud reports and local classified enquiries.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="space-y-5 text-slate-700">
         <p>
  <span className="font-bold text-slate-900">Promoter:</span>{" "}
  SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED
</p>

<p>
  <span className="font-bold text-slate-900">WhatsApp:</span>{" "}
  <a
    href="https://wa.me/919673931166"
    className="text-blue-700 hover:underline"
  >
    +91 9673931166
  </a>
</p>

<p>
  <span className="font-bold text-slate-900">Email:</span>{" "}
  <a
    href="mailto:sahilkothariepl@gmail.com"
    className="text-blue-700 hover:underline"
  >
    sahilkothariepl@gmail.com
  </a>
</p>

<p>
  <span className="font-bold text-slate-900">Location:</span>{" "}
  Baramati, Maharashtra
</p>
            <p>
              <span className="font-bold text-slate-900">Website:</span>{" "}
              <a href="https://myclassifieds.in" className="text-blue-700 hover:underline">
                myclassifieds.in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
