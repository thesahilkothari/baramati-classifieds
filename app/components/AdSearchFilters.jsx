"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ITEM_CONDITIONS } from "../lib/itemConditions";
import { LANGUAGE_COOKIE_NAME, normalizeLanguage, t } from "../lib/i18n";

function getInitialValue(searchParams, key) {
  return searchParams.get(key) || "";
}

function readLanguageFromCookie() {
  if (typeof document === "undefined") {
    return "en";
  }

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LANGUAGE_COOKIE_NAME}=`));

  return normalizeLanguage(cookie?.split("=")?.[1]);
}

function getConditionLabel(condition, language) {
  if (language !== "mr") {
    return condition.label;
  }

  if (condition.value === "NEW") return t(language, "new");
  if (condition.value === "USED") return t(language, "used");
  if (condition.value === "LIKE_NEW") return t(language, "likeNew");

  return condition.label;
}

export default function AdSearchFilters({ categories = [], cities = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setLanguage(readLanguageFromCookie());
  }, []);

  const initialState = useMemo(
    () => ({
      q: getInitialValue(searchParams, "q"),
      category: getInitialValue(searchParams, "category"),
      city: getInitialValue(searchParams, "city"),
      minPrice: getInitialValue(searchParams, "minPrice"),
      maxPrice: getInitialValue(searchParams, "maxPrice"),
      condition: getInitialValue(searchParams, "condition"),
      posted: getInitialValue(searchParams, "posted"),
      sort: getInitialValue(searchParams, "sort") || "recommended"
    }),
    [searchParams]
  );

  const [form, setForm] = useState(initialState);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function submitFilters(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    router.push(`/ads?${params.toString()}`);
  }

  function clearFilters() {
    setForm({
      q: "",
      category: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      condition: "",
      posted: "",
      sort: "recommended"
    });

    router.push("/ads");
  }

  return (
    <section className="rounded-3xl border-2 border-slate-900 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">
            {t(language, "searchClassifieds")}
          </p>
          <h2 className="mt-1 text-xl font-black uppercase text-slate-950">
            {t(language, "findFaster")}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-xl border px-4 py-2 text-xs font-black uppercase text-slate-700 md:hidden"
        >
          {isOpen ? t(language, "hideFilters") : t(language, "showFilters")}
        </button>
      </div>

      <form
        onSubmit={submitFilters}
        className={`mt-4 ${isOpen ? "block" : "hidden"} md:block`}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="md:col-span-2">
            <label htmlFor="ad-search-keyword" className="text-xs font-black uppercase text-slate-500">
              {t(language, "keyword")}
            </label>
            <input
              id="ad-search-keyword"
              name="q"
              value={form.q}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
              placeholder={t(language, "keywordPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="ad-search-category" className="text-xs font-black uppercase text-slate-500">
              {t(language, "category")}
            </label>
            <select
              id="ad-search-category"
              name="category"
              value={form.category}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
            >
              <option value="">{t(language, "allCategories")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {language === "mr" ? category.nameMr || category.nameEn : category.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ad-search-city" className="text-xs font-black uppercase text-slate-500">
              {t(language, "location")}
            </label>
            <select
              id="ad-search-city"
              name="city"
              value={form.city}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
            >
              <option value="">{t(language, "allLocations")}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ad-search-min-price" className="text-xs font-black uppercase text-slate-500">
              {t(language, "minPrice")}
            </label>
            <input
              id="ad-search-min-price"
              name="minPrice"
              value={form.minPrice}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
              placeholder="1000"
              inputMode="numeric"
            />
          </div>

          <div>
            <label htmlFor="ad-search-max-price" className="text-xs font-black uppercase text-slate-500">
              {t(language, "maxPrice")}
            </label>
            <input
              id="ad-search-max-price"
              name="maxPrice"
              value={form.maxPrice}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
              placeholder="50000"
              inputMode="numeric"
            />
          </div>

          <div>
            <label htmlFor="ad-search-condition" className="text-xs font-black uppercase text-slate-500">
              {t(language, "condition")}
            </label>
            <select
              id="ad-search-condition"
              name="condition"
              value={form.condition}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
            >
              <option value="">{t(language, "anyCondition")}</option>
              {ITEM_CONDITIONS.filter(
                (condition) => condition.value !== "NOT_APPLICABLE"
              ).map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {getConditionLabel(condition, language)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ad-search-posted" className="text-xs font-black uppercase text-slate-500">
              {t(language, "posted")}
            </label>
            <select
              id="ad-search-posted"
              name="posted"
              value={form.posted}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
            >
              <option value="">{t(language, "anyTime")}</option>
              <option value="today">{t(language, "postedToday")}</option>
              <option value="7days">{t(language, "last7Days")}</option>
              <option value="30days">{t(language, "last30Days")}</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-black uppercase text-white hover:bg-blue-800"
          >
            {t(language, "applyFilters")}
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border px-6 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
          >
            {t(language, "clear")}
          </button>
        </div>
      </form>
    </section>
  );
}
