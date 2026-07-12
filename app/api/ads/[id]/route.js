import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req, { params }) {
  const ad = await prisma.ad.findUnique({
    where: {
      id: Number(params.id)
    },
    include: {
      images: true,
      category: true,
      city: true,
      user: true
    }
  });

  if (!ad) {
    return NextResponse.json(
      { error: "Ad not found" },
      { status: 404 }
    );
  }

  await prisma.ad.update({
    where: { id: ad.id },
    data: {
      views: {
        increment: 1
      }
    }
  });

  return NextResponse.json({ ad });
}
