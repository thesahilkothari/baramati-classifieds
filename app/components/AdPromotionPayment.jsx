"use client";

import { useMemo, useState } from "react";
import {
  buildCheckoutReference,
  buildUpiPaymentUrl,
  formatManualAmount,
  MANUAL_PAYMENT_PLANS,
  MANUAL_UPI_CONFIG
} from "../lib/manualPayment";
import {
  getPaymentReferenceValidation,
  normalizePaymentReference
} from "../lib/paymentReference";

export default function AdPromotionPayment({ adId }) {
  const [selectedPlan, setSelectedPlan] = useState("PAID_7_DAYS");
  const [payerName, setPayerName] = useState("");
  const [payerMobile, setPayerMobile] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [manualReferenceNumber, setManualReferenceNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const plan = useMemo(
    () =>
      MANUAL_PAYMENT_PLANS.find((item) => item.key === selectedPlan) ||
      MANUAL_PAYMENT_PLANS[0],
    [selectedPlan]
  );

  const checkoutReference = useMemo(
    () => buildCheckoutReference({ adId, planKey: selectedPlan }),
    [adId, selectedPlan]
  );

  const upiUrl = useMemo(
    () =>
      buildUpiPaymentUrl({
        amount: plan.price,
        adId,
        planKey: selectedPlan,
        referenceNumber: checkoutReference
      }),
    [adId, checkoutReference, plan.price, selectedPlan]
  );

  const referenceValidation = useMemo(
    () => getPaymentReferenceValidation(transactionReference),
    [transactionReference]
  );

  async function copyToClipboard(value, label) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedText(label);
      window.setTimeout(() => setCopiedText(""), 1800);
    } catch {
      setCopiedText("");
    }
  }

  async function submitPaymentReference(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setManualReferenceNumber("");

    const validation = getPaymentReferenceValidation(transactionReference);

    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payment/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adId,
          plan: selectedPlan,
          payerName,
          payerMobile,
          transactionReference: validation.reference,
          checkoutReference,
          note
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to submit payment reference.");
        return;
      }

      setManualReferenceNumber(data.manualReferenceNumber);
      setMessage(
        data.status === "PAID"
          ? "Payment matched automatically. Your selected plan has been applied."
          : "Payment reference submitted. The system will auto-match it if a bank credit webhook is available; otherwise admin verification will be completed from the bank statement."
      );
      setTransactionReference("");
      setNote("");
    } catch (paymentError) {
      console.error("Manual payment submission failed:", paymentError);
      setError("Payment reference could not be submitted. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-black uppercase tracking-wide text-[#0F766E]">
        Easy UPI Checkout
      </p>

      <h2 className="mt-2 text-2xl font-black text-[#0F172A]">
        Pay by UPI and validate through UTR
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#475569]">
        Choose a paid plan, open your UPI app with the amount and note pre-filled,
        complete the payment, then paste the UPI transaction ID / UTR. Duplicate
        and invalid references are blocked automatically.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4">
          <p className="text-xs font-black uppercase text-[#0F3D5E]">Step 1</p>
          <p className="mt-1 text-sm font-bold text-[#0F172A]">Select Plan</p>
        </div>
        <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4">
          <p className="text-xs font-black uppercase text-[#0F3D5E]">Step 2</p>
          <p className="mt-1 text-sm font-bold text-[#0F172A]">Pay in UPI App</p>
        </div>
        <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4">
          <p className="text-xs font-black uppercase text-[#0F3D5E]">Step 3</p>
          <p className="mt-1 text-sm font-bold text-[#0F172A]">Submit UTR</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Prices are GST inclusive. Where bank webhook access is configured, matching
        UTR payments can be verified automatically. Until then, the same UTR flow
        creates a faster admin-verification queue from the bank statement.
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {MANUAL_PAYMENT_PLANS.map((item) => (
          <label
            key={item.key}
            className={`cursor-pointer rounded-2xl border-2 p-5 ${
              selectedPlan === item.key
                ? "border-[#0F3D5E] bg-blue-50"
                : "border-[#CBD5E1] bg-white"
            }`}
          >
            <input
              type="radio"
              name="promotionPlan"
              value={item.key}
              checked={selectedPlan === item.key}
              onChange={() => setSelectedPlan(item.key)}
              className="sr-only"
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#0F172A]">{item.name}</h3>
                <p className="mt-1 text-xs font-black uppercase text-[#475569]">
                  Valid for {item.duration}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#475569]">
                  {item.description}
                </p>
              </div>

              <p className="shrink-0 text-xl font-black text-[#0F3D5E]">
                {formatManualAmount(item.price)}
              </p>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="rounded-3xl border-2 border-[#0F3D5E] bg-[#F8FAFC] p-4 text-center">
          <p className="text-xs font-black uppercase text-[#475569]">
            Scan or Open UPI
          </p>

          <img
            src={MANUAL_UPI_CONFIG.qrImagePath}
            alt="My Classifieds UPI QR code"
            className="mx-auto mt-3 w-full max-w-[280px] rounded-2xl border bg-white p-2"
          />

          <p className="mt-3 text-sm font-bold text-[#475569]">
            UPI ID:{" "}
            <span className="font-black text-[#0F172A]">
              {MANUAL_UPI_CONFIG.vpa}
            </span>
          </p>

          <p className="mt-1 text-xs leading-5 text-[#475569]">
            Payee: {MANUAL_UPI_CONFIG.payeeName}
          </p>

          <div className="mt-3 rounded-2xl bg-white p-3 text-left text-xs leading-5 text-[#475569]">
            <p className="font-black uppercase text-[#0F3D5E]">Checkout note</p>
            <p className="mt-1 break-all font-mono text-[#0F172A]">
              {checkoutReference}
            </p>
            <button
              type="button"
              onClick={() => copyToClipboard(checkoutReference, "reference")}
              className="mt-2 rounded-lg border border-[#CBD5E1] px-3 py-1 font-black uppercase text-[#0F3D5E]"
            >
              {copiedText === "reference" ? "Copied" : "Copy Reference"}
            </button>
          </div>

          <a
            href={upiUrl}
            className="mt-4 flex justify-center rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-black uppercase text-white hover:bg-teal-800"
          >
            Open UPI App
          </a>
        </div>

        <form
          onSubmit={submitPaymentReference}
          className="rounded-3xl border border-[#CBD5E1] bg-white p-5"
        >
          <h3 className="text-xl font-black uppercase text-[#0F172A]">
            Submit UPI UTR
          </h3>

          <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            Pay exactly{" "}
            <span className="font-black">{formatManualAmount(plan.price)}</span>{" "}
            for <span className="font-black">{plan.name}</span>. Keep the UPI
            app receipt open and paste the transaction ID / UTR below.
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-[#475569]">
                Payer Name
              </label>
              <input
                value={payerName}
                onChange={(event) => setPayerName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#64748B] px-4 py-3 outline-none focus:border-[#0F766E]"
                placeholder="Name used in UPI payment"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#475569]">
                Payer Mobile
              </label>
              <input
                value={payerMobile}
                onChange={(event) => setPayerMobile(event.target.value.replace(/\D/g, ""))}
                className="mt-2 w-full rounded-xl border border-[#64748B] px-4 py-3 outline-none focus:border-[#0F766E]"
                placeholder="10 digit mobile"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-bold text-[#475569]">
              UPI Transaction ID / UTR / Bank Reference
            </label>
            <input
              value={transactionReference}
              onChange={(event) =>
                setTransactionReference(normalizePaymentReference(event.target.value))
              }
              className="mt-2 w-full rounded-xl border border-[#64748B] px-4 py-3 font-mono text-sm outline-none focus:border-[#0F766E]"
              placeholder="Example: 412345678901"
              required
            />
            {transactionReference && (
              <p
                className={`mt-2 text-xs font-bold ${
                  referenceValidation.ok ? "text-[#0F766E]" : "text-red-700"
                }`}
              >
                {referenceValidation.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="text-sm font-bold text-[#475569]">
              Optional Note
            </label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 min-h-20 w-full rounded-xl border border-[#64748B] px-4 py-3 outline-none focus:border-[#0F766E]"
              placeholder="Optional: payment time, UPI app name, screenshot note, etc."
            />
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              {message}
              {manualReferenceNumber && (
                <p className="mt-2 font-black">Reference: {manualReferenceNumber}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-xl bg-[#0F3D5E] px-6 py-4 font-black uppercase text-white hover:bg-[#0B2F49] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Validating..." : "Submit UTR for Verification"}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-[#475569]">
        Payment does not guarantee approval of prohibited, misleading, fraudulent
        or illegal advertisements.
      </p>
    </section>
  );
}
