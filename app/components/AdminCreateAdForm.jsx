"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PLAN_FEATURES, BUSINESS_ANNUAL_PLAN_KEY, formatPlanAmount } from "../lib/planFeatures";

const planOptions = [
  { key: "FREE_7_DAYS", label: "Free", defaultDays: 7 },
  { key: "PAID_7_DAYS", label: "Paid", defaultDays: 7 },
  { key: "PREMIUM_30_DAYS", label: "Premium", defaultDays: 30 },
  { key: "FEATURED_10_DAYS", label: "Featured Add-on / Admin Featured", defaultDays: 10 },
  { key: BUSINESS_ANNUAL_PLAN_KEY, label: "Business Annual - Default Featured", defaultDays: 365 }
];

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  whatsapp: "",
  title: "",
  description: "",
  price: "",
  address: "",
  categoryId: "",
  cityId: "",
  status: "ACTIVE",
  planKey: "FREE_7_DAYS",
  durationDays: "7",
  expiresAt: "",
  featuredDays: "10",
  featuredUntil: ""
};

export default function AdminCreateAdForm({ categories = [], cities = [] }) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPlan = PLAN_FEATURES[form.planKey] || PLAN_FEATURES.FREE_7_DAYS;
  const selectedPlanOption = planOptions.find((item) => item.key === form.planKey) || planOptions[0];

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "planKey") {
        const option = planOptions.find((item) => item.key === value) || planOptions[0];
        next.durationDays = String(option.defaultDays);
        if (value === BUSINESS_ANNUAL_PLAN_KEY) next.featuredDays = String(option.defaultDays);
      }
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create ad.");
        return;
      }

      setSuccess(`Created ad #${data.ad?.id || ""}: ${data.ad?.title || ""}`);
      setForm(initialForm);
      router.refresh();
    } catch (submitError) {
      console.error("Admin create ad failed:", submitError);
      setError("Something went wrong while creating the ad.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-sm md:p-6">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">{success}</div>}

      <section>
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">Advertiser Details</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">
            Name
            <input name="name" value={form.name} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" required />
          </label>
          <label className="text-sm font-bold text-slate-700">
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" />
          </label>
          <label className="text-sm font-bold text-slate-700">
            Mobile
            <input name="mobile" value={form.mobile} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" maxLength={10} required />
          </label>
          <label className="text-sm font-bold text-slate-700">
            WhatsApp
            <input name="whatsapp" value={form.whatsapp} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" maxLength={10} />
          </label>
        </div>
      </section>

      <section>
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">Ad Content</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">
            Category
            <select name="categoryId" value={form.categoryId} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" required>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.nameEn}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-700">
            City
            <select name="cityId" value={form.cityId} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" required>
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">
            Heading
            <input name="title" value={form.title} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" required />
          </label>
          <label className="text-sm font-bold text-slate-700">
            Price / Fee / Salary
            <input name="price" value={form.price} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" />
          </label>
          <label className="text-sm font-bold text-slate-700">
            Area / Address
            <input name="address" value={form.address} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" />
          </label>
        </div>
        <label className="mt-4 block text-sm font-bold text-slate-700">
          Description
          <textarea name="description" value={form.description} onChange={updateField} className="mt-2 min-h-40 w-full rounded-xl border px-4 py-3" required />
        </label>
      </section>

      <section className="rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">Admin Visibility Controls</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm font-bold text-slate-700">
            Status
            <select name="status" value={form.status} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3">
              <option value="ACTIVE">Active now</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </label>
          <label className="text-sm font-bold text-slate-700">
            Plan / Promotion
            <select name="planKey" value={form.planKey} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3">
              {planOptions.map((plan) => (
                <option key={plan.key} value={plan.key}>{plan.label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-700">
            Show for days
            <input name="durationDays" value={form.durationDays} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" inputMode="numeric" />
          </label>
          <label className="text-sm font-bold text-slate-700">
            Or exact expiry date
            <input name="expiresAt" type="date" value={form.expiresAt} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" />
          </label>
          <label className="text-sm font-bold text-slate-700">
            Featured days
            <input name="featuredDays" value={form.featuredDays} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" inputMode="numeric" />
          </label>
          <label className="text-sm font-bold text-slate-700">
            Or exact featured-until date
            <input name="featuredUntil" type="date" value={form.featuredUntil} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3" />
          </label>
        </div>
        <p className="mt-4 rounded-xl bg-white p-3 text-sm leading-6 text-slate-600">
          Selected: <strong>{selectedPlanOption.label}</strong> | Public price: <strong>{formatPlanAmount(selectedPlan.price)}</strong>
          {selectedPlan.oldPrice ? <span> instead of {formatPlanAmount(selectedPlan.oldPrice)}</span> : null}. Business Annual ads are featured by default but ranked after regular Featured add-on ads.
        </p>
      </section>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-blue-700 px-6 py-4 text-sm font-black uppercase text-white hover:bg-blue-800 disabled:opacity-60">
        {isSubmitting ? "Creating..." : "Create Ad as Admin"}
      </button>
    </form>
  );
}
