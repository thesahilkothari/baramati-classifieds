export const MANUAL_UPI_CONFIG = {
  vpa: "skepl1@icici",
  payeeName: "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED",
  qrImagePath: "/upi-qr.jpeg",
  supportEmail: "connect@myclassifieds.in",
  supportWhatsApp: "+91 9673931166"
};

export const MANUAL_PAYMENT_PLANS = [
  {
    key: "PAID_7_DAYS",
    name: "Paid Classified",
    price: 199,
    amountInPaise: 19900,
    duration: "7 days",
    description:
      "Publish your classified as a paid listing for 7 days after admin approval."
  },
  {
    key: "PREMIUM_30_DAYS",
    name: "Premium Classified",
    price: 499,
    amountInPaise: 49900,
    duration: "30 days",
    description:
      "Best for important property, jobs, business and urgent classified advertisements."
  }
];

export function getManualPaymentPlan(planKey) {
  return MANUAL_PAYMENT_PLANS.find((plan) => plan.key === planKey) || null;
}

export function formatManualAmount(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function createManualPaymentReference(adId, planKey) {
  const safeAdId = adId ? String(adId) : "AD";
  const safePlan = String(planKey || "PLAN").replace(/[^A-Z0-9_]/gi, "");
  const timestamp = Date.now();

  return `MC-${safeAdId}-${safePlan}-${timestamp}`;
}

export function buildUpiPaymentUrl({ amount, adId, planKey, referenceNumber }) {
  const note = [
    "My Classifieds",
    adId ? `Ad ${adId}` : "",
    planKey || "",
    referenceNumber || ""
  ]
    .filter(Boolean)
    .join(" ");

  const params = new URLSearchParams({
    pa: MANUAL_UPI_CONFIG.vpa,
    pn: MANUAL_UPI_CONFIG.payeeName,
    am: String(amount),
    cu: "INR",
    tn: note.slice(0, 80)
  });

  return `upi://pay?${params.toString()}`;
}
