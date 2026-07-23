import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import {
  ACTIVE_POLICY_VERSION,
  POLICY_EFFECTIVE_DATE,
  getAllowedAdvertiserTypeValues,
  getPolicyEffectiveDateForDatabase,
  validatePostAdDeclarations
} from "../../lib/compliance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function createUniqueSlug(title, db = prisma) {
  const baseSlug = slugify(title) || `classified-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (await db.ad.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

function cleanMobile(value) {
  return String(value || "").replace(/\D/g, "");
}

function cleanShortText(value, maxLength = 191) {
  return String(value || "").trim().slice(0, maxLength);
}

function getRequestIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim().slice(0, 191);
  }

  return request.headers.get("x-real-ip")?.slice(0, 191) || null;
}

function getRequestUserAgent(request) {
  return request.headers.get("user-agent") || null;
}

function normalizeDeclarations(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = cleanShortText(body.name, 120);
    const mobile = cleanMobile(body.mobile);
    const whatsapp = cleanMobile(body.whatsapp || body.mobile);
    const title = cleanShortText(body.title, 180);
    const description = String(body.description || "").trim();
    const price = String(body.price || "").trim();
    const address = cleanShortText(body.address, 240);
    const categoryId = Number(body.categoryId);
    const cityId = Number(body.cityId);
    const advertiserType = cleanShortText(body.advertiserType, 60);
    const policyVersion = cleanShortText(body.policyVersion, 40);
    const policyEffectiveDate = cleanShortText(body.policyEffectiveDate, 40);
    const declarations = normalizeDeclarations(body.declarations);

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

    if (whatsapp && whatsapp.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10 digit WhatsApp number." },
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

    if (!getAllowedAdvertiserTypeValues().includes(advertiserType)) {
      return NextResponse.json(
        { error: "Please select your advertiser type." },
        { status: 400 }
      );
    }

    if (
      policyVersion !== ACTIVE_POLICY_VERSION ||
      policyEffectiveDate !== POLICY_EFFECTIVE_DATE
    ) {
      return NextResponse.json(
        {
          error:
            "The legal policy version has changed. Please refresh the page and submit again."
        },
        { status: 409 }
      );
    }

    const declarationValidation = validatePostAdDeclarations(declarations);

    if (!declarationValidation.isValid) {
      return NextResponse.json(
        {
          error:
            "Please complete all mandatory declarations and policy acceptances before submitting the classified."
        },
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

    const ipAddress = getRequestIp(request);
    const userAgent = getRequestUserAgent(request);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
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

      const slug = await createUniqueSlug(title, tx);

      const ad = await tx.ad.create({
        data: {
          title,
          slug,
          description,
          price: price ? price : null,
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

      await tx.policyAcceptance.create({
        data: {
          userId: user.id,
          adId: ad.id,
          mobile,
          name,
          policyVersion: ACTIVE_POLICY_VERSION,
          effectiveDate: getPolicyEffectiveDateForDatabase(),
          source: "POST_AD_FORM",
          acceptedTerms: declarations.acceptsTerms === true,
          acceptedPrivacy: declarations.acceptsPrivacy === true,
          acceptedRefund: declarations.acceptsRefundPolicy === true,
          acceptedListingRules: declarations.acceptsListingRules === true,
          acceptedModeration: declarations.acceptsModeration === true,
          declarations: {
            advertiserType,
            isAdult: declarations.isAdult === true,
            hasAuthority: declarations.hasAuthority === true,
            truthfulInfo: declarations.truthfulInfo === true,
            notProhibited: declarations.notProhibited === true,
            acceptsContactDisplay:
              declarations.acceptsContactDisplay === true,
            policyVersion: ACTIVE_POLICY_VERSION,
            policyEffectiveDate: POLICY_EFFECTIVE_DATE,
            submittedAt: new Date().toISOString()
          },
          ipAddress,
          userAgent
        }
      });

      await tx.consentRecord.createMany({
        data: [
          {
            userId: user.id,
            adId: ad.id,
            mobile,
            consentType: "TERMS_OF_USE",
            consentValue: declarations.acceptsTerms === true,
            policyVersion: ACTIVE_POLICY_VERSION,
            source: "POST_AD_FORM",
            ipAddress,
            userAgent
          },
          {
            userId: user.id,
            adId: ad.id,
            mobile,
            consentType: "PRIVACY_POLICY",
            consentValue: declarations.acceptsPrivacy === true,
            policyVersion: ACTIVE_POLICY_VERSION,
            source: "POST_AD_FORM",
            ipAddress,
            userAgent
          },
          {
            userId: user.id,
            adId: ad.id,
            mobile,
            consentType: "REFUND_CANCELLATION_POLICY",
            consentValue: declarations.acceptsRefundPolicy === true,
            policyVersion: ACTIVE_POLICY_VERSION,
            source: "POST_AD_FORM",
            ipAddress,
            userAgent
          },
          {
            userId: user.id,
            adId: ad.id,
            mobile,
            consentType: "LISTING_RULES_PROHIBITED_CONTENT",
            consentValue: declarations.acceptsListingRules === true,
            policyVersion: ACTIVE_POLICY_VERSION,
            source: "POST_AD_FORM",
            ipAddress,
            userAgent
          },
          {
            userId: user.id,
            adId: ad.id,
            mobile,
            consentType: "CONTACT_DISPLAY_AND_AD_RESPONSE",
            consentValue: declarations.acceptsContactDisplay === true,
            policyVersion: ACTIVE_POLICY_VERSION,
            source: "POST_AD_FORM",
            ipAddress,
            userAgent
          }
        ]
      });

      return { ad, user };
    });

    return NextResponse.json({
      success: true,
      message:
        "Classified submitted successfully with policy acceptance record and is pending approval.",
      adId: result.ad.id,
      slug: result.ad.slug
    });
  } catch (error) {
    console.error("Ad submission failed:", error);

    return NextResponse.json(
      { error: "Unable to submit ad. Please try again." },
      { status: 500 }
    );
  }
}
