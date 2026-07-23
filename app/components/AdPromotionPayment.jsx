"use client";

import { useState } from "react";

const plans = [
  {
    key: "PAID_7_DAYS",
    name: "Paid Classified",
    price: "Rs. 199",
    duration: "7 days",
    description:
      "Publish your classified as a paid listing for 7 days after admin approval."
  },
  {
    key: "PREMIUM_30_DAYS",
    name: "Premium Classified",
    price: "Rs. 499",
    duration: "30 days",
    description:
      "Best for important property, jobs, business and urgent classified advertisements."
  }
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function AdPromotionPayment({ adId }) {
  const [selectedPlan, setSelectedPlan] = useState("PAID_7_DAYS");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function startPayment() {
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      if (!adId) {
        setError("Invalid classified advertisement reference.");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError("Unable to load Razorpay. Please try again.");
        return;
      }

      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adId,
          plan: selectedPlan
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        setError(orderData.error || "Unable to create payment order.");
        return;
      }

      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "My Classifieds",
        description: orderData.planLabel,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            setError("");
            setMessage("Verifying payment. Please wait...");

            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                adId,
                plan: selectedPlan,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              setMessage("");
              setError(verifyData.error || "Payment verification failed.");
              return;
            }

            setMessage(
              "Payment successful. Your selected plan has been recorded and will apply after admin approval."
            );
          } catch (verificationError) {
            console.error("Payment verification failed:", verificationError);
            setMessage("");
            setError(
              "Payment was completed, but verification failed. Please contact support with your payment screenshot."
            );
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          }
        },
        theme: {
          color: "#1d4ed8"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (paymentError) {
      console.error("Payment failed:", paymentError);
      setError("Payment could not be completed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-black uppercase tracking-wide text-blue-700">
        Promote Your Classified
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-900">
        Choose paid visibility
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your classified has been submitted for admin approval. You may keep it
        as a free classified, or choose a paid plan for better visibility after
        approval.
      </p>

      <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-yellow-900">
        Featured Add-on is available only after the classified is converted to a
        paid or premium plan. Therefore, only paid and premium plans are shown at
        this stage. Prices are GST inclusive.
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <label
            key={plan.key}
            className={`cursor-pointer rounded-2xl border-2 p-5 ${
              selectedPlan === plan.key
                ? "border-blue-700 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <input
              type="radio"
              name="promotionPlan"
              value={plan.key}
              checked={selectedPlan === plan.key}
              onChange={() => setSelectedPlan(plan.key)}
              className="sr-only"
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {plan.name}
                </h3>

                <p className="mt-1 text-xs font-black uppercase text-slate-500">
                  Valid for {plan.duration}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {plan.description}
                </p>
              </div>

              <p className="shrink-0 text-xl font-black text-blue-700">
                {plan.price}
              </p>
            </div>
          </label>
        ))}
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={startPayment}
        disabled={isLoading}
        className="mt-6 w-full rounded-xl bg-blue-700 px-6 py-4 font-black uppercase text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Opening Payment..." : "Pay and Promote Classified"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Payment does not guarantee approval of prohibited, misleading,
        fraudulent or illegal advertisements.
      </p>
    </section>
  );
}