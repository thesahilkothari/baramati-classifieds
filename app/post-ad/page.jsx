import Link from "next/link";
import FeaturedAdPaymentButton from "../components/FeaturedAdPaymentButton";

export const metadata = {
  title: "Post Free Ad | My Classifieds",
  description: "Post a free classified ad in Baramati and Maharashtra."
};

export default function PostAdPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-blue-700">
          ← Back to Home
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          Post Free Ad
        </h1>

        <p className="mt-3 text-slate-600">
          The ad posting form will be enabled shortly. For now, this page
          confirms that the route is working correctly.
        </p>

        <div className="mt-8 rounded-2xl border bg-slate-50 p-6">
          <p className="font-semibold text-slate-900">
            Coming next:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
            <li>Mobile OTP login</li>
            <li>Category selection</li>
            <li>Ad title, price and description</li>
            <li>Image upload</li>
            <li>Admin approval</li>
            <li>Featured ad payment</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
