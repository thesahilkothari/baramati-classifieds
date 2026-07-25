import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { getPlan } from "../../lib/adPlans";
import {
  ACTIVE_POLICY_VERSION,
  POLICY_EFFECTIVE_DATE,
  getAllowedAdvertiserTypeValues,
  getPolicyEffectiveDateForDatabase,
  validatePostAdDeclarations
} from "../../lib/compliance";
import {
  createManualPaymentReference,
  getPostAdSelection,
  MANUAL_UPI_CONFIG
} from "../../lib/manualPayment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
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

function cleanText(value, maxLength = 191) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanLongText(value, maxLength = 1000) {
  return String(value || "").trim().slice(0, maxLength);
}

function getRequestIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim().slice(0, 191);
  return request.headers.get("x-real-ip")?.slice(0, 191) || null;
}

function getRequestUserAgent(request) {
  return request.headers.get("user-agent") || null;
}

function normalizeDeclarations(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

function getPaymentSelection(body) {
  const basePlan = cleanText(body.basePlan || "FREE", 30).toUpperCase();
  const includeFeatured = body.includeFeatured === true;
  return getPostAdSelection(basePlan, includeFeatured);
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = cleanText(body.name, 120);
    const mobile = cleanMobile(body.mobile);
    const whatsapp = cleanMobile(body.whatsapp || body.mobile);
    const title = cleanText(body.title, 180);
    const description = String(body.description || "").trim();
    const price = String(body.price || "").trim();
    const address = cleanText(body.address, 240);
    const categoryId = Number(body.categoryId);
    const cityId = Number(body.cityId);
    const advertiserType = cleanText(body.advertiserType, 60);
    const policyVersion = cleanText(body.policyVersion, 40);
    const policyEffectiveDate = cleanText(body.policyEffectiveDate, 40);
    const declarations = normalizeDeclarations(body.declarations);
    const paymentSelection = getPaymentSelection(body);

    const manualTransactionRef = cleanText(body.transactionReference, 120);
    const manualPayerName = cleanText(body.payerName, 120);
    const manualPayerMobile = cleanMobile(body.payerMobile);
    const manualPaymentNote = cleanLongText(body.paymentNote, 500);

    if (!paymentSelection) {
      return NextResponse.json({ error: "Please select a valid classified plan." }, { status: 400 });
    }

    if (!name || name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    if (!mobile || mobile.length !== 10) return NextResponse.json({ error: "Please enter a valid 10 digit mobile number." }, { status: 400 });
    if (whatsapp && whatsapp.length !== 10) return NextResponse.json({ error: "Please enter a valid 10 digit WhatsApp number." }, { status: 400 });
    if (!title || title.length < 8) return NextResponse.json({ error: "Ad title must be at least 8 characters." }, { status: 400 });
    if (!description || description.length < 20) return NextResponse.json({ error: "Description must be at least 20 characters." }, { status: 400 });
    if (!categoryId || !cityId) return NextResponse.json({ error: "Please select category and city." }, { status: 400 });
    if (!getAllowedAdvertiserTypeValues().includes(advertiserType)) return NextResponse.json({ error: "Please select your advertiser type." }, { status: 400 });

    if (policyVersion !== ACTIVE_POLICY_VERSION || policyEffectiveDate !== POLICY_EFFECTIVE_DATE) {
      return NextResponse.json({ error: "The legal policy version has changed. Please refresh the page and submit again." }, { status: 409 });
    }

    const declarationValidation = validatePostAdDeclarations(declarations);
    if (!declarationValidation.isValid) {
      return NextResponse.json({ error: "Please complete all mandatory declarations and policy acceptances before submitting the classified." }, { status: 400 });
    }

    if (paymentSelection.amount > 0) {
      if (!manualTransactionRef || manualTransactionRef.length < 6) return NextResponse.json({ error: "Please enter the UPI transaction ID / UTR after making payment." }, { status: 400 });
      if (!manualPayerName || manualPayerName.length < 2) return NextResponse.json({ error: "Please enter the payer name used for UPI payment." }, { status: 400 });
      if (!manualPayerMobile || manualPayerMobile.length !== 10) return NextResponse.json({ error: "Please enter a valid 10 digit payer mobile number." }, { status: 400 });

      const duplicateReference = await prisma.payment.findFirst({
        where: { provider: MANUAL_UPI_CONFIG.provider, manualTransactionRef }
      });
      if (duplicateReference) {
        return NextResponse.json({ error: "This UPI transaction reference is already submitted. Please check the reference number or contact support." }, { status: 409 });
      }
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!category || !city) return NextResponse.json({ error: "Selected category or city is invalid." }, { status: 400 });

    const selectedPlan = getPlan(paymentSelection.planKey);
    if (!selectedPlan) return NextResponse.json({ error: "Selected payment plan is invalid." }, { status: 400 });

    const ipAddress = getRequestIp(request);
    const userAgent = getRequestUserAgent(request);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({ where: { mobile }, update: { name, isVerified: true }, create: { name, mobile, isVerified: true } });
      const slug = await createUniqueSlug(title, tx);

      const ad = await tx.ad.create({
        data: { title, slug, description, price: price ? price : null, mobile, whatsapp, address, status: "PENDING", adType: "FREE", isFeatured: false, userId: user.id, categoryId, cityId }
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
            acceptsContactDisplay: declarations.acceptsContactDisplay === true,
            selectedPlan: paymentSelection.planKey,
            amountDue: paymentSelection.amount,
            includesFeatured: paymentSelection.includesFeatured,
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
          { userId: user.id, adId: ad.id, mobile, consentType: "TERMS_OF_USE", consentValue: declarations.acceptsTerms === true, policyVersion: ACTIVE_POLICY_VERSION, source: "POST_AD_FORM", ipAddress, userAgent },
          { userId: user.id, adId: ad.id, mobile, consentType: "PRIVACY_POLICY", consentValue: declarations.acceptsPrivacy === true, policyVersion: ACTIVE_POLICY_VERSION, source: "POST_AD_FORM", ipAddress, userAgent },
          { userId: user.id, adId: ad.id, mobile, consentType: "REFUND_CANCELLATION_POLICY", consentValue: declarations.acceptsRefundPolicy === true, policyVersion: ACTIVE_POLICY_VERSION, source: "POST_AD_FORM", ipAddress, userAgent },
          { userId: user.id, adId: ad.id, mobile, consentType: "LISTING_RULES_PROHIBITED_CONTENT", consentValue: declarations.acceptsListingRules === true, policyVersion: ACTIVE_POLICY_VERSION, source: "POST_AD_FORM", ipAddress, userAgent },
          { userId: user.id, adId: ad.id, mobile, consentType: "CONTACT_DISPLAY_AND_AD_RESPONSE", consentValue: declarations.acceptsContactDisplay === true, policyVersion: ACTIVE_POLICY_VERSION, source: "POST_AD_FORM", ipAddress, userAgent }
        ]
      });

      let payment = null;
      if (paymentSelection.amount > 0) {
        const manualReferenceNumber = createManualPaymentReference(ad.id, paymentSelection.planKey);
        payment = await tx.payment.create({
          data: {
            userId: user.id,
            adId: ad.id,
            razorpayOrderId: manualReferenceNumber,
            amount: paymentSelection.amountInPaise,
            currency: "INR",
            status: "PENDING_MANUAL_VERIFICATION",
            plan: paymentSelection.planKey,
            purpose: selectedPlan.purpose,
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
      return { ad, payment };
    });

    return NextResponse.json({
      success: true,
      message: result.payment ? "Classified and payment reference submitted. The ad will go live after payment verification and admin approval." : "Free classified submitted successfully and is pending admin approval.",
      adId: result.ad.id,
      slug: result.ad.slug,
      paymentId: result.payment?.id || null,
      manualReferenceNumber: result.payment?.manualReferenceNumber || null,
      requiresPaymentVerification: Boolean(result.payment)
    });
  } catch (error) {
    console.error("Ad submission failed:", error);
    return NextResponse.json({ error: "Unable to submit ad. Please try again." }, { status: 500 });
  }
}
