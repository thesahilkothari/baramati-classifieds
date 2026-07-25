"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ITEM_CONDITIONS } from "../lib/itemConditions";

function getInitialValue(searchParams, key) {
  return searchParams.get(key) || "";
}

export default function AdSearchFilters({ categories = [], cities = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const initialState = useMemo(
    () => ({
      q: getInitialValue(searchParams, "q"),
      category: getInitialValue(searchParams, "category"),
      city: getInitialValue(searchParams, "city"),
      minPrice: getInitialValue(searchParams, "minPrice"),
      maxPrice: getInitialValue(searchParams, "maxPrice"),
      condition: getInitialValue(searchParams, "condition"),
      posted: getInitialValue(searchParams, "posted")
    }),
    [searchParams]
  );

  const [form, setForm] = useState(initialState);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitFilters(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    Object.entries(form).forEach(([key, value]) => {
      if (value) params.set(key, value);
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
      posted: ""
    });

    router.push("/ads");
  }

  return (
    <section className="rounded-3xl border-2 border-slate-900 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">
            Search Classifieds
          </p>
          <h2 className="mt-1 text-xl font-black uppercase text-slate-950">
            Find faster with filters
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-xl border px-4 py-2 text-xs font-black uppercase text-slate-700 md:hidden"
        >
          {isOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <form onSubmit={submitFilters} className={`mt-4 ${isOpen ? "block" : "hidden"} md:block`}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="md:col-span-2">
            <label className="text-xs font-black uppercase text-slate-500">Keyword</label>
            <input
              name="q"
              value={form.q}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
              placeholder="Search property, jobs, vehicles, services..."
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500">Location</label>
            <select
              name="city"
              value={form.city}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
            >
              <option value="">All locations</option>
              {cities.map((city) => (
                <option key={city.id} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500">Min Price</label>
            <input
              name="minPrice"
              value={form.minPrice}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
              placeholder="1000"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500">Max Price</label>
            <input
              name="maxPrice"
              value={form.maxPrice}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
              placeholder="50000"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500">Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
            >
              <option value="">Any condition</option>
              {ITEM_CONDITIONS.filter(
                (condition) => condition.value !== "NOT_APPLICABLE"
              ).map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-slate-500">Posted</label>
            <select
              name="posted"
              value={form.posted}
              onChange={updateField}
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-700"
            >
              <option value="">Any time</option>
              <option value="today">Posted today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-black uppercase text-white hover:bg-blue-800"
          >
            Apply Filters
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border px-6 py-3 text-sm font-black uppercase text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}
