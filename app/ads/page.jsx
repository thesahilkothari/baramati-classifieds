import AdCard from "../components/AdCard";
import SearchBar from "../components/SearchBar";
import { prisma } from "../lib/prisma";

export const metadata = {
  title: "Classified Ads in Baramati | Baramati Classifieds",
  description:
    "Browse latest classified ads in Baramati for property, jobs, vehicles, electronics, agriculture equipment and local services."
};

export default async function AdsPage({ searchParams }) {
  const q = searchParams.q;
  const city = searchParams.city;
  const category = searchParams.category;

  const ads = await prisma.ad.findMany({
    where: {
      status: "ACTIVE",
      ...(q && {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } }
        ]
      }),
      ...(city && {
        city: {
          slug: city
        }
      }),
      ...(category && {
        category: {
          slug: category
        }
      })
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
      <h1 className="text-3xl font-extrabold">Browse Classified Ads</h1>

      <div className="mt-6">
        <SearchBar />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {ads.length === 0 && (
        <div className="mt-12 rounded-2xl border bg-white p-10 text-center">
          <h2 className="text-xl font-bold">No ads found</h2>
          <p className="mt-2 text-slate-500">
            Try a different category, city or search keyword.
          </p>
        </div>
      )}
    </div>
  );
}
