import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { getPlan, BUSINESS_ANNUAL_PLAN_KEY } from "../../lib/adPlans";
import {
  ACTIVE_POLICY_VERSION,
  POLICY_EFFECTIVE_DATE,
  getAllowedAdvertiserTypeValues,
  getPolicyEffectiveDateForDatabase,
  hasAcceptedConsolidatedPostingTerms,
  validatePostAdDeclarations
} from "../../lib/compliance";
import {
  calculatePostingTotal,
  createManualPaymentReference,
  MANUAL_UPI_CONFIG
} from "../../lib/manualPayment";
import { isAllowedTier2LocationSlug } from "../../lib/locations";
import { canPlanUseFeatured, getPlanCharacterLimits } from "../../lib/planFeatures";
import {
  buildAdSubmissionEmail,
  buildAdminNewAdNotification,
  safeSendAdminEventEmail,
  safeSendUserEventEmail,
  getUserEmailFromAd
} from "../../lib/userEventEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_POSTING_PLANS = [
  "FREE_7_DAYS",
  "PAID_7_DAYS",
  "PREMIUM_30_DAYS",
  BUSINESS_ANNUAL_PLAN_KEY
];

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

function cleanLongText(value, maxLength = 1000) {
  return String(value || "").trim().slice(0, maxLength);
}

function isValidEmail(value) {
  const email = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

function getPurposeForManualPayment(planKey, includeFeatured) {
  if (planKey === "PAID_7_DAYS" && includeFeatured) {
    return "PAID_AD_WITH_FEATURED_ADDON";
  }

  if (planKey === "PREMIUM_30_DAYS" && includeFeatured) {
    return "PREMIUM_AD_WITH_FEATURED_ADDON";
  }

  return getPlan(planKey)?.purpose || "MANUAL_UPI_PAYMENT";
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = cleanShortText(body.name, 120);
    const email = cleanShortText(body.email, 180).toLowerCase();
    const mobile = cleanMobile(body.mobile);
    const whatsapp = cleanMobile(body.whatsapp || body.mobile);
    const selectedPlan = cleanShortText(body.selectedPlan || "FREE_7_DAYS", 80);
    const limits = getPlanCharacterLimits(selectedPlan);
    const title = cleanShortText(body.title, limits.titleMaxLength);
    const description = String(body.description || "")
      .trim()
      .slice(0, limits.descriptionMaxLength);
    const rawTitle = String(body.title || "").trim();
    const rawDescription = String(body.description || "").trim();
    const price = String(body.price || "").trim();
    const address = cleanShortText(body.address, 240);
    const categoryId = Number(body.categoryId);
    const cityId = Number(body.cityId);
    const advertiserType = cleanShortText(body.advertiserType, 60);
    const policyVersion = cleanShortText(body.policyVersion, 40);
    const policyEffectiveDate = cleanShortText(body.policyEffectiveDate, 40);
    const includeFeatured = body.includeFeatured === true && canPlanUseFeatured(selectedPlan);
    const declarations = normalizeDeclarations(body.declarations);
    const payment = body.payment && typeof body.payment === "object" ? body.payment : null;

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json({ error: "Please enter a valid 10 digit mobile number." }, { status: 400 });
    }

    if (whatsapp && whatsapp.length !== 10) {
      return NextResponse.json({ error: "Please enter a valid 10 digit WhatsApp number." }, { status: 400 });
    }

    if (!title || title.length < 8) {
      return NextResponse.json({ error: "Ad heading must be at least 8 characters." }, { status: 400 });
    }

    if (rawTitle.length > limits.titleMaxLength) {
      return NextResponse.json(
        { error: `Ad heading can be maximum ${limits.titleMaxLength} characters for the selected plan.` },
        { status: 400 }
      );
    }

    if (!description || description.length < 20) {
      return NextResponse.json({ error: "Description must be at least 20 characters." }, { status: 400 });
    }

    if (rawDescription.length > limits.descriptionMaxLength) {
      return NextResponse.json(
        { error: `Description can be maximum ${limits.descriptionMaxLength} characters for the selected plan.` },
        { status: 400 }
      );
    }

    if (!categoryId || !cityId) {
      return NextResponse.json({ error: "Please select category and city." }, { status: 400 });
    }

    if (!getAllowedAdvertiserTypeValues().includes(advertiserType)) {
      return NextResponse.json({ error: "Please select your advertiser type." }, { status: 400 });
    }

    if (policyVersion !== ACTIVE_POLICY_VERSION || policyEffectiveDate !== POLICY_EFFECTIVE_DATE) {
      return NextResponse.json(
        { error: "The legal policy version has changed. Please refresh the page and submit again." },
        { status: 409 }
      );
    }

    const declarationValidation = validatePostAdDeclarations(declarations);

    if (!declarationValidation.isValid) {
      return NextResponse.json(
        { error: "Please read and accept the Terms and Conditions for Posting a Classified." },
        { status: 400 }
      );
    }

    if (!PUBLIC_POSTING_PLANS.includes(selectedPlan)) {
      return NextResponse.json({ error: "Invalid classified plan selected." }, { status: 400 });
    }

    const total = calculatePostingTotal({ planKey: selectedPlan, includeFeatured });
    const recordedIncludeFeatured = total.includeFeatured === true;
    const requiresPayment = total.amountInPaise > 0;

    let manualTransactionRef = "";
    let manualPayerName = "";
    let manualPayerMobile = "";
    let manualPaymentNote = "";

    if (requiresPayment) {
      manualTransactionRef = cleanShortText(payment?.transactionReference, 120);
      manualPayerName = cleanShortText(payment?.payerName, 120);
      manualPayerMobile = cleanMobile(payment?.payerMobile);
      manualPaymentNote = cleanLongText(payment?.note, 500);

      if (!manualTransactionRef || manualTransactionRef.length < 6) {
        return NextResponse.json(
          { error: "Please enter a valid UPI transaction ID / UTR / bank reference number." },
          { status: 400 }
        );
      }

      if (!manualPayerName || manualPayerName.length < 2) {
        return NextResponse.json({ error: "Please enter the payer name used for payment." }, { status: 400 });
      }

      if (!manualPayerMobile || manualPayerMobile.length !== 10) {
        return NextResponse.json({ error: "Please enter a valid 10 digit payer mobile number." }, { status: 400 });
      }

      const duplicateReference = await prisma.payment.findFirst({
        where: {
          provider: MANUAL_UPI_CONFIG.provider,
          manualTransactionRef
        }
      });

      if (duplicateReference) {
        return NextResponse.json(
          { error: "This UPI transaction reference is already submitted. Please check the reference number or contact support." },
          { status: 409 }
        );
      }
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    const city = await prisma.city.findUnique({ where: { id: cityId } });

    if (!category || !city) {
      return NextResponse.json({ error: "Selected category or city is invalid." }, { status: 400 });
    }

    if (!isAllowedTier2LocationSlug(city.slug)) {
      return NextResponse.json(
        {
          error:
            "Selected city is currently outside the My Classifieds launch locations. Please select an approved tier-2 Maharashtra location."
        },
        { status: 400 }
      );
    }

    const ipAddress = getRequestIp(request);
    const userAgent = getRequestUserAgent(request);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { mobile },
        update: { name, email, isVerified: true },
        create: { name, email, mobile, isVerified: true }
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

      let paymentRecord = null;

      if (requiresPayment) {
        const manualReferenceNumber = createManualPaymentReference(ad.id, selectedPlan);

        paymentRecord = await tx.payment.create({
          data: {
            userId: user.id,
            adId: ad.id,
            razorpayOrderId: manualReferenceNumber,
            amount: total.amountInPaise,
            currency: "INR",
            status: "PENDING_MANUAL_VERIFICATION",
            plan: selectedPlan,
            purpose: getPurposeForManualPayment(selectedPlan, includeFeatured),
            provider: MANUAL_UPI_CONFIG.provider,
            manualReferenceNumber,
            manualTransactionRef,
            manualPayerName,
            manualPayerMobile,
            manualPaymentNote,
            manualSubmittedAt: new Date()
          }
        });
      }

      const acceptedAllTerms = hasAcceptedConsolidatedPostingTerms(declarations);

      await tx.policyAcceptance.create({
        data: {
          userId: user.id,
          adId: ad.id,
          mobile,
          name,
          policyVersion: ACTIVE_POLICY_VERSION,
          effectiveDate: getPolicyEffectiveDateForDatabase(),
          source: "POST_AD_FORM",
          acceptedTerms: acceptedAllTerms,
          acceptedPrivacy: acceptedAllTerms,
          acceptedRefund: acceptedAllTerms,
          acceptedListingRules: acceptedAllTerms,
          acceptedModeration: acceptedAllTerms,
          declarations: {
            advertiserType,
            acceptsAllTerms: acceptedAllTerms,
            postingTermsUrl: "/legal/posting-terms",
            selectedPlan,
            includeFeatured: recordedIncludeFeatured,
            totalAmount: total.amount,
            totalAmountInPaise: total.amountInPaise,
            titleMaxLength: limits.titleMaxLength,
            descriptionMaxLength: limits.descriptionMaxLength,
            isAdult: acceptedAllTerms,
            hasAuthority: acceptedAllTerms,
            truthfulInfo: acceptedAllTerms,
            notProhibited: acceptedAllTerms,
            acceptsContactDisplay: acceptedAllTerms,
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
            consentType: "CONSOLIDATED_POSTING_TERMS",
            consentValue: acceptedAllTerms,
            policyVersion: ACTIVE_POLICY_VERSION,
            source: "POST_AD_FORM",
            ipAddress,
            userAgent
          },
          {
            userId: user.id,
            adId: ad.id,
            mobile,
            consentType: "TERMS_PRIVACY_REFUND_LISTING_RULES",
            consentValue: acceptedAllTerms,
            policyVersion: ACTIVE_POLICY_VERSION,
            source: "POST_AD_FORM",
            ipAddress,
            userAgent
          }
        ]
      });

      return { ad, user, paymentRecord };
    });

    await safeSendUserEventEmail({
      to: getUserEmailFromAd(result.ad),
      email: buildAdSubmissionEmail({ ad: result.ad, paymentRecord: result.paymentRecord })
    });

    await safeSendAdminEventEmail(
      buildAdminNewAdNotification({ ad: result.ad, paymentRecord: result.paymentRecord })
    );

    return NextResponse.json({
      success: true,
      message: requiresPayment
        ? "Classified and payment reference submitted successfully. It is pending payment verification and admin approval. Confirmation email has been sent."
        : "Free classified submitted successfully and is pending admin approval. Confirmation email has been sent.",
      adId: result.ad.id,
      slug: result.ad.slug,
      manualReferenceNumber: result.paymentRecord?.manualReferenceNumber || null
    });
  } catch (error) {
    console.error("Ad submission failed:", error);

    return NextResponse.json({ error: "Unable to submit ad. Please try again." }, { status: 500 });
  }
}
