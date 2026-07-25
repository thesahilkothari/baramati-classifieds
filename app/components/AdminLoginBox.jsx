"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginBox() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Invalid admin password.");
        return;
      }

      setPassword("");
      router.refresh();
      router.push("/admin/dashboard");
    } catch (loginError) {
      console.error("Admin login failed:", loginError);
      setError("Unable to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
      <p className="text-sm font-black uppercase tracking-wide text-blue-700">
        Admin Access
      </p>

      <h1 className="mt-2 text-3xl font-black uppercase text-slate-950">
        My Classifieds Admin
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Enter the admin password to manage ads, payments, grievances, follow-ups
        and compliance records.
      </p>

      <form onSubmit={handleLogin} className="mt-6">
        <label className="text-sm font-bold text-slate-700">
          Admin Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
          placeholder="Enter admin password"
          required
        />

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-xl bg-blue-700 px-6 py-4 font-black uppercase text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}
