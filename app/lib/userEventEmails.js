import { sendTransactionalEmail } from "./emailService";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://myclassifieds.in"
  ).replace(/\/+$/, "");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function formatCurrencyFromPaise(amountInPaise) {
  const amount = Number(amountInPaise || 0) / 100;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}

function getAdUrl(ad) {
  return `${getBaseUrl()}/ads/${ad.slug}`;
}

function getMyAdsUrl(ad) {
  const params = new URLSearchParams();
  if (ad?.mobile) params.set("mobile", ad.mobile);

  const query = params.toString();
  return `${getBaseUrl()}/my-ads${query ? `?${query}` : ""}`;
}

function getRenewUrl(ad) {
  const params = new URLSearchParams();
  if (ad?.id) params.set("adId", String(ad.id));
  if (ad?.mobile) params.set("mobile", ad.mobile);

  return `${getBaseUrl()}/renew?${params.toString()}`;
}

function getSoldStatusUrl(ad) {
  const params = new URLSearchParams();
  if (ad?.id) params.set("adId", String(ad.id));
  if (ad?.mobile) params.set("mobile", ad.mobile);

  return `${getBaseUrl()}/sold-status?${params.toString()}`;
}

function buildLayout({ title, preheader, bodyHtml, footerNote }) {
  return `
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0">${escapeHtml(preheader || title)}</div>
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:680px;margin:0 auto;padding:24px;background:#ffffff">
      <div style="border-bottom:4px solid #dc2626;padding-bottom:14px;margin-bottom:22px">
        <p style="margin:0;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#2563eb">My Classifieds</p>
        <h1 style="font-size:26px;line-height:1.2;margin:6px 0 0;color:#0f172a">${escapeHtml(title)}</h1>
      </div>
      ${bodyHtml}
      <div style="margin-top:28px;border-top:1px solid #e2e8f0;padding-top:16px;font-size:12px;color:#64748b">
        <p style="margin:0 0 8px">${escapeHtml(footerNote || "This is a transactional update related to your My Classifieds advertisement.")}</p>
        <p style="margin:0">My Classifieds is owned and operated by SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED.</p>
      </div>
    </div>
  `;
}

function button(label, href, background = "#dc2626") {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${background};color:#ffffff;text-decoration:none;font-weight:800;border-radius:12px;padding:12px 18px;margin:6px 8px 6px 0">${escapeHtml(label)}</a>`;
}

function adSummaryBlock(ad) {
  return `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:16px;margin:18px 0">
      <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase">Advertisement Details</p>
      <p style="margin:0 0 6px"><strong>Ad ID:</strong> #${escapeHtml(ad.id)}</p>
      <p style="margin:0 0 6px"><strong>Title:</strong> ${escapeHtml(ad.title)}</p>
      <p style="margin:0 0 6px"><strong>Status:</strong> ${escapeHtml(ad.status || "-")}</p>
      <p style="margin:0 0 6px"><strong>Plan:</strong> ${escapeHtml(ad.adType || "FREE")}</p>
      <p style="margin:0"><strong>Expiry:</strong> ${escapeHtml(formatDate(ad.expiresAt))}</p>
    </div>
  `;
}

function textFooter() {
  return [
    "",
    "--",
    "My Classifieds",
    "Owned and operated by SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED",
    "Support: connect@myclassifieds.in"
  ].join("\n");
}

export function getUserEmailFromAd(ad) {
  const email = cleanEmail(ad?.user?.email);
  return email && email.includes("@") ? email : null;
}

export function buildAdSubmissionEmail({ ad, paymentRecord }) {
  const hasPayment = Boolean(paymentRecord);
  const title = hasPayment
    ? "Ad and Payment Reference Received"
    : "Free Ad Submitted for Review";

  const preheader = hasPayment
    ? "Your ad and UPI payment reference have been received for verification."
    : "Your free classified has been submitted and is pending admin review.";

  const bodyHtml = `
    <p>Hello ${escapeHtml(ad.user?.name || "there")},</p>
    <p>${escapeHtml(preheader)}</p>
    ${adSummaryBlock(ad)}
    ${hasPayment ? `
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;padding:16px;margin:18px 0">
        <p style="margin:0 0 6px"><strong>Payment Status:</strong> Pending manual verification</p>
        <p style="margin:0 0 6px"><strong>Amount:</strong> ${escapeHtml(formatCurrencyFromPaise(paymentRecord.amount))}</p>
        <p style="margin:0"><strong>Reference No.:</strong> ${escapeHtml(paymentRecord.manualReferenceNumber || "-")}</p>
      </div>
    ` : ""}
    <p>Admin will review your ad as per the applicable listing rules. You can check status securely through your My Ads dashboard using email OTP.</p>
    <p>
      ${button("Open My Ads", getMyAdsUrl(ad), "#2563eb")}
    </p>
  `;

  const text = [
    title,
    "",
    `Hello ${ad.user?.name || "there"},`,
    preheader,
    "",
    `Ad ID: #${ad.id}`,
    `Title: ${ad.title}`,
    `Status: ${ad.status}`,
    hasPayment ? `Payment: Pending verification, ${formatCurrencyFromPaise(paymentRecord.amount)}` : "",
    hasPayment ? `Reference: ${paymentRecord.manualReferenceNumber || "-"}` : "",
    "",
    `My Ads: ${getMyAdsUrl(ad)}`,
    textFooter()
  ].filter(Boolean).join("\n");

  return { subject: `My Classifieds: ${title} - #${ad.id}`, html: buildLayout({ title, preheader, bodyHtml }), text };
}

export function buildAdApprovedEmail(ad) {
  const title = "Your Ad is Live";
  const preheader = "Your classified has been approved and is now visible on My Classifieds.";
  const bodyHtml = `
    <p>Hello ${escapeHtml(ad.user?.name || "there")},</p>
    <p>Your classified has been approved and is now live.</p>
    ${adSummaryBlock(ad)}
    <p>For better visibility and more enquiries, you may renew, upgrade to Premium, or add Featured placement from your dashboard.</p>
    <p>
      ${button("View Public Ad", getAdUrl(ad), "#2563eb")}
      ${button("Open My Ads", getMyAdsUrl(ad), "#0f172a")}
      ${button("Renew / Upgrade", getRenewUrl(ad), "#dc2626")}
    </p>
  `;

  const text = [
    title,
    "",
    `Your classified #${ad.id} is now live.`,
    `View: ${getAdUrl(ad)}`,
    `My Ads: ${getMyAdsUrl(ad)}`,
    `Renew / Upgrade: ${getRenewUrl(ad)}`,
    textFooter()
  ].join("\n");

  return { subject: `My Classifieds: Your ad is live - #${ad.id}`, html: buildLayout({ title, preheader, bodyHtml }), text };
}

export function buildAdRejectedEmail(ad) {
  const title = "Your Ad Needs Correction";
  const preheader = "Your classified could not be approved in its present form.";
  const bodyHtml = `
    <p>Hello ${escapeHtml(ad.user?.name || "there")},</p>
    <p>Your classified could not be approved in its present form. This may happen if the ad requires correction, additional clarity, or does not comply with the listing rules.</p>
    ${adSummaryBlock(ad)}
    <p>Please open My Ads and request an edit, or contact support for clarification.</p>
    <p>
      ${button("Open My Ads", getMyAdsUrl(ad), "#2563eb")}
      ${button("Listing Rules", `${getBaseUrl()}/legal/listing-rules`, "#0f172a")}
    </p>
  `;

  const text = [
    title,
    "",
    `Your classified #${ad.id} could not be approved in its present form.`,
    `My Ads: ${getMyAdsUrl(ad)}`,
    `Listing Rules: ${getBaseUrl()}/legal/listing-rules`,
    textFooter()
  ].join("\n");

  return { subject: `My Classifieds: Ad needs correction - #${ad.id}`, html: buildLayout({ title, preheader, bodyHtml }), text };
}

export function buildPaymentVerifiedEmail({ ad, payment }) {
  const title = "Payment Verified";
  const preheader = "Your UPI payment has been verified and the selected plan has been applied.";
  const bodyHtml = `
    <p>Hello ${escapeHtml(ad.user?.name || "there")},</p>
    <p>Your UPI payment has been verified and the selected plan has been applied to your classified.</p>
    ${adSummaryBlock(ad)}
    <div style="background:#ecfdf5;border:1px solid #bbf7d0;border-radius:16px;padding:16px;margin:18px 0">
      <p style="margin:0 0 6px"><strong>Amount:</strong> ${escapeHtml(formatCurrencyFromPaise(payment.amount))}</p>
      <p style="margin:0 0 6px"><strong>Plan:</strong> ${escapeHtml(payment.plan || "-")}</p>
      <p style="margin:0"><strong>Reference:</strong> ${escapeHtml(payment.manualReferenceNumber || payment.manualTransactionRef || "-")}</p>
    </div>
    <p>If the ad is still pending, admin moderation will be completed separately. You can track everything from My Ads.</p>
    <p>
      ${button("Open My Ads", getMyAdsUrl(ad), "#2563eb")}
      ${button("Renew / Upgrade", getRenewUrl(ad), "#dc2626")}
    </p>
  `;

  const text = [
    title,
    "",
    `Payment verified for ad #${ad.id}.`,
    `Amount: ${formatCurrencyFromPaise(payment.amount)}`,
    `Plan: ${payment.plan || "-"}`,
    `My Ads: ${getMyAdsUrl(ad)}`,
    textFooter()
  ].join("\n");

  return { subject: `My Classifieds: Payment verified - #${ad.id}`, html: buildLayout({ title, preheader, bodyHtml }), text };
}

export function buildPaymentRejectedEmail({ ad, payment }) {
  const title = "Payment Reference Could Not Be Verified";
  const preheader = "Your submitted UPI payment reference could not be verified.";
  const bodyHtml = `
    <p>Hello ${escapeHtml(ad.user?.name || "there")},</p>
    <p>Your submitted UPI payment reference could not be verified. Please check the UTR / transaction ID and submit the correct payment details again, or contact support.</p>
    ${adSummaryBlock(ad)}
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:16px;padding:16px;margin:18px 0">
      <p style="margin:0 0 6px"><strong>Amount:</strong> ${escapeHtml(formatCurrencyFromPaise(payment.amount))}</p>
      <p style="margin:0 0 6px"><strong>Plan:</strong> ${escapeHtml(payment.plan || "-")}</p>
      <p style="margin:0"><strong>Reason:</strong> ${escapeHtml(payment.failureReason || payment.manualVerificationNote || "Manual verification failed.")}</p>
    </div>
    <p>
      ${button("Open My Ads", getMyAdsUrl(ad), "#2563eb")}
      ${button("Submit Again / Renew", getRenewUrl(ad), "#dc2626")}
    </p>
  `;

  const text = [
    title,
    "",
    `Payment reference could not be verified for ad #${ad.id}.`,
    `Reason: ${payment.failureReason || payment.manualVerificationNote || "Manual verification failed."}`,
    `My Ads: ${getMyAdsUrl(ad)}`,
    textFooter()
  ].join("\n");

  return { subject: `My Classifieds: Payment verification failed - #${ad.id}`, html: buildLayout({ title, preheader, bodyHtml }), text };
}

export function buildAdminNewAdNotification({ ad, paymentRecord }) {
  const title = "New Classified Submitted";
  const preheader = `New ${paymentRecord ? "paid" : "free"} classified submitted for moderation.`;
  const adminUrl = `${getBaseUrl()}/admin`;
  const paymentUrl = `${getBaseUrl()}/admin/payments`;

  const bodyHtml = `
    <p>A new classified has been submitted.</p>
    ${adSummaryBlock(ad)}
    ${paymentRecord ? `
      <p><strong>Payment:</strong> ${escapeHtml(formatCurrencyFromPaise(paymentRecord.amount))}, pending manual verification.</p>
    ` : ""}
    <p>
      ${button("Open Admin Moderation", adminUrl, "#2563eb")}
      ${paymentRecord ? button("Open Payments", paymentUrl, "#dc2626") : ""}
    </p>
  `;

  const text = [
    title,
    "",
    `Ad ID: #${ad.id}`,
    `Title: ${ad.title}`,
    paymentRecord ? `Payment: ${formatCurrencyFromPaise(paymentRecord.amount)} pending verification` : "Free ad",
    `Admin: ${adminUrl}`,
    textFooter()
  ].filter(Boolean).join("\n");

  return { subject: `Admin: New classified submitted - #${ad.id}`, html: buildLayout({ title, preheader, bodyHtml }), text };
}

export async function safeSendUserEventEmail({ to, email }) {
  const recipient = cleanEmail(to);

  if (!recipient || !recipient.includes("@") || !email) {
    return { skipped: true, reason: "Missing recipient or email content" };
  }

  try {
    await sendTransactionalEmail({
      to: recipient,
      subject: email.subject,
      html: email.html,
      text: email.text
    });

    return { sent: true };
  } catch (error) {
    console.error("User event email failed:", error);

    return {
      sent: false,
      error: error instanceof Error ? error.message.slice(0, 500) : String(error).slice(0, 500)
    };
  }
}

export async function safeSendAdminEventEmail(email) {
  const recipient = cleanEmail(process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_FROM?.match(/<([^>]+)>/)?.[1] || "connect@myclassifieds.in");

  if (!recipient || !recipient.includes("@") || !email) {
    return { skipped: true, reason: "Missing admin recipient or email content" };
  }

  return safeSendUserEventEmail({ to: recipient, email });
}
