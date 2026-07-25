"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACTIVE_POLICY_VERSION,
  ADVERTISER_TYPES,
  POLICY_EFFECTIVE_DATE,
  POLICY_EFFECTIVE_DATE_LABEL,
  REQUIRED_POST_AD_DECLARATIONS,
  validatePostAdDeclarations
} from "../lib/compliance";
import {
  buildUpiPaymentUrl,
  FEATURED_ADDON,
  formatManualAmount,
  getPostAdSelection,
  MANUAL_UPI_CONFIG,
  POST_AD_BASE_PLANS
} from "../lib/manualPayment";

const initialForm = {
  name: "",
  mobile: "",
  whatsapp: "",
  advertiserType: "",
  categoryId: "",
  cityId: "",
  title: "",
  description: "",
  price: "",
  address: "",
  payerName: "",
  payerMobile: "",
  transactionReference: "",
  paymentNote: ""
};

const initialDeclarations = REQUIRED_POST_AD_DECLARATIONS.reduce(
  (result, declaration) => ({ ...result, [declaration.key]: false }),
  {}
);

export default function PostAdForm({ categories, cities }) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [basePlan, setBasePlan] = useState("FREE");
  const [includeFeatured, setIncludeFeatured] = useState(false);
  const [declarations, setDeclarations] = useState(initialDeclarations);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentSelection = useMemo(
    () => getPostAdSelection(basePlan, includeFeatured),
    [basePlan, includeFeatured]
  );

  const amountDue = paymentSelection?.amount || 0;

  const upiUrl = useMemo(
    () =>
      buildUpiPaymentUrl({
        amount: amountDue,
        adId: "",
        planKey: paymentSelection?.planKey || "FREE_7_DAYS",
        referenceNumber: "NEW-CLASSIFIED"
      }),
    [amountDue, paymentSelection]
  );

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateDeclaration(event) {
    const { name, checked } = event.target;
    setDeclarations((current) => ({ ...current, [name]: checked }));
  }

  function setAllDeclarations(checked) {
    setDeclarations(
      REQUIRED_POST_AD_DECLARATIONS.reduce(
        (result, declaration) => ({ ...result, [declaration.key]: checked }),
        {}
      )
    );
  }

  function selectBasePlan(planKey) {
    setBasePlan(planKey);
    if (planKey === "FREE") setIncludeFeatured(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.advertiserType) {
      setError("Please select your advertiser type.");
      return;
    }

    if (!paymentSelection) {
      setError("Please select a valid classified plan.");
      return;
    }

    const declarationValidation = validatePostAdDeclarations(declarations);
    if (!declarationValidation.isValid) {
      setError("Please complete all mandatory declarations and policy acceptances before submitting the classified.");
      return;
    }

    if (amountDue > 0) {
      if (!form.payerName.trim()) {
        setError("Please enter the payer name used for UPI payment.");
        return;
      }
      if (form.payerMobile.replace(/\D/g, "").length !== 10) {
        setError("Please enter a valid 10 digit payer mobile number.");
        return;
      }
      if (form.transactionReference.trim().length < 6) {
        setError("Please enter the UPI transaction ID / UTR after making payment.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: [],
          basePlan,
          includeFeatured,
          declarations,
          policyVersion: ACTIVE_POLICY_VERSION,
          policyEffectiveDate: POLICY_EFFECTIVE_DATE
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to submit ad.");
        return;
      }

      const paymentQuery = data.requiresPaymentVerification ? "&payment=pending" : "&payment=free";
      router.push(`/post-ad/success?adId=${data.adId}${paymentQuery}`);
    } catch (submitError) {
      console.error("Submit ad failed:", submitError);
      setError("Something went wrong. Please try again.");
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

      <section className="rounded-2xl border-2 border-slate-900 bg-white p-5">
        <p className="text-sm font-black uppercase tracking-wide text-red-600">Step 1</p>
        <h2 className="mt-1 text-2xl font-black uppercase text-slate-950">Choose Your Classified Plan</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Choose Free, Paid or Premium before submitting the classified. Paid plans require UPI payment reference submission before the ad is sent for admin approval.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {POST_AD_BASE_PLANS.map((plan) => (
            <label key={plan.key} className={`cursor-pointer rounded-2xl border-2 p-5 ${basePlan === plan.key ? "border-blue-700 bg-blue-50" : "border-slate-200 bg-white"}`}>
              <input type="radio" name="basePlan" value={plan.key} checked={basePlan === plan.key} onChange={() => selectBasePlan(plan.key)} className="sr-only" />
              <h3 className="text-lg font-black text-slate-950">{plan.name}</h3>
              <p className="mt-2 text-3xl font-black text-red-600">{formatManualAmount(plan.amount)}</p>
              <p className="mt-1 text-xs font-black uppercase text-slate-500">GST inclusive | Valid for {plan.duration}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
            </label>
          ))}
        </div>

        {basePlan !== "FREE" && (
          <label className={`mt-5 flex cursor-pointer gap-4 rounded-2xl border-2 p-5 ${includeFeatured ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white"}`}>
            <input type="checkbox" checked={includeFeatured} onChange={(event) => setIncludeFeatured(event.target.checked)} className="mt-1 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">Add Featured Highlight</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{FEATURED_ADDON.description}</p>
                </div>
                <p className="text-xl font-black text-orange-600">+ {formatManualAmount(FEATURED_ADDON.amount)}</p>
              </div>
            </div>
          </label>
        )}

        <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
          <p className="text-sm font-black uppercase tracking-wide text-slate-300">Total Payable</p>
          <p className="mt-1 text-4xl font-black">{formatManualAmount(amountDue)}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {amountDue === 0 ? "No payment required. The classified will be submitted for admin approval." : "Pay this amount by UPI, then submit the transaction ID / UTR below."}
          </p>
        </div>
      </section>

      {amountDue > 0 && (
        <section className="rounded-2xl border-2 border-blue-700 bg-white p-5">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">Step 2</p>
          <h2 className="mt-1 text-2xl font-black uppercase text-slate-950">Pay by UPI Before Submitting</h2>

          <div className="mt-5 grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="rounded-3xl border bg-slate-50 p-4 text-center">
              <img src={MANUAL_UPI_CONFIG.qrImagePath} alt="My Classifieds UPI QR code" className="mx-auto w-full max-w-[260px] rounded-2xl border bg-white p-2" />
              <p className="mt-3 text-sm font-bold text-slate-700">UPI ID: <span className="font-black text-slate-950">{MANUAL_UPI_CONFIG.vpa}</span></p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Payee: {MANUAL_UPI_CONFIG.displayPayeeName}</p>
              <a href={upiUrl} className="mt-4 flex justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black uppercase text-white hover:bg-green-700">Open UPI App</a>
            </div>

            <div>
              <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                Pay exactly <span className="font-black">{formatManualAmount(amountDue)}</span> to the company UPI ID. After payment, enter the UPI transaction ID / UTR below. Your ad will be submitted only after this reference is entered.
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-700">Payer Name</label>
                  <input name="payerName" value={form.payerName} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Name used in UPI payment" required={amountDue > 0} />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700">Payer Mobile</label>
                  <input name="payerMobile" value={form.payerMobile} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="10 digit mobile" inputMode="numeric" maxLength={10} required={amountDue > 0} />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-bold text-slate-700">UPI Transaction ID / UTR / Bank Reference</label>
                <input name="transactionReference" value={form.transactionReference} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Example: 412345678901" required={amountDue > 0} />
              </div>

              <div className="mt-4">
                <label className="text-sm font-bold text-slate-700">Optional Payment Note</label>
                <textarea name="paymentNote" value={form.paymentNote} onChange={updateField} className="mt-2 min-h-20 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Payment time, UPI app name, screenshot reference, etc." />
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm font-black uppercase tracking-wide text-blue-800">Policy Version {ACTIVE_POLICY_VERSION}</p>
        <p className="mt-2 text-sm leading-6 text-blue-900">By submitting a classified, you accept the current My Classifieds legal terms effective from {POLICY_EFFECTIVE_DATE_LABEL}. Your acceptance will be stored with the advertisement record.</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/legal/terms" target="_blank" className="text-blue-800 underline">Terms</Link>
          <Link href="/legal/privacy" target="_blank" className="text-blue-800 underline">Privacy</Link>
          <Link href="/legal/refunds" target="_blank" className="text-blue-800 underline">Refunds</Link>
          <Link href="/legal/listing-rules" target="_blank" className="text-blue-800 underline">Listing Rules</Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="text-sm font-bold text-slate-700">Your Name</label><input name="name" value={form.name} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Enter your name" required /></div>
        <div><label className="text-sm font-bold text-slate-700">Mobile Number</label><input name="mobile" value={form.mobile} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="10 digit mobile number" maxLength={10} required /></div>
        <div><label className="text-sm font-bold text-slate-700">WhatsApp Number</label><input name="whatsapp" value={form.whatsapp} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Leave blank if same as mobile" maxLength={10} /></div>
        <div>
          <label className="text-sm font-bold text-slate-700">Advertiser Type</label>
          <select name="advertiserType" value={form.advertiserType} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" required>
            <option value="">Select advertiser type</option>
            {ADVERTISER_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </div>
        <div><label className="text-sm font-bold text-slate-700">Price</label><input name="price" value={form.price} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Example: 25000" inputMode="numeric" /></div>
        <div>
          <label className="text-sm font-bold text-slate-700">Category</label>
          <select name="categoryId" value={form.categoryId} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" required>
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.nameEn} / {category.nameMr}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700">City</label>
          <select name="cityId" value={form.cityId} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" required>
            <option value="">Select city</option>
            {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
          </select>
        </div>
      </div>

      <div><label className="text-sm font-bold text-slate-700">Ad Title</label><input name="title" value={form.title} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Example: 2 BHK flat for sale in Baramati" required /></div>
      <div><label className="text-sm font-bold text-slate-700">Classified Text</label><textarea name="description" value={form.description} onChange={updateField} className="mt-2 min-h-32 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Write your classified ad text. Keep it short, clear and useful." required /></div>
      <div><label className="text-sm font-bold text-slate-700">Area / Location</label><input name="address" value={form.address} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Example: Baramati MIDC, Jalochi, Pune Road" /></div>

      <section className="rounded-2xl border-2 border-slate-900 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-black uppercase text-slate-950">Mandatory Declarations</h2><p className="mt-1 text-sm text-slate-600">Required before submitting your classified advertisement.</p></div>
          <button type="button" onClick={() => setAllDeclarations(true)} className="rounded-xl border px-4 py-2 text-xs font-black uppercase text-slate-700 hover:bg-slate-50">Select All</button>
        </div>
        <div className="mt-5 space-y-3">
          {REQUIRED_POST_AD_DECLARATIONS.map((declaration) => (
            <label key={declaration.key} className="flex gap-3 rounded-xl border bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-800">
              <input type="checkbox" name={declaration.key} checked={declarations[declaration.key]} onChange={updateDeclaration} className="mt-1 h-4 w-4 shrink-0" required />
              <span>{declaration.label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="rounded-2xl bg-yellow-50 p-5 text-sm text-yellow-900">Your classified will be reviewed before publication. Payment, if any, does not guarantee approval of illegal, misleading, fraudulent or prohibited advertisements.</div>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-red-600 px-6 py-4 font-black uppercase text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? "Submitting..." : amountDue > 0 ? "Submit Ad and Payment Reference" : "Submit Free Classified for Approval"}
      </button>
    </form>
  );
}
