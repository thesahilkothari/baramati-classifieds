export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://myclassifieds.in";
}

export function buildSoldStatusUrl(ad) {
  const url = new URL("/sold-status", getSiteUrl());
  url.searchParams.set("adId", String(ad.id));
  url.searchParams.set("mobile", ad.mobile || "");

  return url.toString();
}

export function buildRenewUrl(ad) {
  const url = new URL("/renew", getSiteUrl());
  url.searchParams.set("adId", String(ad.id));
  url.searchParams.set("mobile", ad.mobile || "");

  return url.toString();
}

export function buildWhatsAppUrl(phone, message) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");

  if (!cleanPhone) {
    return "";
  }

  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(email, subject, body) {
  if (!email) {
    return "";
  }

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildSoldStatusMessage(ad) {
  const soldStatusUrl = buildSoldStatusUrl(ad);
  const renewUrl = buildRenewUrl(ad);

  return `Hello ${ad.user?.name || "there"}, this is My Classifieds regarding your ad "${ad.title}". Please confirm whether the product/service is sold or still available.

Reply/update here:
${soldStatusUrl}

If it is still available, you can renew or upgrade your ad here:
${renewUrl}

Options available: Paid visibility, Premium visibility, and Featured placement.

- My Classifieds`;
}

export function buildSoldStatusEmailSubject(ad) {
  return `Please confirm status of your My Classifieds ad #${ad.id}`;
}

export function buildSoldStatusEmailBody(ad) {
  return buildSoldStatusMessage(ad);
}
