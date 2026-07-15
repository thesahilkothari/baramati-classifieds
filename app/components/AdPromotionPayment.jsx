"use client";

import { useState } from "react";

const plans = [
  {
    key: "FEATURED_7_DAYS",
    name: "Featured Ad",
    price: "₹199",
    description: "Highlighted listing for 7 days."
  },
  {
    key: "PREMIUM_30_DAYS",
    name: "Premium Ad",
    price: "₹499",
    description: "Premium listing visibility for 30 days."
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
  const [selectedPlan, setSelectedPlan] = useState("FEATURED_7_DAYS");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function startPayment() {
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
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
            setError(verifyData.error || "Payment verification failed.");
            return;
          }

          setMessage(
            "Payment successful. Your ad promotion is recorded and will be visible after admin approval."
          );
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
      <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
        Promote Your Ad
      </p>

      <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
        Get better visibility
      </h2>

      <p className="mt-3 text-sm text-slate-600">
        Your ad is submitted for approval. You may optionally promote it for
        better visibility after admin approval.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <label
            key={plan.key}
            className={`cursor-pointer rounded-2xl border p-5 ${
              selectedPlan === plan.key
                ? "border-blue-700 bg-blue-50"
                : "bg-white"
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
                <h3 className="font-bold text-slate-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {plan.description}
                </p>
              </div>

              <p className="text-xl font-extrabold text-blue-700">
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
        className="mt-6 w-full rounded-xl bg-blue-700 px-6 py-4 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Opening Payment..." : "Pay and Promote Ad"}
      </button>
    </section>
  );
}
