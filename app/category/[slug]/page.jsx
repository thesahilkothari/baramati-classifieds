import Link from "next/link";
import AdCard from "../../components/AdCard";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

function formatSlug(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let ads = [];
  let categoryName = formatSlug(slug);

  try {
    const category = await prisma.category.findUnique({
      where: { slug }
    });

    if (category) {
      categoryName = category.nameEn;

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
        take: 50
      });
    }
  } catch (error) {
    console.error("Category page fetch failed:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm font-semibold text-blue-300">
            ← Back to Home
          </Link>

          <h1 className="mt-4 text-4xl font-bold">{categoryName}</h1>

          <p className="mt-3 text-slate-300">
            Browse ads listed under this category.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {ads.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-slate-600">
            No active ads found in this category yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
