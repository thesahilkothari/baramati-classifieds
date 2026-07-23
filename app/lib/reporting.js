export const REPORT_TYPES = [
  { value: "FAKE_OR_FRAUD", label: "Fake / Fraud / Scam Listing", priority: "HIGH" },
  { value: "PROHIBITED_CONTENT", label: "Prohibited or Illegal Content", priority: "HIGH" },
  { value: "IP_INFRINGEMENT", label: "Trademark / Copyright / IP Infringement", priority: "HIGH" },
  { value: "PRIVACY_OR_PERSONAL_DATA", label: "Privacy or Personal Data Concern", priority: "HIGH" },
  { value: "SAFETY_OR_ILLEGAL", label: "Safety, Threat, Abuse or Illegal Activity", priority: "URGENT" },
  { value: "AD_DETAILS_INCORRECT", label: "Incorrect or Misleading Ad Details", priority: "NORMAL" },
  { value: "PAYMENT_OR_REFUND", label: "Payment / Refund / Billing Issue", priority: "NORMAL" },
  { value: "OTHER", label: "Other Grievance / Support Request", priority: "NORMAL" }
];

export const REPORT_STATUSES = [
  "NEW",
  "UNDER_REVIEW",
  "INFO_REQUESTED",
  "ACTION_TAKEN",
  "REJECTED",
  "RESOLVED",
  "CLOSED"
];

export const REPORT_PRIORITIES = ["NORMAL", "HIGH", "URGENT"];

export function getReportType(typeValue) {
  return REPORT_TYPES.find((type) => type.value === typeValue) || null;
}

export function getReportPriority(typeValue) {
  return getReportType(typeValue)?.priority || "NORMAL";
}

export function getAllowedReportTypeValues() {
  return REPORT_TYPES.map((type) => type.value);
}

export function generateReportReference() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MC-RPT-${yyyy}${mm}${dd}-${random}`;
}

export function cleanMobile(value) {
  return String(value || "").replace(/\D/g, "");
}

export function cleanText(value, maxLength = 191) {
  return String(value || "").trim().slice(0, maxLength);
}

export function isValidEmail(value) {
  const email = String(value || "").trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
