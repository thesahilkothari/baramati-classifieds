export default function ContactSection() {
  return (
    <section id="contact" className="border-t bg-white px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Contact
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Need help with posting or finding an ad?
          </h2>

          <p className="mt-4 max-w-2xl text-slate-600">
            Contact My Classifieds for support related to ad posting,
            verification, featured listings, business listings and local
            classified enquiries.
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-6">
          <div className="space-y-4 text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Website:</span>{" "}
              <a
                href="https://myclassifieds.in"
                className="text-blue-700 hover:underline"
              >
                myclassifieds.in
              </a>
            </p>

<p>
  <span className="font-semibold text-slate-900">Promoter:</span>{" "}
  SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED
</p>

<p>
  <span className="font-semibold text-slate-900">WhatsApp:</span>{" "}
  <a
    href="https://wa.me/919673931166"
    className="text-blue-700 hover:underline"
  >
    +91 9673931166
  </a>
</p>

<p>
  <span className="font-semibold text-slate-900">Email:</span>{" "}
  <a
    href="mailto:sahilkothariepl@gmail.com"
    className="text-blue-700 hover:underline"
  >
    sahilkothariepl@gmail.com
  </a>
</p>
            <p>
              <span className="font-semibold text-slate-900">Location:</span>{" "}
              Baramati, Maharashtra
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
