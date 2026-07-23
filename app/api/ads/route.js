import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function createUniqueSlug(title) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.ad.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

function cleanMobile(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizePrice(value) {
  const rawPrice = String(value || "").trim();

  if (!rawPrice) {
    return null;
  }

  const numericPrice = Number(rawPrice.replace(/,/g, ""));

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return null;
  }

  return numericPrice;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const mobile = cleanMobile(body.mobile);
    const whatsapp = cleanMobile(body.whatsapp || body.mobile);
    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const address = String(body.address || "").trim();
    const categoryId = Number(body.categoryId);
    const cityId = Number(body.cityId);
    const price = normalizePrice(body.price);

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10 digit mobile number." },
        { status: 400 }
      );
    }

    if (!title || title.length < 8) {
      return NextResponse.json(
        { error: "Ad title must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (!description || description.length < 20) {
      return NextResponse.json(
        { error: "Description must be at least 20 characters." },
        { status: 400 }
      );
    }

    if (!categoryId || !cityId) {
      return NextResponse.json(
        { error: "Please select category and city." },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    const city = await prisma.city.findUnique({
      where: { id: cityId }
    });

    if (!category || !city) {
      return NextResponse.json(
        { error: "Selected category or city is invalid." },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { mobile },
      update: {
        name,
        isVerified: true
      },
      create: {
        name,
        mobile,
        isVerified: true
      }
    });

    const slug = await createUniqueSlug(title);

    const ad = await prisma.ad.create({
      data: {
        title,
        slug,
        description,
        price,
        mobile,
        whatsapp,
        address,
        status: "PENDING",
        adType: "FREE",
        isFeatured: false,
        userId: user.id,
        categoryId,
        cityId
      }
    });

    return NextResponse.json({
      success: true,
      message: "Ad submitted successfully and is pending approval.",
      adId: ad.id,
      slug: ad.slug
    });
  } catch (error) {
    console.error("Ad submission failed:", error);

    return NextResponse.json(
      { error: "Unable to submit ad. Please try again." },
      { status: 500 }
    );
  }
}
