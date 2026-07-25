"use client";

import { useMemo, useState } from "react";
import {
  buildUpiPaymentUrl,
  formatManualAmount,
  MANUAL_PAYMENT_PLANS,
  MANUAL_UPI_CONFIG
} from "../lib/manualPayment";

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

  const plan = useMemo(
    () =>
      MANUAL_PAYMENT_PLANS.find((item) => item.key === selectedPlan) ||
      MANUAL_PAYMENT_PLANS[0],
    [selectedPlan]
  );

  const upiUrl = useMemo(
    () =>
      buildUpiPaymentUrl({
        amount: plan.price,
        adId,
        planKey: selectedPlan,
        referenceNumber: `AD-${adId || ""}`
      }),
    [adId, plan.price, selectedPlan]
  );

  async function submitPaymentReference(event) {
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
          adId,
          plan: selectedPlan,
          payerName,
          payerMobile,
          transactionReference,
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
        "Payment reference submitted. Your plan will be applied after admin verification."
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
    <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-black uppercase tracking-wide text-blue-700">
        Promote Your Classified
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-900">
        Pay by UPI and submit reference
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your classified has been submitted for admin approval. Choose a paid
        plan, pay using UPI, then submit the UPI transaction ID / UTR for manual
        verification.
      </p>

      <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-yellow-900">
        Prices are GST inclusive. Payment will be verified manually from the
        company bank/UPI statement before the selected plan is applied.
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {MANUAL_PAYMENT_PLANS.map((item) => (
          <label
            key={item.key}
            className={`cursor-pointer rounded-2xl border-2 p-5 ${
              selectedPlan === item.key
                ? "border-blue-700 bg-blue-50"
                : "border-slate-200 bg-white"
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
                <h3 className="text-lg font-black text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs font-black uppercase text-slate-500">
                  Valid for {item.duration}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>

              <p className="shrink-0 text-xl font-black text-blue-700">
                {formatManualAmount(item.price)}
              </p>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="rounded-3xl border-2 border-slate-900 bg-slate-50 p-4 text-center">
          <p className="text-xs font-black uppercase text-slate-500">
            Scan and Pay
          </p>

          <img
            src={MANUAL_UPI_CONFIG.qrImagePath}
            alt="My Classifieds UPI QR code"
            className="mx-auto mt-3 w-full max-w-[280px] rounded-2xl border bg-white p-2"
          />

          <p className="mt-3 text-sm font-bold text-slate-700">
            UPI ID:{" "}
            <span className="font-black text-slate-950">
              {MANUAL_UPI_CONFIG.vpa}
            </span>
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Payee: {MANUAL_UPI_CONFIG.payeeName}
          </p>

          <a
            href={upiUrl}
            className="mt-4 flex justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-green-700"
          >
            Open UPI App
          </a>
        </div>

        <form
          onSubmit={submitPaymentReference}
          className="rounded-3xl border bg-white p-5"
        >
          <h3 className="text-xl font-black uppercase text-slate-950">
            Submit Payment Reference
          </h3>

          <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            Pay exactly{" "}
            <span className="font-black">{formatManualAmount(plan.price)}</span>{" "}
            for <span className="font-black">{plan.name}</span>. Mention{" "}
            <span className="font-black">Ad ID {adId}</span> in the UPI note if
            your UPI app allows it.
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Payer Name
              </label>
              <input
                value={payerName}
                onChange={(event) => setPayerName(event.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
                placeholder="Name used in UPI payment"
                required
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Payer Mobile
              </label>
              <input
                value={payerMobile}
                onChange={(event) => setPayerMobile(event.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
                placeholder="10 digit mobile"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-bold text-slate-700">
              UPI Transaction ID / UTR / Bank Reference
            </label>
            <input
              value={transactionReference}
              onChange={(event) => setTransactionReference(event.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              placeholder="Example: 412345678901"
              required
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-bold text-slate-700">
              Optional Note
            </label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 min-h-20 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
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
                <p className="mt-2 font-black">
                  Reference: {manualReferenceNumber}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-xl bg-blue-700 px-6 py-4 font-black uppercase text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Payment Reference"}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Payment does not guarantee approval of prohibited, misleading,
        fraudulent or illegal advertisements.
      </p>
    </section>
  );
}
