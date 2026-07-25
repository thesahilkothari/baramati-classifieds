"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACTIVE_POLICY_VERSION,
  ADVERTISER_TYPES,
  POLICY_EFFECTIVE_DATE,
  POLICY_EFFECTIVE_DATE_LABEL,
  POSTING_TERMS_LABEL,
  POSTING_TERMS_URL,
  validatePostAdDeclarations
} from "../lib/compliance";
import {
  buildUpiPaymentUrl,
  calculatePostingTotal,
  FEATURED_ADDON_PLAN,
  formatManualAmount,
  MANUAL_PAYMENT_PLANS,
  MANUAL_UPI_CONFIG
} from "../lib/manualPayment";
import {
  canPlanUseFeatured,
  getLocalizedApprovalTime,
  getLocalizedPlanBadge,
  getLocalizedPlanDuration,
  getLocalizedPlanFeatures,
  getLocalizedPlanLimitations,
  getLocalizedPlanName,
  getPlanCharacterLimits
} from "../lib/planFeatures";
import { ITEM_CONDITIONS } from "../lib/itemConditions";
import { t, normalizeLanguage } from "../lib/i18n";

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  whatsapp: "",
  advertiserType: "",
  categoryId: "",
  cityId: "",
  title: "",
  description: "",
  price: "",
  address: "",
  condition: "NOT_APPLICABLE",
  selectedPlan: "FREE_7_DAYS",
  includeFeatured: false,
  payerName: "",
  payerMobile: "",
  transactionReference: "",
  paymentNote: ""
};

function getConditionLabel(condition, language) {
  if (condition.value === "NEW") return t(language, "new");
  if (condition.value === "USED") return t(language, "used");
  if (condition.value === "LIKE_NEW") return t(language, "likeNew");
  if (condition.value === "NOT_APPLICABLE") return t(language, "notApplicable");

  return condition.label;
}

export default function PostAdForm({
  categories = [],
  cities = [],
  initialLanguage = "en"
}) {
  const language = normalizeLanguage(initialLanguage);
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [acceptedAllTerms, setAcceptedAllTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPlan = useMemo(
    () =>
      MANUAL_PAYMENT_PLANS.find((plan) => plan.key === form.selectedPlan) ||
      MANUAL_PAYMENT_PLANS[0],
    [form.selectedPlan]
  );

  const canAddFeatured = canPlanUseFeatured(form.selectedPlan);

  const limits = useMemo(
    () => getPlanCharacterLimits(form.selectedPlan),
    [form.selectedPlan]
  );

  const total = useMemo(
    () =>
      calculatePostingTotal({
        planKey: form.selectedPlan,
        includeFeatured: form.includeFeatured
      }),
    [form.selectedPlan, form.includeFeatured]
  );

  const requiresPayment = total.amount > 0;

  const upiUrl = useMemo(
    () =>
      buildUpiPaymentUrl({
        amount: total.amount,
        adId: "",
        planKey: form.selectedPlan,
        referenceNumber: "NEW-AD"
      }),
    [form.selectedPlan, total.amount]
  );

  useEffect(() => {
    if (!canAddFeatured && form.includeFeatured) {
      setForm((current) => ({
        ...current,
        includeFeatured: false
      }));
    }
  }, [canAddFeatured, form.includeFeatured]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      title: current.title.slice(0, limits.titleMaxLength),
      description: current.description.slice(0, limits.descriptionMaxLength)
    }));
  }, [limits.titleMaxLength, limits.descriptionMaxLength]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => {
      let nextValue = type === "checkbox" ? checked : value;

      if (name === "title") {
        nextValue = String(nextValue).slice(0, limits.titleMaxLength);
      }

      if (name === "description") {
        nextValue = String(nextValue).slice(0, limits.descriptionMaxLength);
      }

      return {
        ...current,
        [name]: nextValue
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const declarations = {
      acceptsAllTerms: acceptedAllTerms
    };

    const declarationValidation = validatePostAdDeclarations(declarations);

    if (!declarationValidation.isValid) {
      setError(
        language === "mr"
          ? "कृपया Terms and Conditions for Posting a Classified वाचून स्वीकारा."
          : "Please read and accept the Terms and Conditions for Posting a Classified."
      );
      return;
    }

    if (!form.advertiserType) {
      setError(language === "mr" ? "कृपया advertiser type निवडा." : "Please select your advertiser type.");
      return;
    }

    if (!form.email.trim()) {
      setError(
        language === "mr"
          ? "कृपया status आणि renewal reminders साठी email address भरा."
          : "Please enter your email address for ad status and renewal reminders."
      );
      return;
    }

    if (requiresPayment) {
      if (!form.payerName.trim()) {
        setError(language === "mr" ? "कृपया payer name भरा." : "Please enter the payer name used for UPI payment.");
        return;
      }

      const payerMobile = String(form.payerMobile || "").replace(/\D/g, "");

      if (payerMobile.length !== 10) {
        setError(language === "mr" ? "कृपया १० अंकी payer mobile number भरा." : "Please enter a valid 10 digit payer mobile number.");
        return;
      }

      if (!form.transactionReference.trim()) {
        setError(language === "mr" ? "कृपया UPI Transaction ID / UTR भरा." : "Please enter the UPI transaction ID / UTR / bank reference.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          images: [],
          includeFeatured: canAddFeatured ? form.includeFeatured : false,
          declarations,
          policyVersion: ACTIVE_POLICY_VERSION,
          policyEffectiveDate: POLICY_EFFECTIVE_DATE,
          payment: requiresPayment
            ? {
                provider: MANUAL_UPI_CONFIG.provider,
                payerName: form.payerName,
                payerMobile: form.payerMobile,
                transactionReference: form.transactionReference,
                note: form.paymentNote,
                amount: total.amount,
                amountInPaise: total.amountInPaise
              }
            : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (language === "mr" ? "जाहिरात सबमिट होऊ शकली नाही." : "Unable to submit ad."));
        return;
      }

      const query = data.manualReferenceNumber
        ? `?adId=${data.adId}&paymentRef=${encodeURIComponent(
            data.manualReferenceNumber
          )}`
        : `?adId=${data.adId}`;

      router.push(`/post-ad/success${query}`);
    } catch (submitError) {
      console.error("Submit ad failed:", submitError);
      setError(language === "mr" ? "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा." : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-3xl border-2 border-slate-900 bg-white p-4 md:p-5">
        <p className="text-sm font-black uppercase tracking-wide text-blue-700">
          {t(language, "step1")}
        </p>

        <h2 className="mt-1 text-2xl font-black uppercase text-slate-950">
          {t(language, "choosePlan")}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t(language, "choosePlanIntro")}
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {MANUAL_PAYMENT_PLANS.map((plan) => (
            <label
              key={plan.key}
              className={`flex cursor-pointer flex-col rounded-2xl border-2 p-4 ${
                form.selectedPlan === plan.key
                  ? "border-blue-700 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <input
                type="radio"
                name="selectedPlan"
                value={plan.key}
                checked={form.selectedPlan === plan.key}
                onChange={updateField}
                className="sr-only"
              />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-white">
                    {getLocalizedPlanBadge(plan, language)}
                  </span>

                  <h3 className="mt-3 text-lg font-black text-slate-950">
                    {getLocalizedPlanName(plan, language)}
                  </h3>

                  <p className="mt-1 text-xs font-black uppercase text-slate-500">
                    {t(language, "validFor")} {getLocalizedPlanDuration(plan, language)}
                  </p>
                </div>

                <p className="font-black text-blue-700">
                  {formatManualAmount(plan.price)}
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-white/70 p-3 text-xs leading-5 text-slate-700">
                <p>
                  <strong>{t(language, "headingLimit")}:</strong> {plan.titleMaxLength} characters
                </p>
                <p>
                  <strong>{t(language, "descriptionLimit")}:</strong> {plan.descriptionMaxLength} characters
                </p>
                <p>
                  <strong>{t(language, "approval")}:</strong>{" "}
                  {getLocalizedApprovalTime(plan, language)}
                </p>
              </div>

              <ul className="mt-4 flex-1 space-y-2 text-sm leading-5 text-slate-700">
                {getLocalizedPlanFeatures(plan, language).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="font-black text-green-700">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {getLocalizedPlanLimitations(plan, language).length > 0 && (
                <ul className="mt-4 space-y-2 text-xs leading-5 text-slate-500">
                  {getLocalizedPlanLimitations(plan, language).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              )}
            </label>
          ))}
        </div>

        <label
          className={`mt-5 flex gap-3 rounded-2xl border-2 p-4 ${
            canAddFeatured
              ? "cursor-pointer border-orange-300 bg-orange-50"
              : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"
          }`}
        >
          <input
            type="checkbox"
            name="includeFeatured"
            checked={form.includeFeatured}
            onChange={updateField}
            disabled={!canAddFeatured}
            className="mt-1 h-4 w-4 shrink-0"
          />

          <span>
            <span className="block font-black text-slate-950">
              {t(language, "addFeaturedPlacement")} - {formatManualAmount(FEATURED_ADDON_PLAN.price)}
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-600">
              {t(language, "featuredPlacementText")}
            </span>
          </span>
        </label>

        <div className="mt-5 rounded-2xl border bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-slate-500">
                {t(language, "totalPayable")}
              </p>
              <p className="mt-1 text-3xl font-black text-red-700">
                {formatManualAmount(total.amount)}
              </p>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-600">
              {t(language, "gstInclusive")}. {t(language, "selectedPlanLimit")}:{" "}
              {t(language, "headingLimit")} <strong>{limits.titleMaxLength}</strong>{" "}
              characters, {t(language, "descriptionLimit")}{" "}
              <strong>{limits.descriptionMaxLength}</strong> characters.
            </p>
          </div>
        </div>
      </section>

      {requiresPayment && (
        <section className="rounded-3xl border bg-white p-4 shadow-sm md:p-5">
          <p className="text-sm font-black uppercase tracking-wide text-green-700">
            {t(language, "step2")}
          </p>

          <h2 className="mt-1 text-2xl font-black uppercase text-slate-950">
            {t(language, "payByUpi")}
          </h2>

          <div className="mt-5 grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="rounded-3xl border-2 border-slate-900 bg-slate-50 p-4 text-center">
              <img
                src={MANUAL_UPI_CONFIG.qrImagePath}
                alt="My Classifieds UPI QR code"
                className="mx-auto w-full max-w-[260px] rounded-2xl border bg-white p-2"
              />

              <p className="mt-3 text-sm font-bold text-slate-700">
                {t(language, "upiId")}:{" "}
                <span className="font-black text-slate-950">
                  {MANUAL_UPI_CONFIG.vpa}
                </span>
              </p>

              <a
                href={upiUrl}
                className="mt-4 flex justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-green-700"
              >
                {t(language, "openUpiApp")}
              </a>
            </div>

            <div>
              <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                {t(language, "payExactly")}{" "}
                <span className="font-black">{formatManualAmount(total.amount)}</span>{" "}
                for{" "}
                <span className="font-black">
                  {getLocalizedPlanName(selectedPlan, language)}
                </span>
                {form.includeFeatured ? " + Featured Add-on" : ""}.{" "}
                {t(language, "afterPaymentEnterUtr")}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    {t(language, "payerName")}
                  </label>
                  <input
                    name="payerName"
                    value={form.payerName}
                    onChange={updateField}
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
                    required={requiresPayment}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    {t(language, "payerMobile")}
                  </label>
                  <input
                    name="payerMobile"
                    value={form.payerMobile}
                    onChange={updateField}
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
                    inputMode="numeric"
                    maxLength={10}
                    required={requiresPayment}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-bold text-slate-700">
                  {t(language, "utrReference")}
                </label>
                <input
                  name="transactionReference"
                  value={form.transactionReference}
                  onChange={updateField}
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
                  required={requiresPayment}
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-bold text-slate-700">
                  {t(language, "optionalPaymentNote")}
                </label>
                <textarea
                  name="paymentNote"
                  value={form.paymentNote}
                  onChange={updateField}
                  className="mt-2 min-h-20 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl border bg-white p-4 shadow-sm md:p-5">
        <p className="text-sm font-black uppercase tracking-wide text-blue-700">
          {requiresPayment ? t(language, "step3") : t(language, "step2")}
        </p>

        <h2 className="mt-1 text-2xl font-black uppercase text-slate-950">
          {t(language, "classifiedDetails")}
        </h2>

        <p className="mt-2 text-sm font-bold text-blue-700">
          {t(language, "englishMarathiAllowed")}
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-slate-700">
              {t(language, "yourName")}
            </label>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {t(language, "emailAddress")}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              placeholder={t(language, "emailPlaceholder")}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {t(language, "mobileNumber")}
            </label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              maxLength={10}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {t(language, "whatsappNumber")}
            </label>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              placeholder={t(language, "whatsappPlaceholder")}
              maxLength={10}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {t(language, "advertiserType")}
            </label>
            <select
              name="advertiserType"
              value={form.advertiserType}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              required
            >
              <option value="">{t(language, "selectAdvertiserType")}</option>
              {ADVERTISER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {t(language, "condition")}
            </label>
            <select
              name="condition"
              value={form.condition}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            >
              {ITEM_CONDITIONS.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {getConditionLabel(condition, language)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {t(language, "price")}
            </label>
            <input
              name="price"
              value={form.price}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {t(language, "category")}
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              required
            >
              <option value="">{t(language, "selectCategory")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {language === "mr" ? category.nameMr || category.nameEn : category.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {t(language, "city")}
            </label>
            <select
              name="cityId"
              value={form.cityId}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              required
            >
              <option value="">{t(language, "selectCity")}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-bold text-slate-700">
              {t(language, "adHeading")}
            </label>
            <span className="text-xs font-bold text-slate-500">
              {form.title.length}/{limits.titleMaxLength} characters
            </span>
          </div>

          <input
            name="title"
            value={form.title}
            onChange={updateField}
            maxLength={limits.titleMaxLength}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder={t(language, "adHeadingPlaceholder")}
            required
          />
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-bold text-slate-700">
              {t(language, "classifiedDescription")}
            </label>
            <span className="text-xs font-bold text-slate-500">
              {form.description.length}/{limits.descriptionMaxLength} characters
            </span>
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            maxLength={limits.descriptionMaxLength}
            className="mt-2 min-h-32 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder={t(language, "classifiedDescriptionPlaceholder")}
            required
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-bold text-slate-700">
            {t(language, "areaLocation")}
          </label>
          <input
            name="address"
            value={form.address}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder={t(language, "areaLocationPlaceholder")}
          />
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-4 shadow-sm md:p-5">
        <p className="text-sm font-black uppercase tracking-wide text-blue-700">
          {t(language, "legalAcceptance")}
        </p>

        <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          Policy Version {ACTIVE_POLICY_VERSION} | Effective from{" "}
          {POLICY_EFFECTIVE_DATE_LABEL}
        </div>

        <label className="mt-4 flex gap-3 rounded-2xl border-2 border-slate-900 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-800">
          <input
            type="checkbox"
            checked={acceptedAllTerms}
            onChange={(event) => setAcceptedAllTerms(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0"
            required
          />

          <span>
            {t(language, "iAcceptAllTerms")}{" "}
            <Link
              href={POSTING_TERMS_URL}
              target="_blank"
              className="font-black text-blue-700 underline"
            >
              {language === "mr" ? t(language, "postingTerms") : POSTING_TERMS_LABEL}
            </Link>
            .
          </span>
        </label>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-red-600 px-6 py-4 font-black uppercase text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? t(language, "submitting")
          : requiresPayment
            ? t(language, "submitWithPayment")
            : t(language, "submitFree")}
      </button>
    </form>
  );
}
