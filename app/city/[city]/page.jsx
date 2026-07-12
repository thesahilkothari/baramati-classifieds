import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import AdCard from "@/app/components/AdCard";

export async function generateMetadata({ params }) {
  const city = await prisma.city.findUnique({
    where: {
      slug: params.city
    }
  });

  if (!city) {
    return {
      title: "City Not Found"
    };
  }

  return {
    title: `Classified Ads in ${city.name} | Baramati Classifieds`,
    description: `Find property, jobs, vehicles, electronics, agriculture equipment and services in ${city.name}, Maharashtra.`
  };
}

export default async function CityPage({ params }) {
  const city = await prisma.city.findUnique({
    where: {
      slug: params.city
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
