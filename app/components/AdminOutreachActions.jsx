"use client";

import { useState } from "react";

function buildWhatsAppUrl(mobile, message) {
  const digits = String(mobile || "").replace(/\D/g, "");
  const normalized = digits.length === 10 ? `91${digits}` : digits;

  if (!normalized) return "";

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export default function AdminOutreachActions({ adId, templateKey, whatsappMobile, whatsappMessage }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(whatsappMobile, whatsappMessage);

  async function sendEmail() {
    setStatus("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/admin/outreach/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ adId, templateKey })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.details || data.error || "Unable to send email.");
        return;
      }

      setStatus(data.message || "Email sent successfully.");
    } catch (sendError) {
      console.error("Outreach email failed:", sendError);
      setError("Unable to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(whatsappMessage || "");
      setStatus("Message copied.");
      setError("");
    } catch {
      setError("Unable to copy message. Please copy manually.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={sendEmail}
          disabled={isSending}
          className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-black uppercase text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send Email"}
        </button>

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-green-600 px-4 py-2 text-center text-xs font-black uppercase text-white hover:bg-green-700"
          >
            WhatsApp
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-black uppercase text-slate-500"
          >
            No Mobile
          </button>
        )}

        <button
          type="button"
          onClick={copyMessage}
          className="rounded-xl border px-4 py-2 text-xs font-black uppercase text-slate-700 hover:bg-slate-50"
        >
          Copy Text
        </button>
      </div>

      {status && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
          {status}
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
