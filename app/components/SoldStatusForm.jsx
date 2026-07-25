"use client";

import Link from "next/link";
import { useState } from "react";

export default function SoldStatusForm({ initialAdId = "", initialMobile = "" }) {
  const [adId, setAdId] = useState(initialAdId);
  const [mobile, setMobile] = useState(initialMobile);
  const [soldStatus, setSoldStatus] = useState("AVAILABLE");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updatedAd, setUpdatedAd] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitStatus(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setUpdatedAd(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ads/sold-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adId,
          mobile,
          soldStatus
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to update status.");
        return;
      }

      setMessage(data.message);
      setUpdatedAd(data.ad);
    } catch (statusError) {
      console.error("Sold status submit failed:", statusError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitStatus} className="rounded-3xl border bg-white p-6 shadow-sm">
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-slate-700">Ad ID</label>
          <input
            value={adId}
            onChange={(event) => setAdId(event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="Example: 25"
            required
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">
            Posting Mobile Number
          </label>
          <input
            value={mobile}
            onChange={(event) => setMobile(event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="10 digit mobile used while posting"
            inputMode="numeric"
            maxLength={10}
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-bold text-slate-700">
          Current status of your product/service
        </p>

        <div className="mt-3 grid gap-3">
          {[
            {
              value: "AVAILABLE",
              label: "Not sold / still available"
            },
            {
              value: "SOLD_MYCLASSIFIEDS",
              label: "Sold through My Classifieds"
            },
            {
              value: "SOLD_ELSEWHERE",
              label: "Sold elsewhere"
            }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-4 ${
                soldStatus === option.value
                  ? "border-blue-700 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <input
                type="radio"
                name="soldStatus"
                value={option.value}
                checked={soldStatus === option.value}
                onChange={(event) => setSoldStatus(event.target.value)}
                className="mt-1 h-4 w-4"
              />
              <span className="font-semibold text-slate-800">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-red-600 px-6 py-4 font-black uppercase text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Updating..." : "Confirm Status"}
      </button>

      {updatedAd?.soldStatus === "AVAILABLE" && (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-900">
          <p className="font-black uppercase">Renew or upgrade your ad</p>
          <p className="mt-2">
            Since your item/service is still available, renew your ad or upgrade
            to Paid, Premium or Featured visibility.
          </p>
          <Link
            href={`/renew?adId=${updatedAd.id}&mobile=${mobile}`}
            className="mt-4 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-black uppercase text-white"
          >
            Renew / Upgrade
          </Link>
        </div>
      )}
    </form>
  );
}
