"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SUPPORT_FAQS, getLocalizedFaqText, getSupportWhatsAppUrl } from "../lib/supportFaq";
import { LANGUAGE_COOKIE_NAME, t, normalizeLanguage } from "../lib/i18n";

function readLanguageFromCookie() {
  if (typeof document === "undefined") {
    return "en";
  }

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LANGUAGE_COOKIE_NAME}=`));

  return normalizeLanguage(cookie?.split("=")?.[1]);
}

export default function WhatsAppSupportBot({ initialLanguage = "en" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(normalizeLanguage(initialLanguage));
  const [activeFaq, setActiveFaq] = useState(SUPPORT_FAQS[0]?.id || "");

  useEffect(() => {
    setLanguage(readLanguageFromCookie());
  }, [isOpen]);

  const selectedFaq =
    SUPPORT_FAQS.find((faq) => faq.id === activeFaq) || SUPPORT_FAQS[0];
  const selectedText = selectedFaq
    ? getLocalizedFaqText(selectedFaq, language)
    : null;

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
      {isOpen && (
        <section className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border bg-white shadow-2xl">
          <div className="bg-green-700 p-4 text-white">
            <p className="text-xs font-black uppercase tracking-wide">
              {t(language, "instantHelp")}
            </p>
            <h2 className="mt-1 text-xl font-black">
              {t(language, "supportTitle")}
            </h2>
            <p className="mt-2 text-xs leading-5 text-green-50">
              {t(language, "supportIntro")}
            </p>
          </div>

          <div className="max-h-[55vh] overflow-y-auto p-4">
            <div className="space-y-2">
              {SUPPORT_FAQS.map((faq) => {
                const localized = getLocalizedFaqText(faq, language);

                return (
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
                    {localized.question}
                  </button>
                );
              })}
            </div>

            {selectedText && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <p className="font-black text-slate-950">
                  {selectedText.question}
                </p>
                <p className="mt-2">{selectedText.answer}</p>
              </div>
            )}

            <div className="mt-4 grid gap-2">
              <a
                href={getSupportWhatsAppUrl(activeFaq, language)}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-black uppercase text-white"
              >
                {t(language, "continueWhatsApp")}
              </a>

              <Link
                href="/support"
                onClick={() => setIsOpen(false)}
                className="flex justify-center rounded-xl border px-4 py-3 text-sm font-black uppercase text-slate-700"
              >
                {t(language, "viewHelpCentre")}
              </Link>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex min-h-12 min-w-[132px] items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-xs font-black uppercase tracking-wide text-white shadow-2xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-600/25"
        aria-label={isOpen ? "Close My Classifieds support" : "Open My Classifieds instant help"}
      >
        <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-base leading-none">
          {isOpen ? "×" : "?"}
        </span>
        <span>{isOpen ? "Close" : "Instant Help"}</span>
      </button>
    </div>
  );
}
