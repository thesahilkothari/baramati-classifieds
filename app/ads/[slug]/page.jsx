import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

export async function generateMetadata({ params }) {
  const ad = await prisma.ad.findUnique({
    where: { slug: params.slug },
    include: {
      city: true,
      category: true
    }
  });

  if (!ad) {
    return {
      title: "Ad Not Found"
    };
  }

  return {
    title: `${ad.title} in ${ad.city.name} | Baramati Classifieds`,
    description: ad.description.slice(0, 150)
  };
}

export default async function AdDetailPage({ params }) {
  const ad = await prisma.ad.findUnique({
    where: {
      slug: params.slug
    },
    include: {
      images: true,
      city: true,
      category: true,
      user: true
    }
  });

  if (!ad) notFound();

  await prisma.ad.update({
    where: { id: ad.id },
    data: {
      views: {
        increment: 1
      }
    }
  });

  const whatsappNumber = ad.whatsapp || ad.mobile;
  const whatsappMessage = encodeURIComponent(
    `Hello, I saw your ad "${ad.title}" on Baramati Classifieds. Is it available?`
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section>
        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="grid gap-2 md:grid-cols-2">
            {ad.images.length > 0 ? (
              ad.images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={ad.title}
                  className="h-80 w-full object-cover"
                />
              ))
            ) : (
              <img
                src="/placeholder.jpg"
                alt={ad.title}
                className="h-80 w-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {ad.category.nameEn}
            </span>

            {ad.isFeatured && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold">{ad.title}</h1>

          <p className="mt-3 text-3xl font-black text-blue-700">
            {ad.price ? `₹${Number(ad.price).toLocaleString("en-IN")}` : "Price on request"}
          </p>

          <p className="mt-2 text-slate-500">
            {ad.city.name}, Maharashtra
          </p>

          <hr className="my-6" />

          <h2 className="text-xl font-bold">Description</h2>

          <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
            {ad.description}
          </p>
        </div>
      </section>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Contact Seller</h2>

          <p className="mt-2 text-sm text-slate-500">
            Verified mobile listing. Avoid advance payments unless verified personally.
          </p>

          <a
            href={`tel:${ad.mobile}`}
            className="mt-5 block rounded-xl bg-blue-700 px-5 py-3 text-center font-bold text-white hover:bg-blue-800"
          >
            Call Seller
          </a>

          <a
            href={`https://wa.me/91${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block rounded-xl bg-green-600 px-5 py-3 text-center font-bold text-white hover:bg-green-700"
          >
            WhatsApp Seller
          </a>
        </div>

        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-5">
          <h3 className="font-bold text-red-800">Safety Tips</h3>
          <p className="mt-2 text-sm leading-6 text-red-700">
            Do not pay advance token amount without verifying the seller,
            documents, ownership or physical possession. Meet in a safe public
            place where possible.
          </p>
        </div>
      </aside>
    </div>
  );
}
