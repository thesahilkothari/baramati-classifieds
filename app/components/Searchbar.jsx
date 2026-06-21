"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [city, setCity] = useState("baramati");

  function handleSubmit(e) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (city) params.set("city", city);

    router.push(`/ads?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl bg-white p-3 shadow-xl md:grid-cols-[1fr_180px_130px]"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search flats, bikes, jobs, tractors..."
        className="rounded-xl border px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
      />

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="rounded-xl border px-4 py-3 text-slate-900"
      >
        <option value="baramati">Baramati</option>
        <option value="pune">Pune</option>
        <option value="mumbai">Mumbai</option>
        <option value="nagpur">Nagpur</option>
        <option value="nashik">Nashik</option>
      </select>

      <button className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white">
        Search
      </button>
    </form>
  );
}
