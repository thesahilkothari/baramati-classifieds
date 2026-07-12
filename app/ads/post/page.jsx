"use client";

import { useEffect, useState } from "react";

export default function PostAdPage() {
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    mobile: "",
    whatsapp: "",
    categoryId: "",
    cityId: "",
    address: "",
    images: []
  });

  useEffect(() => {
    async function loadData() {
      const catRes = await fetch("/api/meta/categories");
      const cityRes = await fetch("/api/meta/cities");

      if (catRes.ok) setCategories((await catRes.json()).categories);
      if (cityRes.ok) setCities((await cityRes.json()).cities);
    }

    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/ads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.success) {
      alert("Ad submitted successfully. It will be reviewed before publishing.");
      window.location.href = "/dashboard";
    } else {
      alert(data.error || "Failed to submit ad");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Post Free Ad</h1>

      <p className="mt-2 text-slate-500">
        Add clear photos and genuine details for better response.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label className="font-semibold">Ad Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Example: 2BHK flat for rent in Baramati"
          />
        </div>

        <div>
          <label className="font-semibold">Description</label>
          <textarea
            required
            rows="6"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Write full details of your ad"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="font-semibold">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Amount in ₹"
            />
          </div>

          <div>
            <label className="font-semibold">Mobile Number</label>
            <input
              required
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              placeholder="10 digit mobile"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="font-semibold">Category</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameEn} / {cat.nameMr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">City</label>
            <select
              required
              value={form.cityId}
              onChange={(e) => setForm({ ...form, cityId: e.target.value })}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold">Address / Area</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Example: Vidya Pratishthan Road, Baramati"
          />
        </div>

        <button className="w-full rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800">
          Submit Ad for Review
        </button>
      </form>
    </div>
  );
}
