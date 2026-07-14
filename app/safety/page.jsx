export const metadata = {
  title: "Safety Tips | My Classifieds",
  description: "Safety tips for buying and selling through classified ads."
};

const tips = [
  "Meet buyers or sellers only in safe public places.",
  "Do not pay advance money without verifying the person and product.",
  "Check vehicle documents, ownership papers and service history before purchase.",
  "For property deals, verify title documents, ownership and permissions.",
  "Do not share OTP, UPI PIN, banking passwords or card details.",
  "Report suspicious ads immediately through contact support.",
  "Avoid deals that look unrealistically cheap or urgent.",
  "Use written receipts for token payments and delivery confirmation."
];

export default function SafetyPage() {
  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          Safety Centre
        </p>
        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
          Stay safe while buying and selling
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          My Classifieds helps connect local buyers and sellers. Users must
          independently verify listings before making payments or commitments.
        </p>

        <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
          <ul className="space-y-4 text-slate-700">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-3">
                <span className="font-bold text-blue-700">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
