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

function buildButton({ href, label, background = "#dc2626" }) {
  return `
    <a href="${href}" style="display:inline-block;background:${background};color:#ffffff;text-decoration:none;font-weight:800;padding:12px 18px;border-radius:12px;margin:6px 6px 6px 0">
      ${label}
    </a>
  `;
}

function buildLayout({ heading, intro, body, actions, footerNote }) {
  const siteUrl = getSiteUrl();

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:680px;margin:0 auto;padding:24px;background:#ffffff">
      <p style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;margin:0 0 8px">My Classifieds</p>
      <h1 style="font-size:26px;line-height:1.2;margin:0 0 14px;color:#020617">${heading}</h1>
      <p style="font-size:15px;color:#334155;margin:0 0 18px">${intro}</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:18px;margin:18px 0">
        ${body}
      </div>
      <div style="margin:20px 0">${actions}</div>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:14px;margin:18px 0;color:#7c2d12;font-size:14px">
        ${footerNote}
      </div>
      <p style="font-size:12px;color:#64748b;margin-top:24px">
        Website: <a href="${siteUrl}" style="color:#2563eb">${siteUrl}</a><br />
        Email: connect@myclassifieds.in<br />
        My Classifieds is owned and operated by SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED.
      </p>
    </div>
  `;
}

export function buildAdExpiredEmail(ad) {
  const siteUrl = getSiteUrl();
  const title = escapeHtml(ad.title);
  const adId = ad.id;
  const mobile = encodeURIComponent(ad.mobile || ad.whatsapp || ad.user?.mobile || "");
  const myAdsUrl = `${siteUrl}/my-ads?mobile=${mobile}&email=${encodeURIComponent(ad.user?.email || "")}`;
  const renewUrl = `${siteUrl}/renew?adId=${adId}&mobile=${mobile}`;
  const soldStatusUrl = `${siteUrl}/sold-status?adId=${adId}&mobile=${mobile}`;

  const isFree = ad.adType === "FREE";
  const subject = isFree
    ? `Your free ad has expired: ${ad.title}`
    : `Your ad has expired: ${ad.title}`;

  const body = `
    <p style="margin:0 0 10px"><strong>Ad ID:</strong> #${adId}</p>
    <p style="margin:0 0 10px"><strong>Ad Title:</strong> ${title}</p>
    <p style="margin:0 0 10px"><strong>Plan:</strong> ${escapeHtml(ad.adType)}</p>
    <p style="margin:0 0 10px"><strong>Expired On:</strong> ${formatDate(ad.expiresAt)}</p>
    <p style="margin:12px 0 0">Your ad is no longer shown as an active listing. Renew it now to continue receiving enquiries.</p>
  `;

  const actions = [
    buildButton({ href: renewUrl, label: "Renew / Upgrade Now" }),
    buildButton({ href: myAdsUrl, label: "Open My Ads", background: "#2563eb" }),
    buildButton({ href: soldStatusUrl, label: "Mark Sold / Available", background: "#16a34a" })
  ].join("\n");

  const footerNote = isFree
    ? "Tip: Free ads get limited visibility. Upgrade to Paid or Premium to improve visibility and extend the listing period."
    : "Tip: If the product or service is still available, renew before losing potential buyers. If sold, mark it as sold to keep your account updated.";

  const intro = isFree
    ? "Your free listing period has ended. Upgrade to a paid plan to keep the ad visible and improve response chances."
    : "Your listing period has ended. Renew or upgrade the ad if the product/service is still available.";

  const html = buildLayout({
    heading: "Your ad has expired",
    intro,
    body,
    actions,
    footerNote
  });

  const text = [
    "Your ad has expired",
    "",
    `Ad ID: #${adId}`,
    `Ad Title: ${ad.title}`,
    `Plan: ${ad.adType}`,
    `Expired On: ${formatDate(ad.expiresAt)}`,
    "",
    "Renew / Upgrade:",
    renewUrl,
    "",
    "Open My Ads:",
    myAdsUrl,
    "",
    "Mark Sold / Available:",
    soldStatusUrl,
    "",
    footerNote
  ].join("\n");

  return { subject, html, text };
}

export function buildFeaturedEndedEmail(ad) {
  const siteUrl = getSiteUrl();
  const title = escapeHtml(ad.title);
  const adId = ad.id;
  const mobile = encodeURIComponent(ad.mobile || ad.whatsapp || ad.user?.mobile || "");
  const myAdsUrl = `${siteUrl}/my-ads?mobile=${mobile}&email=${encodeURIComponent(ad.user?.email || "")}`;
  const renewUrl = `${siteUrl}/renew?adId=${adId}&mobile=${mobile}`;

  const subject = `Featured placement ended: ${ad.title}`;

  const body = `
    <p style="margin:0 0 10px"><strong>Ad ID:</strong> #${adId}</p>
    <p style="margin:0 0 10px"><strong>Ad Title:</strong> ${title}</p>
    <p style="margin:0 0 10px"><strong>Featured Until:</strong> ${formatDate(ad.featuredUntil)}</p>
    <p style="margin:12px 0 0">Your ad can remain active until its normal expiry date, but it will no longer receive Featured placement.</p>
  `;

  const actions = [
    buildButton({ href: renewUrl, label: "Renew / Add Featured Again" }),
    buildButton({ href: myAdsUrl, label: "Open My Ads", background: "#2563eb" })
  ].join("\n");

  const footerNote = "Tip: Featured placement helps your ad remain more visible. Use it again for important or urgent listings.";

  const html = buildLayout({
    heading: "Featured placement has ended",
    intro: "Your Featured add-on period has ended. You can add Featured again or renew/upgrade from your secure dashboard.",
    body,
    actions,
    footerNote
  });

  const text = [
    "Featured placement has ended",
    "",
    `Ad ID: #${adId}`,
    `Ad Title: ${ad.title}`,
    `Featured Until: ${formatDate(ad.featuredUntil)}`,
    "",
    "Renew / Add Featured Again:",
    renewUrl,
    "",
    "Open My Ads:",
    myAdsUrl,
    "",
    footerNote
  ].join("\n");

  return { subject, html, text };
}
