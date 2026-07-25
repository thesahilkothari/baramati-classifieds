"use client";

import Link from "next/link";
import { useState } from "react";

const TEXT = {
  en: {
    title: "Request Ad Correction / Update",
    intro:
      "For privacy, enter both the posting mobile number and posting email address. Admin will review before making changes.",
    adId: "Ad ID",
    mobile: "Posting Mobile Number",
    email: "Posting Email Address",
    contactName: "Your Name",
    requestType: "Update Type",
    selectRequestType: "Select update type",
    details: "Required Correction / Update",
    detailsPlaceholder:
      "Write exactly what should be corrected. Example: Please change price from Rs. 50,000 to Rs. 45,000.",
    submit: "Submit Edit Request",
    submitting: "Submitting...",
    backMyAds: "Back to My Ads",
    success: "Edit request submitted.",
    reference: "Reference",
    whatsapp: "Ask on WhatsApp",
    note:
      "For safety and audit reasons, user-submitted ads are not edited instantly. All changes are reviewed by admin."
  },
  mr: {
    title: "जाहिरात Correction / Update Request",
    intro:
      "Privacy साठी posting mobile number आणि posting email address दोन्ही भरा. Admin review नंतरच बदल केले जातील.",
    adId: "Ad ID",
    mobile: "पोस्टिंग मोबाईल नंबर",
    email: "पोस्टिंग ईमेल पत्ता",
    contactName: "आपले नाव",
    requestType: "Update Type",
    selectRequestType: "Update type निवडा",
    details: "आवश्यक Correction / Update",
    detailsPlaceholder:
      "नेमका कोणता बदल करायचा आहे ते लिहा. उदा. किंमत Rs. 50,000 ऐवजी Rs. 45,000 करा.",
    submit: "Edit Request सबमिट करा",
    submitting: "सबमिट होत आहे...",
    backMyAds: "My Ads वर परत जा",
    success: "Edit request सबमिट झाली.",
    reference: "Reference",
    whatsapp: "WhatsApp वर विचारा",
    note:
      "Safety आणि audit साठी user-submitted ads मध्ये instant edit होत नाही. सर्व changes admin review नंतर केले जातात."
  }
};

const requestTypes = [
  { value: "TITLE", en: "Ad heading/title correction", mr: "Ad heading/title correction" },
  { value: "DESCRIPTION", en: "Ad description correction", mr: "Ad description correction" },
  { value: "PRICE", en: "Price correction", mr: "किंमत correction" },
  { value: "CONTACT", en: "Contact detail correction", mr: "Contact detail correction" },
  { value: "LOCATION", en: "Location/address correction", mr: "Location/address correction" },
  { value: "CATEGORY", en: "Category correction", mr: "Category correction" },
  { value: "OTHER", en: "Other correction/update", mr: "Other correction/update" }
];

function cleanMobile(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 180);
}

function buildWhatsAppUrl(referenceNumber, adId) {
  const message = `Hello My Classifieds, I submitted an ad edit request.

Reference: ${referenceNumber}
Ad ID: ${adId}`;

  return `https://wa.me/919673931166?text=${encodeURIComponent(message)}`;
}

export default function EditRequestForm({
  initialAdId = "",
  initialMobile = "",
  initialEmail = "",
  initialLanguage = "en"
}) {
  const language = initialLanguage === "mr" ? "mr" : "en";
  const text = TEXT[language];

  const [form, setForm] = useState({
    adId: initialAdId,
    mobile: cleanMobile(initialMobile),
    email: cleanEmail(initialEmail),
    contactName: "",
    requestType: "",
    details: ""
  });
  const [error, setError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "mobile"
          ? cleanMobile(value)
          : name === "email"
            ? cleanEmail(value)
            : value
    }));
  }

  async function submitRequest(event) {
    event.preventDefault();

    setError("");
    setReferenceNumber("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/edit-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          contactEmail: form.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to submit edit request.");
        return;
      }

      setReferenceNumber(data.referenceNumber);
      setForm((current) => ({
        ...current,
        details: "",
        requestType: ""
      }));
    } catch (submitError) {
      console.error("Edit request submit failed:", submitError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-sm md:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-blue-700">
          My Classifieds
        </p>

        <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-slate-950 md:text-5xl">
          {text.title}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
          {text.intro}
        </p>

        <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-semibold leading-6 text-yellow-900">
          {text.note}
        </div>
      </section>

      <form onSubmit={submitRequest} className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {referenceNumber && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
            <p>{text.success}</p>
            <p className="mt-2 font-black">
              {text.reference}: {referenceNumber}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/my-ads?mobile=${form.mobile}&email=${encodeURIComponent(form.email)}`}
                className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-black uppercase text-white"
              >
                {text.backMyAds}
              </Link>

              <a
                href={buildWhatsAppUrl(referenceNumber, form.adId)}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-green-600 px-4 py-2 text-xs font-black uppercase text-white"
              >
                {text.whatsapp}
              </a>
            </div>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-slate-700">
              {text.adId}
            </label>
            <input
              name="adId"
              value={form.adId}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              placeholder="25"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {text.mobile}
            </label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              placeholder="9876543210"
              inputMode="numeric"
              maxLength={10}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {text.email}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              {text.contactName}
            </label>
            <input
              name="contactName"
              value={form.contactName}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-bold text-slate-700">
            {text.requestType}
          </label>
          <select
            name="requestType"
            value={form.requestType}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            required
          >
            <option value="">{text.selectRequestType}</option>
            {requestTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {language === "mr" ? item.mr : item.en}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label className="text-sm font-bold text-slate-700">
            {text.details}
          </label>
          <textarea
            name="details"
            value={form.details}
            onChange={updateField}
            className="mt-2 min-h-40 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder={text.detailsPlaceholder}
            required
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-red-600 px-6 py-4 text-sm font-black uppercase text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting ? text.submitting : text.submit}
          </button>

          <Link
            href={`/my-ads?mobile=${form.mobile}&email=${encodeURIComponent(form.email)}`}
            className="rounded-xl border px-6 py-4 text-center text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
          >
            {text.backMyAds}
          </Link>
        </div>
      </form>
    </div>
  );
}
