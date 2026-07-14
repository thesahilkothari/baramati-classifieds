import Link from "next/link";
import AdCard from "../../components/AdCard";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

function formatSlug(slug) {
  return slug
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return {
    title: `${formatSlug(slug)} Ads | My Classifieds`,
    description: `Browse ${formatSlug(slug)} classified ads in Baramati and Maharashtra.`
  };
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let categoryName = formatSlug(slug);
  let categoryNameMr = "";
  let ads = [];

  try {
    const category = await prisma.category.findUnique({
      where: { slug }
    });

    if (category) {
      categoryName = category.nameEn;
      categoryNameMr = category.nameMr;

      ads = await prisma.ad.findMany({
        where: {
          status: "ACTIVE",
          categoryId: category.id
        },
        include: {
          images: true,
          category: true,
          city: true
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        take: 60
      });
    }
  } catch (error) {
    console.error("Category page fetch failed:", error);
  }

  return (
    <main className="bg-slate-50">
      <section className="bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="text-sm font-semibold text-blue-300">
            ← Back to Home
          </Link>

          <h1 className="mt-4 text-4xl font-extrabold">{categoryName}</h1>

          {categoryNameMr && (
            <p className="mt-2 text-xl font-semibold text-blue-200">
              {categoryNameMr}
            </p>
          )}

          <p className="mt-3 max-w-2xl text-slate-300">
            Browse active classified ads listed under this category.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {ads.length} Ads Found
          </h2>

          <Link
            href="/post-ad"
            className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
          >
            Post Ad in this Category
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="rounded-3xl border bg-white p-10 text-center text-slate-600">
            No active ads found in this category yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
