import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { slugify } from "@/app/lib/slugify";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");
  const city = searchParams.get("city");
  const category = searchParams.get("category");

  const ads = await prisma.ad.findMany({
    where: {
      status: "ACTIVE",
      ...(q && {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      }),
      ...(city && {
        city: {
          slug: city,
        },
      }),
      ...(category && {
        category: {
          slug: category,
        },
      }),
    },
    include: {
      images: true,
      city: true,
      category: true,
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json({ ads });
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      price,
      mobile,
      whatsapp,
      categoryId,
      cityId,
      address,
    } = body;

    if (!title || !description || !categoryId || !cityId || !mobile) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        description,
        price: price ? Number(price) : null,
        mobile,
        whatsapp,
        address,
        userId: user.id,
        categoryId: Number(categoryId),
        cityId: Number(cityId),
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      ad,
      message: "Ad submitted for review",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    );
  }
}
