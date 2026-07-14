import PostAdForm from "../components/PostAdForm";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Post Free Ad | My Classifieds",
  description: "Post a free classified ad in Baramati and Maharashtra."
};

export default async function PostAdPage() {
  let categories = [];
  let cities = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { nameEn: "asc" }
    });

    cities = await prisma.city.findMany({
      orderBy: { name: "asc" }
    });
  } catch (error) {
    console.error("Post ad form data fetch failed:", error);
  }

  return (
    <main className="bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-4xl rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
          Post Ad
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
          Post your classified ad
        </h1>

        <p className="mt-4 text-slate-600">
          Submit your ad for property, jobs, vehicles, electronics, agriculture
          equipment or local services. Ads are published after review.
        </p>

        {categories.length === 0 || cities.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-yellow-50 p-6 text-yellow-900">
            Categories and cities are not loaded yet. Please run the seed data
            command or contact support.
          </div>
        ) : (
          <PostAdForm categories={categories} cities={cities} />
        )}
      </section>
    </main>
  );
}
