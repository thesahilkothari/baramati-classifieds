"use client";

import { useState } from "react";

export default function LoginPage() {
  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  async function sendOtp(e) {
    e.preventDefault();

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mobile })
    });

    const data = await res.json();

    if (data.success) {
      setStep("otp");
    } else {
      alert(data.error || "Failed to send OTP");
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mobile,
        code: otp,
        name
      })
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/dashboard";
    } else {
      alert(data.error || "Invalid OTP");
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold">Login / Register</h1>

        <p className="mt-2 text-sm text-slate-500">
          Mobile OTP verification helps keep Baramati Classifieds trustworthy.
        </p>

        {step === "mobile" && (
          <form onSubmit={sendOtp} className="mt-6 space-y-4">
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10 digit mobile number"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              required
            />

            <button className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">
              Send OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp} className="mt-6 space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
            />

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              required
            />

            <button className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
