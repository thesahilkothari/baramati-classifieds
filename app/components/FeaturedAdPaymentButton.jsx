"use client";

import { useState } from "react";

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

export default function FeaturedAdPaymentButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handlePayment() {
    setIsLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Unable to load Razorpay. Please try again.");
        return;
      }

      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: 199,
          purpose: "FEATURED_AD"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to create payment order.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "My Classifieds",
        description: "Featured Ad Listing",
        order_id: data.orderId,
        handler: function () {
          alert("Payment successful. Featured ad activation will be processed.");
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#1d4ed8"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={isLoading}
      className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Opening Payment..." : "Pay ₹199 for Featured Ad"}
    </button>
  );
}
