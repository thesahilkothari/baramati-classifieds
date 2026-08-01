import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getAdminSession } from "../../../lib/adminAuth";
import { isAllowedTier2LocationSlug } from "../../../lib/locations";
import {
  ADMIN_MANAGEABLE_PLAN_KEYS,
  buildAdminPlanUpdate,
  cleanAdminLongText,
  cleanAdminMobile,
  cleanAdminText,
  createUniqueAdSlug
} from "../../../lib/adminAdTools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = ["PENDING", "ACTIVE", "REJECTED", "EXPIRED", "SOLD"];

function isValidEmail(value) {
  const email = String(value || "").trim();
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin request." }, { status: 401 });
    }

    const body = await request.json();

    const name = cleanAdminText(body.name, 120);
    const email = cleanAdminText(body.email, 180).toLowerCase();
    const mobile = cleanAdminMobile(body.mobile);
    const whatsapp = cleanAdminMobile(body.whatsapp || body.mobile);
    const title = cleanAdminText(body.title, 220);
    const description = cleanAdminLongText(body.description, 5000);
    const price = cleanAdminText(body.price, 40);
    const address = cleanAdminText(body.address, 240);
    const categoryId = Number(body.categoryId);
    const cityId = Number(body.cityId);
    const status = allowedStatuses.includes(String(body.status || "ACTIVE").toUpperCase())
      ? String(body.status || "ACTIVE").toUpperCase()
      : "ACTIVE";
    const planKey = ADMIN_MANAGEABLE_PLAN_KEYS.includes(String(body.planKey || ""))
      ? String(body.planKey)
      : "FREE_7_DAYS";

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Advertiser name is required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json({ error: "A valid 10 digit mobile number is required." }, { status: 400 });
    }

    if (!title || title.length < 8) {
      return NextResponse.json({ error: "Ad heading must be at least 8 characters." }, { status: 400 });
    }

    if (!description || description.length < 20) {
      return NextResponse.json({ error: "Description must be at least 20 characters." }, { status: 400 });
    }

    if (!categoryId || !cityId) {
      return NextResponse.json({ error: "Category and city are required." }, { status: 400 });
    }

    const [category, city] = await Promise.all([
      prisma.category.findUnique({ where: { id: categoryId } }),
      prisma.city.findUnique({ where: { id: cityId } })
    ]);

    if (!category || !city) {
      return NextResponse.json({ error: "Invalid category or city." }, { status: 400 });
    }

    if (!isAllowedTier2LocationSlug(city.slug)) {
      return NextResponse.json({ error: "Selected city is outside approved launch locations." }, { status: 400 });
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { mobile },
        update: {
          name,
          email: email || undefined,
          isVerified: true
        },
        create: {
          name,
          email: email || null,
          mobile,
          isVerified: true
        }
      });

      const slug = await createUniqueAdSlug(title, tx);
      const planUpdate = buildAdminPlanUpdate({
        existingAd: { adType: "FREE", isFeatured: false },
        planKey,
        durationDays: body.durationDays,
        expiryDate: body.expiresAt,
        featuredDays: body.featuredDays,
        featuredUntilDate: body.featuredUntil
      });

      const ad = await tx.ad.create({
        data: {
          title,
          slug,
          description,
          price: price ? price : null,
          mobile,
          whatsapp,
          address,
          status,
          approvedAt: status === "ACTIVE" ? now : null,
          adType: planUpdate.adType || "FREE",
          isFeatured: planUpdate.isFeatured === true,
          expiresAt: status === "ACTIVE" ? planUpdate.expiresAt : null,
          featuredUntil: status === "ACTIVE" && planUpdate.isFeatured ? planUpdate.featuredUntil || planUpdate.expiresAt : null,
          soldStatus: "UNKNOWN",
          userId: user.id,
          categoryId,
          cityId
        },
        include: {
          user: true,
          category: true,
          city: true
        }
      });

      return { ad, user };
    });

    return NextResponse.json({
      success: true,
      message: "Admin ad created successfully.",
      ad: result.ad
    });
  } catch (error) {
    console.error("Admin ad creation failed:", error);
    return NextResponse.json({ error: "Unable to create admin ad." }, { status: 500 });
  }
}
