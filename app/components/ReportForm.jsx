"use client";

import Link from "next/link";
import { useState } from "react";
import { REPORT_TYPES } from "../lib/reporting";

const initialForm = {
  reportType: "",
  reason: "",
  description: "",
  reporterName: "",
  reporterEmail: "",
  reporterMobile: "",
  evidenceUrl: "",
  pageUrl: ""
};

export default function ReportForm({ initialAdId = "", initialAdSlug = "" }) {
  const [form, setForm] = useState({
    ...initialForm,
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
    adId: initialAdId,
    adSlug: initialAdSlug
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setReferenceNumber("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to submit report.");
        return;
      }
      setReferenceNumber(data.referenceNumber);
      setForm({ ...initialForm, adId: initialAdId, adSlug: initialAdSlug, pageUrl: typeof window !== "undefined" ? window.location.href : "" });
    } catch (reportError) {
      console.error("Report submit failed:", reportError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (referenceNumber) {
    return (
      <div className="rounded-3xl border-2 border-green-700 bg-green-50 p-6 text-green-950">
        <p className="text-sm font-black uppercase tracking-wide">Report Submitted</p>
        <h2 className="mt-2 text-3xl font-black">Reference Saved</h2>
        <p className="mt-4 leading-7">Your report has been submitted to My Classifieds. Please save this reference number for follow-up:</p>
        <p className="mt-5 rounded-2xl border-2 border-green-700 bg-white p-4 text-center text-2xl font-black tracking-wide">{referenceNumber}</p>
        <p className="mt-4 text-sm leading-6">For urgent matters, email <a href="mailto:connect@myclassifieds.in" className="font-bold underline">connect@myclassifieds.in</a> with this reference number.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/ads" className="rounded-xl bg-green-700 px-5 py-3 text-sm font-black uppercase text-white">Back to Ads</Link>
          <button type="button" onClick={() => setReferenceNumber("")} className="rounded-xl border border-green-700 px-5 py-3 text-sm font-black uppercase text-green-900">Submit Another Report</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border bg-white p-6 shadow-sm">
      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
      {(initialAdId || initialAdSlug) && <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">This report is linked to classified <span className="font-black">{initialAdId ? `#${initialAdId}` : initialAdSlug}</span>.</div>}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-slate-700">Report Type</label>
          <select name="reportType" value={form.reportType} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" required>
            <option value="">Select issue type</option>
            {REPORT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700">Short Reason</label>
          <input name="reason" value={form.reason} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Example: Fake seller / misleading property ad" required />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700">Your Name</label>
          <input name="reporterName" value={form.reporterName} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Enter your full name" required />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700">Mobile Number</label>
          <input name="reporterMobile" value={form.reporterMobile} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="10 digit mobile number" inputMode="numeric" maxLength={10} />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700">Email Address</label>
          <input type="email" name="reporterEmail" value={form.reporterEmail} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="your@email.com" />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700">Evidence / Screenshot URL</label>
          <input name="evidenceUrl" value={form.evidenceUrl} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Optional link to evidence" />
        </div>
      </div>
      <div className="mt-5">
        <label className="text-sm font-bold text-slate-700">Page URL / Ad URL</label>
        <input name="pageUrl" value={form.pageUrl} onChange={updateField} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Paste relevant ad/page URL" />
      </div>
      <div className="mt-5">
        <label className="text-sm font-bold text-slate-700">Detailed Description</label>
        <textarea name="description" value={form.description} onChange={updateField} className="mt-2 min-h-36 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700" placeholder="Describe the issue clearly. Mention payment details, ad title, seller mobile, evidence, and what action you are requesting." required />
      </div>
      <div className="mt-5 rounded-2xl bg-yellow-50 p-4 text-sm leading-6 text-yellow-900">Please provide either your email address or mobile number so that the grievance/support team can contact you if further information is needed. False or abusive reports may be rejected.</div>
      <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-red-600 px-6 py-4 font-black uppercase text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Submitting Report..." : "Submit Report / Grievance"}</button>
    </form>
  );
}
