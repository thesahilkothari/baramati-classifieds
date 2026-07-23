"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExpiryNoticeButton({ adId, whatsappUrl }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  async function markNoticeSent() {
    setError("");
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/ads/${adId}/notice-sent`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to mark notice as sent.");
        return;
      }

      router.refresh();
    } catch (noticeError) {
      console.error("Mark notice sent failed:", noticeError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl bg-green-600 px-4 py-3 text-sm font-black uppercase text-white hover:bg-green-700"
      >
        Open WhatsApp Notice
      </a>

      <button
        type="button"
        onClick={markNoticeSent}
        disabled={isUpdating}
        className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-black uppercase text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUpdating ? "Marking..." : "Mark Notice Sent"}
      </button>

      {error && (
        <p className="w-full text-sm font-bold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}