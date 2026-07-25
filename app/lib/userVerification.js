export function cleanMobile(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

export function cleanEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 180);
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail(value));
}

export function getOwnerMobileNumbers(ad) {
  return [ad?.mobile, ad?.whatsapp, ad?.user?.mobile]
    .filter(Boolean)
    .map(cleanMobile)
    .filter(Boolean);
}

export function getOwnerEmails(ad) {
  return [ad?.user?.email]
    .filter(Boolean)
    .map(cleanEmail)
    .filter(Boolean);
}

export function verifyAdOwnerByMobileAndEmail(ad, { mobile, email }) {
  const verifiedMobile = cleanMobile(mobile);
  const verifiedEmail = cleanEmail(email);

  if (!verifiedMobile || verifiedMobile.length !== 10) {
    return {
      ok: false,
      status: 400,
      error: "Please enter the 10 digit mobile number used while posting the ad."
    };
  }

  if (!verifiedEmail || !isValidEmail(verifiedEmail)) {
    return {
      ok: false,
      status: 400,
      error: "Please enter the email address used while posting the ad."
    };
  }

  const ownerMobiles = getOwnerMobileNumbers(ad);
  const ownerEmails = getOwnerEmails(ad);

  if (ownerEmails.length === 0) {
    return {
      ok: false,
      status: 403,
      error:
        "This ad does not have an email address on record. Please contact My Classifieds support for verification."
    };
  }

  if (!ownerMobiles.includes(verifiedMobile) || !ownerEmails.includes(verifiedEmail)) {
    return {
      ok: false,
      status: 403,
      error: "Mobile number and email address do not match this ad."
    };
  }

  return {
    ok: true,
    mobile: verifiedMobile,
    email: verifiedEmail
  };
}
