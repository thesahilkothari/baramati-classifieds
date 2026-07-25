"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminManualPaymentActions({ payment }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isManualPayment =
    payment.status === "PENDING_MANUAL_VERIFICATION" ||
    String(payment.razorpayOrderId || "").startsWith("MC-");

  async function updateManualPayment(action) {
    setError("");
    setMessage("");
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/admin/payments/${payment.id}/manual-verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action,
            note
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to update manual payment.");
        return;
      }

      setMessage(data.message || "Payment updated.");
      setNote("");
      router.refresh();
    } catch (updateError) {
      console.error("Manual payment update failed:", updateError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  if (!isManualPayment) {
    return null;
  }

  if (payment.status !== "PENDING_MANUAL_VERIFICATION") {
    return (
      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
        Manual verification status:{" "}
        <span className="font-black">{payment.status}</span>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border bg-yellow-50 p-3">
      <p className="text-xs font-black uppercase text-yellow-900">
        Manual UPI Verification Required
      </p>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="mt-2 min-h-16 w-full rounded-xl border px-3 py-2 text-sm"
        placeholder="Verification note, bank statement remark, reason for rejection, etc."
      />

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs font-bold text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-2 rounded-lg bg-green-50 p-2 text-xs font-bold text-green-700">
          {message}
        </p>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => updateManualPayment("APPROVE")}
          disabled={isUpdating}
          className="rounded-xl bg-green-700 px-4 py-2 text-xs font-black uppercase text-white disabled:opacity-60"
        >
          Mark Paid & Apply Plan
        </button>

        <button
          type="button"
          onClick={() => updateManualPayment("REJECT")}
          disabled={isUpdating}
          className="rounded-xl bg-red-700 px-4 py-2 text-xs font-black uppercase text-white disabled:opacity-60"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
