"use client";

import { useEffect, useState } from "react";

const TEXT = {
  en: {
    title: "Email OTP Verification",
    intro:
      "Enter the email address used while posting your ad. We will send a 6 digit OTP to that email.",
    email: "Posting Email Address",
    sendOtp: "Send OTP",
    sending: "Sending...",
    otp: "6 Digit OTP",
    verify: "Verify OTP",
    verifying: "Verifying...",
    verified: "Email verified",
    changeEmail: "Change Email",
    logout: "Logout",
    sent: "OTP sent to your email address.",
    note:
      "This protects your ads from being viewed or changed by someone who only knows your mobile number."
  },
  mr: {
    title: "Email OTP Verification",
    intro:
      "जाहिरात पोस्ट करताना वापरलेला email address भरा. त्या email वर 6 digit OTP पाठवला जाईल.",
    email: "पोस्टिंग ईमेल पत्ता",
    sendOtp: "OTP पाठवा",
    sending: "पाठवत आहे...",
    otp: "6 Digit OTP",
    verify: "OTP Verify करा",
    verifying: "Verify होत आहे...",
    verified: "Email verified",
    changeEmail: "Email बदला",
    logout: "Logout",
    sent: "OTP आपल्या email address वर पाठवला आहे.",
    note:
      "फक्त mobile number माहिती असलेल्या व्यक्तीपासून आपल्या जाहिराती सुरक्षित ठेवण्यासाठी हे verification आहे."
  }
};

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 180);
}

export default function EmailOtpGate({
  initialEmail = "",
  initialLanguage = "en",
  onVerified
}) {
  const language = initialLanguage === "mr" ? "mr" : "en";
  const text = TEXT[language];

  const [email, setEmail] = useState(cleanEmail(initialEmail));
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [step, setStep] = useState("request");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/user/email-otp/session");
        const data = await response.json();

        if (data.authenticated && data.email) {
          setEmail(data.email);
          setIsVerified(true);
          setStep("verified");
          onVerified?.(data.email);
        }
      } catch {
        // Ignore session lookup errors.
      }
    }

    checkSession();
  }, [onVerified]);

  async function requestOtp(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsSending(true);

    try {
      const response = await fetch("/api/user/email-otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to send OTP.");
        return;
      }

      setMessage(text.sent);
      setStep("verify");
    } catch (requestError) {
      console.error("OTP request failed:", requestError);
      setError("Unable to send OTP. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsVerifying(true);

    try {
      const response = await fetch("/api/user/email-otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid OTP.");
        return;
      }

      setIsVerified(true);
      setStep("verified");
      setMessage(text.verified);
      onVerified?.(data.email || email);
    } catch (verifyError) {
      console.error("OTP verify failed:", verifyError);
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function logout() {
    await fetch("/api/user/email-otp/session", { method: "DELETE" });
    setIsVerified(false);
    setStep("request");
    setCode("");
    setMessage("");
    onVerified?.("");
  }

  return (
    <section className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-black uppercase tracking-wide text-green-700">
        Secure Access
      </p>

      <h2 className="mt-2 text-2xl font-black uppercase text-slate-950">
        {text.title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-700">
        {text.intro}
      </p>

      <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold leading-6 text-blue-900">
        {text.note}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      {step === "verified" && isVerified ? (
        <div className="mt-5 rounded-2xl bg-green-50 p-4">
          <p className="text-sm font-black text-green-900">
            {text.verified}: {email}
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 rounded-xl border border-green-700 px-4 py-2 text-xs font-black uppercase text-green-700"
          >
            {text.logout}
          </button>
        </div>
      ) : step === "verify" ? (
        <form onSubmit={verifyOtp} className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <div>
            <label className="text-sm font-bold text-slate-700">{text.otp}</label>
            <input
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="mt-2 w-full rounded-xl border px-4 py-3 text-center text-2xl font-black tracking-[0.3em] outline-none focus:border-blue-700"
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="self-end rounded-xl bg-green-700 px-6 py-3 font-black uppercase text-white hover:bg-green-800 disabled:opacity-60"
          >
            {isVerifying ? text.verifying : text.verify}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("request");
              setCode("");
              setMessage("");
              setError("");
            }}
            className="rounded-xl border px-5 py-3 text-sm font-black uppercase text-slate-700 md:col-span-2"
          >
            {text.changeEmail}
          </button>
        </form>
      ) : (
        <form onSubmit={requestOtp} className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <div>
            <label className="text-sm font-bold text-slate-700">{text.email}</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(cleanEmail(event.target.value))}
              className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-700"
              placeholder="name@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="self-end rounded-xl bg-blue-700 px-6 py-3 font-black uppercase text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {isSending ? text.sending : text.sendOtp}
          </button>
        </form>
      )}
    </section>
  );
}
