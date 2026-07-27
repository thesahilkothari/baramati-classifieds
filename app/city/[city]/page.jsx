import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AdCard from "@/app/components/AdCard";
import { buildPageMetadata } from "@/app/lib/seo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const city = await prisma.city.findUnique({
    where: {
      slug: resolvedParams.city
    }
  });

  if (!city) {
    return buildPageMetadata({
      title: "City Not Found | My Classifieds",
      path: `/city/${resolvedParams.city}`,
      noIndex: true
    });
  }

  return buildPageMetadata({
    title: `Classified Ads in ${city.name} | My Classifieds`,
    description: `Find property, jobs, vehicles, electronics, agriculture equipment and services in ${city.name}, Maharashtra.`,
    path: `/city/${city.slug}`
  });
}

export default async function CityPage({ params }) {
  const resolvedParams = await params;
  const city = await prisma.city.findUnique({
    where: {
      slug: resolvedParams.city
    }
  });

  if (!city) notFound();

  const ads = await prisma.ad.findMany({
    where: {
      cityId: city.id,
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
        Classified Ads in {city.name}
      </h1>

      <p className="mt-2 text-slate-500">
        Browse local ads for property, jobs, vehicles, electronics, agriculture
        equipment and services in {city.name}, Maharashtra.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}
