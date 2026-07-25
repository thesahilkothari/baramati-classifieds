"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LANGUAGE_COOKIE_NAME, LANGUAGES, normalizeLanguage } from "../lib/i18n";

export default function LanguageToggle({ currentLanguage = "en" }) {
  const router = useRouter();
  const [language, setLanguage] = useState(normalizeLanguage(currentLanguage));

  function changeLanguage(nextLanguage) {
    const normalizedLanguage = normalizeLanguage(nextLanguage);

    document.cookie = `${LANGUAGE_COOKIE_NAME}=${normalizedLanguage}; path=/; max-age=31536000; SameSite=Lax`;
    window.localStorage.setItem(LANGUAGE_COOKIE_NAME, normalizedLanguage);
    document.documentElement.lang =
      normalizedLanguage === "mr" ? "mr-IN" : "en-IN";

    setLanguage(normalizedLanguage);
    router.refresh();
  }

  return (
    <div className="inline-flex rounded-full border bg-white p-1 shadow-sm">
      {LANGUAGES.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => changeLanguage(item.code)}
          className={`rounded-full px-3 py-1.5 text-xs font-black uppercase transition ${
            language === item.code
              ? "bg-blue-700 text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          aria-pressed={language === item.code}
        >
          {item.shortLabel}
        </button>
      ))}
    </div>
  );
}
