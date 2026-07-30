export function normalizePaymentReference(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 40);
}

export function getPaymentReferenceValidation(value) {
  const reference = normalizePaymentReference(value);

  if (!reference) {
    return {
      ok: false,
      reference,
      severity: "empty",
      message: "Enter the UPI transaction ID / UTR after payment."
    };
  }

  if (reference.length < 6) {
    return {
      ok: false,
      reference,
      severity: "short",
      message: "The payment reference looks too short. Please recheck the UPI app receipt."
    };
  }

  if (reference.length > 35) {
    return {
      ok: false,
      reference,
      severity: "long",
      message: "The payment reference looks too long. Please paste only the UTR / transaction ID."
    };
  }

  if (/^0+$/.test(reference)) {
    return {
      ok: false,
      reference,
      severity: "invalid",
      message: "This does not look like a valid payment reference."
    };
  }

  if (/^\d{12}$/.test(reference)) {
    return {
      ok: true,
      reference,
      confidence: "HIGH",
      message: "This looks like a standard 12-digit UPI UTR."
    };
  }

  if (/^\d{10,18}$/.test(reference)) {
    return {
      ok: true,
      reference,
      confidence: "MEDIUM",
      message: "This looks like a numeric bank / UPI reference."
    };
  }

  if (/^[A-Z0-9]{8,35}$/.test(reference)) {
    return {
      ok: true,
      reference,
      confidence: "MEDIUM",
      message: "This looks like an alphanumeric payment reference."
    };
  }

  return {
    ok: false,
    reference,
    severity: "invalid",
    message: "Please enter only letters and numbers from the UPI transaction ID / UTR."
  };
}

export function buildCheckoutReference({ adId, planKey }) {
  const safeAdId = String(adId || "AD").replace(/[^0-9A-Z]/gi, "").slice(0, 10);
  const safePlan = String(planKey || "PLAN")
    .replace(/[^A-Z0-9]/gi, "")
    .replace("DAYS", "D")
    .replace("PREMIUM", "PREM")
    .replace("PAID", "PAID")
    .slice(0, 14);

  return `MC${safeAdId}${safePlan}`.slice(0, 28);
}

export function buildPaymentDetailsJson({
  payerName,
  payerMobile,
  note,
  ownerMobile,
  ownerEmail,
  validation,
  automationMode,
  checkoutReference,
  bankWebhookNote,
  adminNote
}) {
  return JSON.stringify({
    payerName: String(payerName || "").trim(),
    payerMobile: String(payerMobile || "").trim(),
    note: String(note || "").trim(),
    ownerMobile: String(ownerMobile || "").trim(),
    ownerEmail: String(ownerEmail || "").trim(),
    utrConfidence: validation?.confidence || null,
    automationMode: automationMode || "DECENTRALISED_UTR_VALIDATION",
    checkoutReference: checkoutReference || null,
    bankWebhookNote: bankWebhookNote || null,
    adminNote: adminNote || null
  });
}

export function parsePaymentDetailsJson(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return {
      note: value || ""
    };
  }
}
