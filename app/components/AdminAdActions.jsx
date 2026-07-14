"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminAdActions({ adId, currentStatus }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function updateStatus(status) {
    const confirmed = window.confirm(`Change ad status to ${status}?`);

    if (!confirmed) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/ads/${adId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to update ad.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Update ad status failed:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-3">
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
  );
}
