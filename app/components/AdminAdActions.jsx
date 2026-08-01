"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUSINESS_ANNUAL_PLAN_KEY } from "../lib/planFeatures";

const planOptions = [
  { key: "", label: "No plan change" },
  { key: "FREE_7_DAYS", label: "Free" },
  { key: "PAID_7_DAYS", label: "Paid" },
  { key: "PREMIUM_30_DAYS", label: "Premium" },
  { key: "FEATURED_10_DAYS", label: "Featured Add-on / Admin Featured" },
  { key: BUSINESS_ANNUAL_PLAN_KEY, label: "Business Annual - Featured by default" }
];

export default function AdminAdActions({ adId, currentStatus }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [planForm, setPlanForm] = useState({
    planKey: "",
    durationDays: "",
    expiresAt: "",
    featuredDays: "",
    featuredUntil: ""
  });

  async function sendPatch(payload, confirmMessage) {
    const confirmed = window.confirm(confirmMessage || "Apply this admin update?");
    if (!confirmed) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/ads/${adId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to update ad.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Update ad failed:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function updateStatus(status) {
    sendPatch({ status }, `Change ad status to ${status}?`);
  }

  function updatePlanField(event) {
    const { name, value } = event.target;
    setPlanForm((current) => ({ ...current, [name]: value }));
  }

  function applyPlanUpdate(event) {
    event.preventDefault();

    const payload = {
      planKey: planForm.planKey || undefined,
      durationDays: planForm.durationDays || undefined,
      expiresAt: planForm.expiresAt || undefined,
      featuredDays: planForm.featuredDays || undefined,
      featuredUntil: planForm.featuredUntil || undefined
    };

    if (!payload.planKey && !payload.durationDays && !payload.expiresAt && !payload.featuredDays && !payload.featuredUntil) {
      alert("Select a plan or expiry value first.");
      return;
    }

    sendPatch(payload, "Apply plan / featured / expiry changes to this ad?");
  }

  function clearFeatured() {
    sendPatch({ clearFeatured: true }, "Remove featured placement from this ad?");
  }

  return (
    <div className="mt-5 space-y-4">
      <div className="flex flex-wrap gap-3">
        {currentStatus !== "ACTIVE" && (
          <button
            type="button"
            onClick={() => updateStatus("ACTIVE")}
            disabled={isLoading}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
          >
            Approve
          </button>
        )}

        {currentStatus !== "REJECTED" && (
          <button
            type="button"
            onClick={() => updateStatus("REJECTED")}
            disabled={isLoading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            Reject
          </button>
        )}

        {currentStatus !== "SOLD" && (
          <button
            type="button"
            onClick={() => updateStatus("SOLD")}
            disabled={isLoading}
            className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            Mark Sold
          </button>
        )}

        {currentStatus !== "PENDING" && (
          <button
            type="button"
            onClick={() => updateStatus("PENDING")}
            disabled={isLoading}
            className="rounded-xl border px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Move to Pending
          </button>
        )}
      </div>

      <form onSubmit={applyPlanUpdate} className="rounded-2xl border bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-slate-700">
          Admin Plan / Featured / Expiry Override
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="text-xs font-bold uppercase text-slate-600">
            Promote to
            <select
              name="planKey"
              value={planForm.planKey}
              onChange={updatePlanField}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm normal-case text-slate-800"
            >
              {planOptions.map((plan) => (
                <option key={plan.key || "none"} value={plan.key}>{plan.label}</option>
              ))}
            </select>
          </label>

          <label className="text-xs font-bold uppercase text-slate-600">
            Show for days
            <input
              name="durationDays"
              value={planForm.durationDays}
              onChange={updatePlanField}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm normal-case text-slate-800"
              inputMode="numeric"
              placeholder="e.g. 30"
            />
          </label>

          <label className="text-xs font-bold uppercase text-slate-600">
            Or expiry date
            <input
              type="date"
              name="expiresAt"
              value={planForm.expiresAt}
              onChange={updatePlanField}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm normal-case text-slate-800"
            />
          </label>

          <label className="text-xs font-bold uppercase text-slate-600">
            Featured days
            <input
              name="featuredDays"
              value={planForm.featuredDays}
              onChange={updatePlanField}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm normal-case text-slate-800"
              inputMode="numeric"
              placeholder="e.g. 10"
            />
          </label>

          <label className="text-xs font-bold uppercase text-slate-600">
            Featured until
            <input
              type="date"
              name="featuredUntil"
              value={planForm.featuredUntil}
              onChange={updatePlanField}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm normal-case text-slate-800"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-black uppercase text-white hover:bg-blue-800 disabled:opacity-60"
          >
            Apply Override
          </button>
          <button
            type="button"
            onClick={clearFeatured}
            disabled={isLoading}
            className="rounded-xl border px-4 py-2 text-xs font-black uppercase text-slate-700 hover:bg-white disabled:opacity-60"
          >
            Remove Featured
          </button>
        </div>
      </form>
    </div>
  );
}
