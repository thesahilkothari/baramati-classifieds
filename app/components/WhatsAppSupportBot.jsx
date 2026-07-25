"use client";

import Link from "next/link";
import { useState } from "react";
import { SUPPORT_FAQS, getSupportWhatsAppUrl } from "../lib/supportFaq";

export default function WhatsAppSupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(SUPPORT_FAQS[0]?.id || "");

  const selectedFaq =
    SUPPORT_FAQS.find((faq) => faq.id === activeFaq) || SUPPORT_FAQS[0];

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
      {isOpen && (
        <section className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border bg-white shadow-2xl">
          <div className="bg-green-700 p-4 text-white">
            <p className="text-xs font-black uppercase tracking-wide">Instant Help</p>
            <h2 className="mt-1 text-xl font-black">My Classifieds Support</h2>
            <p className="mt-2 text-xs leading-5 text-green-50">
              Get quick answers now. For more help, continue on WhatsApp.
            </p>
          </div>

          <div className="max-h-[55vh] overflow-y-auto p-4">
            <div className="space-y-2">
              {SUPPORT_FAQS.map((faq) => (
                <button
                  key={faq.id}
                  type="button"
                  onClick={() => setActiveFaq(faq.id)}
                  className={`w-full rounded-2xl border px-3 py-2 text-left text-sm font-bold ${
                    activeFaq === faq.id
                      ? "border-green-700 bg-green-50 text-green-900"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {faq.question}
                </button>
              ))}
            </div>

            {selectedFaq && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <p className="font-black text-slate-950">{selectedFaq.question}</p>
                <p className="mt-2">{selectedFaq.answer}</p>
              </div>
            )}

            <div className="mt-4 grid gap-2">
              <a
                href={getSupportWhatsAppUrl(activeFaq)}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-black uppercase text-white"
              >
                Continue on WhatsApp
              </a>
              <Link
                href="/support"
                onClick={() => setIsOpen(false)}
                className="flex justify-center rounded-xl border px-4 py-3 text-sm font-black uppercase text-slate-700"
              >
                View Help Centre
              </Link>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-black text-white shadow-2xl hover:bg-green-700"
        aria-label="Open My Classifieds support"
      >
        {isOpen ? "×" : "WA"}
      </button>
    </div>
  );
}
