export function getEmailFromAddress() {
  return (
    process.env.EMAIL_FROM || "My Classifieds <connect@myclassifieds.in>"
  ).trim();
}

export function getOtpExpiryMinutes() {
  return Number(process.env.EMAIL_OTP_EXPIRY_MINUTES || 10);
}

export function getUserSessionMinutes() {
  return Number(process.env.USER_EMAIL_SESSION_MINUTES || 120);
}

export function normalizeSecretValue(value, variableName) {
  let normalized = String(value || "").trim();

  if (!normalized) return "";

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }

  const prefix = `${variableName}=`;

  if (normalized.startsWith(prefix)) {
    normalized = normalized.slice(prefix.length).trim();
  }

  return normalized;
}

export function getResendApiKey() {
  return normalizeSecretValue(process.env.RESEND_API_KEY, "RESEND_API_KEY");
}

export function getEmailProviderStatus() {
  const resendApiKey = getResendApiKey();
  const hasSmtp = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );

  return {
    hasResendApiKey: Boolean(resendApiKey),
    resendKeyLooksValid: resendApiKey.startsWith("re_"),
    hasSmtp,
    from: getEmailFromAddress()
  };
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://myclassifieds.in"
  ).replace(/\/+$/, "");
}

function buildOtpEmailHtml({ code, email }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px;margin:0 auto;padding:24px">
      <h1 style="font-size:24px;margin:0 0 12px">My Classifieds Email Verification</h1>
      <p>Hello,</p>
      <p>Your OTP for accessing your My Classifieds ad dashboard is:</p>
      <div style="font-size:32px;font-weight:800;letter-spacing:6px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:12px;padding:18px;text-align:center;margin:18px 0">
        ${code}
      </div>
      <p>This OTP is valid for ${getOtpExpiryMinutes()} minutes.</p>
      <p>If you did not request this OTP, please ignore this email.</p>
      <p style="font-size:12px;color:#64748b;margin-top:24px">
        Requested for: ${email}<br />
        Website: ${getBaseUrl()}<br />
        My Classifieds is owned and operated by SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED.
      </p>
    </div>
  `;
}

function buildOtpEmailText({ code, email }) {
  return [
    "My Classifieds Email Verification",
    "",
    `Your OTP for accessing your My Classifieds ad dashboard is: ${code}`,
    "",
    `This OTP is valid for ${getOtpExpiryMinutes()} minutes.`,
    "",
    "If you did not request this OTP, please ignore this email.",
    "",
    `Requested for: ${email}`,
    `Website: ${getBaseUrl()}`,
    "My Classifieds is owned and operated by SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED."
  ].join("\n");
}

function buildSafeResendError(errorText) {
  try {
    const parsed = JSON.parse(errorText);
    const message = parsed.message || parsed.error || errorText;
    const name = parsed.name || parsed.type || "resend_error";

    return `${name}: ${message}`;
  } catch {
    return String(errorText || "Unknown Resend error").slice(0, 500);
  }
}

async function sendWithResend({ to, subject, html, text }) {
  const resendApiKey = getResendApiKey();

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not available in the deployment environment.");
  }

  if (!resendApiKey.startsWith("re_")) {
    throw new Error(
      "RESEND_API_KEY does not look valid. Paste only the key value starting with re_."
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: getEmailFromAddress(),
      to,
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend rejected email: ${buildSafeResendError(errorText)}`);
  }

  return response.json();
}

async function loadNodemailer() {
  const dynamicImport = new Function("specifier", "return import(specifier)");

  return dynamicImport("nodemailer");
}

async function sendWithSmtp({ to, subject, html, text }) {
  const nodemailerModule = await loadNodemailer();
  const nodemailer = nodemailerModule.default || nodemailerModule;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    String(process.env.SMTP_SECURE || "").toLowerCase() === "true" ||
    port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter.sendMail({
    from: getEmailFromAddress(),
    to,
    subject,
    html,
    text
  });
}

export async function sendEmailOtp({ to, code }) {
  const subject = "Your My Classifieds OTP";
  const html = buildOtpEmailHtml({ code, email: to });
  const text = buildOtpEmailText({ code, email: to });
  const providerStatus = getEmailProviderStatus();

  if (providerStatus.hasResendApiKey) {
    return sendWithResend({ to, subject, html, text });
  }

  if (providerStatus.hasSmtp) {
    return sendWithSmtp({ to, subject, html, text });
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("EMAIL OTP DEV MODE", { to, code });
    return { dev: true };
  }

  throw new Error(
    "Email service is not configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS."
  );
}
