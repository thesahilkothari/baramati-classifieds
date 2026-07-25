"use client";

import { useMemo, useState } from "react";
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
  getLocalizedPlanDuration,
  getLocalizedPlanFeatures,
  getLocalizedPlanName
} from "../lib/planFeatures";
import { normalizeLanguage, t } from "../lib/i18n";

export default function RenewAdForm({
  initialAdId = "",
  initialMobile = "",
  initialLanguage = "en"
}) {
  const language = normalizeLanguage(initialLanguage);
  const [adId, setAdId] = useState(initialAdId);
  const [mobile, setMobile] = useState(initialMobile);
  const [selectedPlan, setSelectedPlan] = useState("PAID_7_DAYS");
  const [includeFeatured, setIncludeFeatured] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [payerMobile, setPayerMobile] = useState(initialMobile);
  const [transactionReference, setTransactionReference] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [manualReferenceNumber, setManualReferenceNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paidPlans = MANUAL_PAYMENT_PLANS.filter((plan) => plan.price > 0);

  const selectedPlanMeta =
    paidPlans.find((plan) => plan.key === selectedPlan) || paidPlans[0];

  const canAddFeatured = canPlanUseFeatured(selectedPlan);

  const total = useMemo(
    () =>
      calculatePostingTotal({
        planKey: selectedPlan,
        includeFeatured
      }),
    [selectedPlan, includeFeatured]
  );

  const upiUrl = useMemo(
    () =>
      buildUpiPaymentUrl({
        amount: total.amount,
        adId,
        planKey: selectedPlan,
        referenceNumber: `RENEW-${adId || ""}`
      }),
    [adId, selectedPlan, total.amount]
  );

  async function submitRenewal(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setManualReferenceNumber("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payment/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source: "RENEWAL_FORM",
          adId,
          ownerMobile: mobile,
          plan: selectedPlan,
          includeFeatured,
          payerName,
          payerMobile,
          transactionReference,
          note
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (language === "mr" ? "Renewal payment reference सबमिट होऊ शकला नाही." : "Unable to submit renewal payment reference."));
        return;
      }

      setManualReferenceNumber(data.manualReferenceNumber);
      setMessage(
        language === "mr"
          ? "Renewal/upgrade payment reference सबमिट झाला आहे. Admin verification नंतर plan लागू होईल."
          : "Renewal/upgrade payment reference submitted. Admin will verify and apply the selected plan."
      );
      setTransactionReference("");
      setNote("");
    } catch (submitError) {
      console.error("Renewal submit failed:", submitError);
      setError(language === "mr" ? "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा." : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitRenewal} className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-slate-700">
            {t(language, "adId")}
          </label>
          <input
            value={adId}
            onChange={(event) => setAdId(event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            required
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">
            {t(language, "postingMobileNumber")}
          </label>
          <input
            value={mobile}
            onChange={(event) => setMobile(event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            maxLength={10}
            required
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {paidPlans.map((plan) => (
          <label
            key={plan.key}
            className={`cursor-pointer rounded-2xl border-2 p-4 ${
              selectedPlan === plan.key
                ? "border-blue-700 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <input
              type="radio"
              value={plan.key}
              checked={selectedPlan === plan.key}
              onChange={(event) => setSelectedPlan(event.target.value)}
              className="sr-only"
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  {getLocalizedPlanName(plan, language)}
                </h3>
                <p className="mt-1 text-xs font-black uppercase text-slate-500">
                  {getLocalizedPlanDuration(plan, language)} |{" "}
                  {getLocalizedApprovalTime(plan, language)}
                </p>
              </div>
              <p className="font-black text-blue-700">
                {formatManualAmount(plan.price)}
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-sm leading-5 text-slate-700">
              {getLocalizedPlanFeatures(plan, language)
                .slice(0, 4)
                .map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
            </ul>
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
          checked={includeFeatured}
          onChange={(event) => setIncludeFeatured(event.target.checked)}
          disabled={!canAddFeatured}
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span>
          <span className="block font-black text-slate-950">
            {t(language, "addFeaturedPlacement")} -{" "}
            {formatManualAmount(FEATURED_ADDON_PLAN.price)}
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            {t(language, "featuredPlacementText")}
          </span>
        </span>
      </label>

      <div className="mt-6 rounded-2xl border bg-slate-50 p-5">
        <p className="text-sm font-black uppercase text-slate-500">
          {t(language, "totalPayable")}
        </p>
        <p className="mt-1 text-3xl font-black text-red-700">
          {formatManualAmount(total.amount)}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {t(language, "renewUpgrade")}:{" "}
          {getLocalizedPlanName(selectedPlanMeta, language)}
          {includeFeatured ? " + Featured Add-on" : ""}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="rounded-3xl border-2 border-slate-900 bg-slate-50 p-4 text-center">
          <img
            src={MANUAL_UPI_CONFIG.qrImagePath}
            alt="My Classifieds UPI QR code"
            className="mx-auto w-full max-w-[250px] rounded-2xl border bg-white p-2"
          />
          <p className="mt-3 text-sm font-bold">
            {t(language, "upiId")}:{" "}
            <span className="font-black">{MANUAL_UPI_CONFIG.vpa}</span>
          </p>
          <a
            href={upiUrl}
            className="mt-4 flex justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-green-700"
          >
            {t(language, "openUpiApp")}
          </a>
        </div>

        <div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-700">
                {t(language, "payerName")}
              </label>
              <input
                value={payerName}
                onChange={(event) => setPayerName(event.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                {t(language, "payerMobile")}
              </label>
              <input
                value={payerMobile}
                onChange={(event) => setPayerMobile(event.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-bold text-slate-700">
              {t(language, "utrReference")}
            </label>
            <input
              value={transactionReference}
              onChange={(event) => setTransactionReference(event.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              required
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-bold text-slate-700">
              {t(language, "optionalPaymentNote")}
            </label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 min-h-20 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          {message}
          {manualReferenceNumber && (
            <p className="mt-2 font-black">Reference: {manualReferenceNumber}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-red-600 px-6 py-4 font-black uppercase text-white hover:bg-red-700 disabled:opacity-60"
      >
        {isSubmitting ? t(language, "submitting") : t(language, "submitRenewalReference")}
      </button>
    </form>
  );
}
