"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACTIVE_POLICY_VERSION,
  ADVERTISER_TYPES,
  POLICY_EFFECTIVE_DATE,
  POLICY_EFFECTIVE_DATE_LABEL,
  REQUIRED_POST_AD_DECLARATIONS,
  validatePostAdDeclarations
} from "../lib/compliance";

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
  address: ""
};

const initialDeclarations = REQUIRED_POST_AD_DECLARATIONS.reduce(
  (result, declaration) => ({
    ...result,
    [declaration.key]: false
  }),
  {}
);

export default function PostAdForm({ categories, cities }) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [declarations, setDeclarations] = useState(initialDeclarations);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function updateDeclaration(event) {
    const { name, checked } = event.target;

    setDeclarations((current) => ({
      ...current,
      [name]: checked
    }));
  }

  function setAllDeclarations(checked) {
    setDeclarations(
      REQUIRED_POST_AD_DECLARATIONS.reduce(
        (result, declaration) => ({
          ...result,
          [declaration.key]: checked
        }),
        {}
      )
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.advertiserType) {
      setError("Please select your advertiser type.");
      return;
    }

    const declarationValidation = validatePostAdDeclarations(declarations);

    if (!declarationValidation.isValid) {
      setError(
        "Please complete all mandatory declarations and policy acceptances before submitting the classified."
      );
      return;
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

      router.push(`/post-ad/success?adId=${data.adId}`);
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

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm font-black uppercase tracking-wide text-blue-800">
          Policy Version {ACTIVE_POLICY_VERSION}
        </p>

        <p className="mt-2 text-sm leading-6 text-blue-900">
          By submitting a classified, you must accept the current My Classifieds
          legal terms effective from {POLICY_EFFECTIVE_DATE_LABEL}. Your
          acceptance will be stored with the advertisement record for compliance
          and dispute handling.
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/legal/terms" target="_blank" className="text-blue-800 underline">
            Terms
          </Link>
          <Link href="/legal/privacy" target="_blank" className="text-blue-800 underline">
            Privacy
          </Link>
          <Link href="/legal/refunds" target="_blank" className="text-blue-800 underline">
            Refunds
          </Link>
          <Link
            href="/legal/listing-rules"
            target="_blank"
            className="text-blue-800 underline"
          >
            Listing Rules
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-slate-700">Your Name</label>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">
            Mobile Number
          </label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="10 digit mobile number"
            maxLength={10}
            required
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">
            WhatsApp Number
          </label>
          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="Leave blank if same as mobile"
            maxLength={10}
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">
            Advertiser Type
          </label>
          <select
            name="advertiserType"
            value={form.advertiserType}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            required
          >
            <option value="">Select advertiser type</option>
            {ADVERTISER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">Price</label>
          <input
            name="price"
            value={form.price}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="Example: 25000"
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameEn} / {category.nameMr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">City</label>
          <select
            name="cityId"
            value={form.cityId}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            required
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Ad Title</label>
        <input
          name="title"
          value={form.title}
          onChange={updateField}
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
          placeholder="Example: 2 BHK flat for sale in Baramati"
          required
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Classified Text
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          className="mt-2 min-h-32 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
          placeholder="Write your classified ad text. Keep it short, clear and useful."
          required
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Area / Location
        </label>
        <input
          name="address"
          value={form.address}
          onChange={updateField}
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
          placeholder="Example: Baramati MIDC, Jalochi, Pune Road"
        />
      </div>

      <section className="rounded-2xl border-2 border-slate-900 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black uppercase text-slate-950">
              Mandatory Declarations
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Required before submitting your classified advertisement.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAllDeclarations(true)}
            className="rounded-xl border px-4 py-2 text-xs font-black uppercase text-slate-700 hover:bg-slate-50"
          >
            Select All
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {REQUIRED_POST_AD_DECLARATIONS.map((declaration) => (
            <label
              key={declaration.key}
              className="flex gap-3 rounded-xl border bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-800"
            >
              <input
                type="checkbox"
                name={declaration.key}
                checked={declarations[declaration.key]}
                onChange={updateDeclaration}
                className="mt-1 h-4 w-4 shrink-0"
                required
              />
              <span>{declaration.label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="rounded-2xl bg-yellow-50 p-5 text-sm text-yellow-900">
        Your classified will be reviewed before publication. Keep the text
        genuine, short and clear like a newspaper classified ad. Payment, if any,
        does not guarantee approval of prohibited or misleading content.
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-red-600 px-6 py-4 font-black uppercase text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Classified for Approval"}
      </button>
    </form>
  );
}
