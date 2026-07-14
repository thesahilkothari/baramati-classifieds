"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialForm = {
  name: "",
  mobile: "",
  whatsapp: "",
  categoryId: "",
  cityId: "",
  title: "",
  description: "",
  price: "",
  address: ""
};

export default function PostAdForm({ categories, cities }) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to submit ad.");
        return;
      }

      router.push(`/post-ad/success?adId=${data.adId}`);
    } catch (submitError) {
      console.error("Submit ad failed:", submitError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-slate-700">Your Name</label>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">Mobile Number</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="10 digit mobile number"
            maxLength={10}
            required
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">WhatsApp Number</label>
          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="Leave blank if same as mobile"
            maxLength={10}
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">Price</label>
          <input
            name="price"
            value={form.price}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            placeholder="Example: 25000"
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameEn} / {category.nameMr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">City</label>
          <select
            name="cityId"
            value={form.cityId}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
            required
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Ad Title</label>
        <input
          name="title"
          value={form.title}
          onChange={updateField}
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
          placeholder="Example: 2 BHK flat for sale in Baramati"
          required
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          className="mt-2 min-h-36 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
          placeholder="Write important details about your ad"
          required
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Address / Local Area</label>
        <input
          name="address"
          value={form.address}
          onChange={updateField}
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
          placeholder="Example: Baramati MIDC, Jalochi, Pune Road"
        />
      </div>

      <div className="rounded-2xl bg-yellow-50 p-5 text-sm text-yellow-900">
        Your ad will be reviewed before it becomes publicly visible. Do not post
        misleading, illegal, fraudulent or duplicate ads.
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-blue-700 px-6 py-4 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Ad for Approval"}
      </button>
    </form>
  );
}
