import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AdCard from "@/app/components/AdCard";

export async function generateMetadata({ params }) {
  const category = await prisma.category.findUnique({
    where: {
      slug: params.slug
    }
  });

  if (!category) {
    return {
      title: "Category Not Found"
    };
  }

  return {
    title: `${category.nameEn} Ads in Baramati | Baramati Classifieds`,
    description: `Find latest ${category.nameEn} classified ads in Baramati and Maharashtra.`
  };
}

export default async function CategoryPage({ params }) {
  const category = await prisma.category.findUnique({
    where: {
      slug: params.slug
    }
  });

  if (!category) notFound();

  const ads = await prisma.ad.findMany({
    where: {
      categoryId: category.id,
      status: "ACTIVE"
    },
    include: {
      images: true,
      category: true,
      city: true
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" }
    ]
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">
        {category.nameEn} Ads
      </h1>

      <p className="mt-1 text-lg text-slate-500">{category.nameMr}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}
