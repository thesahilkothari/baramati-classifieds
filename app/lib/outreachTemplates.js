function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://myclassifieds.in").replace(/\/+$/, "");
}

function safeText(value, fallback = "") {
  return String(value || fallback).trim();
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatCurrency(amount) {
  if (!amount) return "Call for price";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(amount));
}

function getAdLinks(ad) {
  const baseUrl = getBaseUrl();
  const mobile = encodeURIComponent(ad.mobile || ad.user?.mobile || "");
  const adId = encodeURIComponent(String(ad.id));

  return {
    adUrl: `${baseUrl}/ads/${ad.slug}`,
    myAdsUrl: `${baseUrl}/my-ads?mobile=${mobile}`,
    renewUrl: `${baseUrl}/renew?adId=${adId}&mobile=${mobile}`,
    soldStatusUrl: `${baseUrl}/sold-status?adId=${adId}&mobile=${mobile}`,
    pricingUrl: `${baseUrl}/pricing`,
    supportUrl: `${baseUrl}/support`
  };
}

function wrapEmail({ heading, intro, bodyHtml, ctaLabel, ctaUrl, footerNote }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:680px;margin:0 auto;padding:24px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;color:#2563eb;letter-spacing:.08em">My Classifieds</p>
      <h1 style="font-size:24px;line-height:1.2;margin:0 0 14px;color:#020617">${heading}</h1>
      <p style="margin:0 0 18px;color:#334155">${intro}</p>
      ${bodyHtml}
      <p style="margin:24px 0">
        <a href="${ctaUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-weight:800;border-radius:12px;padding:12px 18px">${ctaLabel}</a>
      </p>
      <p style="font-size:13px;color:#475569;margin-top:20px">${footerNote}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
      <p style="font-size:12px;color:#64748b;margin:0">
        SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED | My Classifieds | connect@myclassifieds.in<br />
        This is a service communication about your classified advertisement.
      </p>
    </div>
  `;
}

function buildAdSummaryHtml(ad) {
  return `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:16px 0">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;color:#64748b">Ad Summary</p>
      <p style="margin:0;font-size:18px;font-weight:800;color:#020617">${safeText(ad.title, "Your classified ad")}</p>
      <p style="margin:8px 0 0;color:#475569">Category: ${safeText(ad.category?.nameEn, "-")} | City: ${safeText(ad.city?.name, "-")}</p>
      <p style="margin:4px 0 0;color:#475569">Price: ${formatCurrency(ad.price)} | Views: ${Number(ad.views || 0)}</p>
      <p style="margin:4px 0 0;color:#475569">Expiry: ${formatDate(ad.expiresAt)}</p>
    </div>
  `;
}

function buildFreeUpgradeTemplate(ad) {
  const links = getAdLinks(ad);
  const subject = `Your free ad is expiring soon: ${safeText(ad.title, "My Classifieds ad")}`;
  const intro = "Your free listing is close to expiry. Renewing before expiry keeps your ad visible and helps avoid losing interested buyers.";
  const html = wrapEmail({
    heading: "Keep your free ad visible",
    intro,
    bodyHtml: `
      ${buildAdSummaryHtml(ad)}
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:16px">
        <p style="margin:0 0 8px;font-weight:800;color:#9a3412">Recommended next step</p>
        <ul style="margin:0;padding-left:20px;color:#7c2d12">
          <li>Renew to a Paid Ad for 7 days at ₹199.</li>
          <li>Upgrade to Premium for 30 days at ₹499 for longer visibility.</li>
          <li>Add Featured placement where eligible for stronger attention.</li>
        </ul>
      </div>
    `,
    ctaLabel: "Renew or Upgrade Ad",
    ctaUrl: links.renewUrl,
    footerNote: "Use your email OTP to access My Ads securely before renewing or upgrading."
  });
  const text = [
    "Your free ad is expiring soon.",
    "",
    `Ad: ${safeText(ad.title)}`,
    `City: ${safeText(ad.city?.name, "-")}`,
    `Views: ${Number(ad.views || 0)}`,
    `Expiry: ${formatDate(ad.expiresAt)}`,
    "",
    "Recommended: renew to Paid ₹199 / 7 days or Premium ₹499 / 30 days.",
    `Renew: ${links.renewUrl}`,
    `My Ads: ${links.myAdsUrl}`
  ].join("\n");

  return { subject, html, text, whatsappText: text };
}

function buildPaidRenewalTemplate(ad) {
  const links = getAdLinks(ad);
  const subject = `Check sold status or renew: ${safeText(ad.title, "My Classifieds ad")}`;
  const intro = "Your paid listing is close to expiry. Confirm whether it is sold or renew it if it is still available.";
  const html = wrapEmail({
    heading: "Is your ad sold or still available?",
    intro,
    bodyHtml: `
      ${buildAdSummaryHtml(ad)}
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:16px">
        <p style="margin:0 0 8px;font-weight:800;color:#1d4ed8">Best practice</p>
        <ul style="margin:0;padding-left:20px;color:#1e3a8a">
          <li>If sold, mark it as sold so buyers do not keep contacting you.</li>
          <li>If still available, renew before expiry to maintain visibility.</li>
          <li>Use Premium or Featured placement if the product/service needs more reach.</li>
        </ul>
      </div>
      <p style="margin:16px 0 0"><a href="${links.soldStatusUrl}" style="color:#2563eb;font-weight:700">Mark Sold / Still Available</a></p>
    `,
    ctaLabel: "Renew / Upgrade Now",
    ctaUrl: links.renewUrl,
    footerNote: "A timely status update improves buyer trust and keeps the platform clean."
  });
  const text = [
    "Your paid/premium ad is expiring soon.",
    "",
    `Ad: ${safeText(ad.title)}`,
    `Views: ${Number(ad.views || 0)}`,
    `Expiry: ${formatDate(ad.expiresAt)}`,
    "",
    "If sold, mark it as sold. If still available, renew or upgrade before expiry.",
    `Sold status: ${links.soldStatusUrl}`,
    `Renew: ${links.renewUrl}`,
    `My Ads: ${links.myAdsUrl}`
  ].join("\n");

  return { subject, html, text, whatsappText: text };
}

function buildExpiredReactivationTemplate(ad) {
  const links = getAdLinks(ad);
  const subject = `Reactivate your expired ad: ${safeText(ad.title, "My Classifieds ad")}`;
  const intro = "Your ad is no longer live. You can reactivate it quickly if the item or service is still available.";
  const html = wrapEmail({
    heading: "Reactivate your expired ad",
    intro,
    bodyHtml: `
      ${buildAdSummaryHtml(ad)}
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:14px;padding:16px">
        <p style="margin:0 0 8px;font-weight:800;color:#991b1b">Recover lost visibility</p>
        <p style="margin:0;color:#7f1d1d">Expired ads stop appearing prominently to buyers. Renewing or upgrading brings your listing back into active circulation.</p>
      </div>
    `,
    ctaLabel: "Reactivate Ad",
    ctaUrl: links.renewUrl,
    footerNote: "Renew only if the item or service is still available. If sold, mark it as sold from My Ads."
  });
  const text = [
    "Your My Classifieds ad has expired.",
    "",
    `Ad: ${safeText(ad.title)}`,
    `Views received: ${Number(ad.views || 0)}`,
    "",
    "If still available, renew or upgrade it. If sold, mark it as sold.",
    `Reactivate: ${links.renewUrl}`,
    `Sold status: ${links.soldStatusUrl}`
  ].join("\n");

  return { subject, html, text, whatsappText: text };
}

function buildHighViewUpgradeTemplate(ad) {
  const links = getAdLinks(ad);
  const subject = `Your ad is getting views - upgrade for better response`;
  const intro = "Your listing is receiving attention. This is a good time to upgrade visibility and increase response chances.";
  const html = wrapEmail({
    heading: "Your ad is getting buyer attention",
    intro,
    bodyHtml: `
      ${buildAdSummaryHtml(ad)}
      <div style="background:#ecfdf5;border:1px solid #bbf7d0;border-radius:14px;padding:16px">
        <p style="margin:0 0 8px;font-weight:800;color:#166534">Recommended growth action</p>
        <p style="margin:0;color:#14532d">Move this ad to Premium or add Featured placement so more visitors notice it while interest is already active.</p>
      </div>
    `,
    ctaLabel: "Upgrade This Ad",
    ctaUrl: links.renewUrl,
    footerNote: "This suggestion is based on listing activity and is not a guarantee of sale."
  });
  const text = [
    "Your My Classifieds ad is getting views.",
    "",
    `Ad: ${safeText(ad.title)}`,
    `Views: ${Number(ad.views || 0)}`,
    "",
    "Upgrade to Premium or add Featured placement for better visibility.",
    `Upgrade: ${links.renewUrl}`
  ].join("\n");

  return { subject, html, text, whatsappText: text };
}

export function getOutreachTemplate(ad, templateKey) {
  if (templateKey === "FREE_UPGRADE") return buildFreeUpgradeTemplate(ad);
  if (templateKey === "PAID_RENEWAL") return buildPaidRenewalTemplate(ad);
  if (templateKey === "EXPIRED_REACTIVATION") return buildExpiredReactivationTemplate(ad);
  if (templateKey === "HIGH_VIEW_UPGRADE") return buildHighViewUpgradeTemplate(ad);

  throw new Error("Invalid outreach template.");
}

export function getTemplateLabel(templateKey) {
  const labels = {
    FREE_UPGRADE: "Free to Paid Upgrade",
    PAID_RENEWAL: "Paid/Premium Renewal",
    EXPIRED_REACTIVATION: "Expired Ad Reactivation",
    HIGH_VIEW_UPGRADE: "High View Upgrade"
  };

  return labels[templateKey] || templateKey;
}

export function getWhatsAppUrlForTemplate(ad, templateKey) {
  const recipient = String(ad.whatsapp || ad.mobile || ad.user?.mobile || "").replace(/\D/g, "");
  const template = getOutreachTemplate(ad, templateKey);
  const mobile = recipient.length === 10 ? `91${recipient}` : recipient;

  if (!mobile) return "";

  return `https://wa.me/${mobile}?text=${encodeURIComponent(template.whatsappText)}`;
}
