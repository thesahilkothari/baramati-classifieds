import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function distanceFormulaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = Number(searchParams.get("radius") || 25);

  let ads = await prisma.ad.findMany({
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
      city: true,
      category: true
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" }
    ]
  });

  if (lat && lng) {
    ads = ads.filter((ad) => {
      if (!ad.latitude || !ad.longitude) return false;

      const distance = distanceFormulaKm(
        Number(lat),
        Number(lng),
        ad.latitude,
        ad.longitude
      );

      return distance <= radius;
    });
  }

  return NextResponse.json({ ads });
}
