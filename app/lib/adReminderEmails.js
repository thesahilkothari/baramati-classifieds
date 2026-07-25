function getSiteUrl() {
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

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}

function buildMyAdsUrl(ad) {
  const siteUrl = getSiteUrl();
  const params = new URLSearchParams();

  if (ad.mobile) params.set("mobile", ad.mobile);
  if (ad.user?.email) params.set("email", ad.user.email);

  return `${siteUrl}/my-ads?${params.toString()}`;
}

function buildSupportUrl(ad) {
  const message = `Hello My Classifieds, I need help with my ad renewal/status.\n\nAd ID: ${ad.id}\nAd Title: ${ad.title}`;
  return `https://wa.me/919673931166?text=${encodeURIComponent(message)}`;
}

function getPlanName(ad) {
  if (ad.adType === "PREMIUM") return "Premium";
  if (ad.adType === "PAID") return "Paid";
  if (ad.adType === "FEATURED") return "Featured";
  return "Free";
}

function getCommonFooter() {
  return `
    <p style="font-size:12px;color:#64748b;margin-top:24px;line-height:1.7">
      This is a service reminder for your active classified advertisement on My Classifieds.<br />
      My Classifieds is owned and operated by SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED.<br />
      Email: connect@myclassifieds.in | WhatsApp: +91 9673931166
    </p>
  `;
}

function buildEmailShell({ heading, preview, bodyHtml, ctaUrl, ctaLabel, secondaryUrl, secondaryLabel }) {
  return `
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0">
      ${escapeHtml(preview)}
    </div>
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:680px;margin:0 auto;padding:24px;background:#ffffff">
      <div style="border:2px solid #0f172a;border-radius:18px;padding:22px;background:#fff">
        <p style="margin:0 0 8px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#2563eb">My Classifieds</p>
        <h1 style="font-size:26px;line-height:1.2;margin:0 0 16px;color:#020617">${heading}</h1>
        ${bodyHtml}
        <div style="margin-top:22px">
          <a href="${ctaUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-weight:800;border-radius:12px;padding:13px 20px;text-transform:uppercase;font-size:13px">
            ${ctaLabel}
          </a>
          ${secondaryUrl ? `<a href="${secondaryUrl}" style="display:inline-block;margin-left:10px;background:#f8fafc;color:#0f172a;text-decoration:none;font-weight:800;border:1px solid #cbd5e1;border-radius:12px;padding:12px 18px;text-transform:uppercase;font-size:13px">${secondaryLabel}</a>` : ""}
        </div>
      </div>
      ${getCommonFooter()}
    </div>
  `;
}

export function buildFreeAdExpiryReminderEmail(ad) {
  const myAdsUrl = buildMyAdsUrl(ad);
  const supportUrl = buildSupportUrl(ad);
  const adTitle = escapeHtml(ad.title);
  const category = escapeHtml(ad.category?.nameEn || "Classified");
  const city = escapeHtml(ad.city?.name || "Maharashtra");
  const expiry = formatDate(ad.expiresAt);

  const subject = `Your free ad expires soon: ${ad.title}`.slice(0, 140);
  const preview = "Your free ad is about to expire. Renew or upgrade to Paid/Premium for better visibility.";

  const bodyHtml = `
    <p>Hello${ad.user?.name ? ` ${escapeHtml(ad.user.name)}` : ""},</p>
    <p>Your <strong>Free</strong> classified ad is nearing the end of its free visibility period.</p>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:16px 0">
      <p style="margin:0;font-size:18px;font-weight:800;color:#020617">${adTitle}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#475569">Category: ${category} | City: ${city}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#475569">Expiry: <strong>${expiry}</strong></p>
    </div>

    <p><strong>Recommended next step:</strong> upgrade or renew your ad to improve visibility and continue receiving responses.</p>

    <ul style="padding-left:20px;color:#334155">
      <li><strong>Paid Ad - ₹199 / 7 days:</strong> higher priority than free listings and faster approval.</li>
      <li><strong>Premium Ad - ₹499 / 30 days:</strong> longer duration, better visibility and more space for ad details.</li>
      <li><strong>Featured Add-on - ₹299 / 10 days:</strong> top placement for eligible paid/premium ads.</li>
    </ul>

    <p style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:12px;color:#9a3412">
      Tip: Ads with clearer titles, full descriptions and upgraded visibility generally perform better.
    </p>
  `;

  const text = [
    "My Classifieds - Free ad expiry reminder",
    "",
    `Your free ad is expiring soon: ${ad.title}`,
    `Expiry: ${expiry}`,
    `Category: ${ad.category?.nameEn || "Classified"}`,
    `City: ${ad.city?.name || "Maharashtra"}`,
    "",
    "Renew or upgrade options:",
    "Paid Ad - ₹199 / 7 days",
    "Premium Ad - ₹499 / 30 days",
    "Featured Add-on - ₹299 / 10 days for eligible paid/premium ads",
    "",
    `Open My Ads: ${myAdsUrl}`,
    `Support: ${supportUrl}`
  ].join("\n");

  return {
    subject,
    html: buildEmailShell({
      heading: "Your Free Ad Expires Soon",
      preview,
      bodyHtml,
      ctaUrl: myAdsUrl,
      ctaLabel: "Renew / Upgrade Ad",
      secondaryUrl: supportUrl,
      secondaryLabel: "Ask Support"
    }),
    text
  };
}

export function buildPaidAdExpiryReminderEmail(ad) {
  const myAdsUrl = buildMyAdsUrl(ad);
  const supportUrl = buildSupportUrl(ad);
  const adTitle = escapeHtml(ad.title);
  const category = escapeHtml(ad.category?.nameEn || "Classified");
  const city = escapeHtml(ad.city?.name || "Maharashtra");
  const expiry = formatDate(ad.expiresAt);
  const planName = getPlanName(ad);

  const subject = `Your ${planName} ad expires soon: ${ad.title}`.slice(0, 140);
  const preview = "Please confirm whether your item/service is sold. If still available, renew before expiry.";

  const bodyHtml = `
    <p>Hello${ad.user?.name ? ` ${escapeHtml(ad.user.name)}` : ""},</p>
    <p>Your <strong>${planName}</strong> classified ad is close to expiry.</p>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:16px 0">
      <p style="margin:0;font-size:18px;font-weight:800;color:#020617">${adTitle}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#475569">Category: ${category} | City: ${city}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#475569">Current plan: <strong>${planName}</strong></p>
      <p style="margin:8px 0 0;font-size:13px;color:#475569">Expiry: <strong>${expiry}</strong></p>
    </div>

    <p><strong>Please confirm one of the following:</strong></p>
    <ul style="padding-left:20px;color:#334155">
      <li>If your product/service is sold, mark it as sold so buyers do not contact you unnecessarily.</li>
      <li>If it is still available, renew before expiry to avoid loss of visibility.</li>
      <li>For stronger performance, consider Premium renewal or Featured placement.</li>
    </ul>

    <p style="background:#ecfdf5;border:1px solid #bbf7d0;border-radius:12px;padding:12px;color:#166534">
      Retention tip: renewing before expiry avoids interruption in listing visibility and keeps your ad active for interested buyers.
    </p>
  `;

  const text = [
    `My Classifieds - ${planName} ad expiry reminder`,
    "",
    `Your ad is expiring soon: ${ad.title}`,
    `Current plan: ${planName}`,
    `Expiry: ${expiry}`,
    `Category: ${ad.category?.nameEn || "Classified"}`,
    `City: ${ad.city?.name || "Maharashtra"}`,
    "",
    "Please confirm whether it is sold. If still available, renew before expiry.",
    "",
    `Open My Ads: ${myAdsUrl}`,
    `Support: ${supportUrl}`
  ].join("\n");

  return {
    subject,
    html: buildEmailShell({
      heading: `Your ${planName} Ad Expires Soon`,
      preview,
      bodyHtml,
      ctaUrl: myAdsUrl,
      ctaLabel: "Confirm / Renew",
      secondaryUrl: supportUrl,
      secondaryLabel: "Ask Support"
    }),
    text
  };
}
