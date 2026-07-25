import jwt from "jsonwebtoken";
import { getUserSessionMinutes } from "./emailService";
import { cleanEmail } from "./userVerification";

export const USER_EMAIL_SESSION_COOKIE = "my_classifieds_user_email_session";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

export function signVerifiedEmailToken(email) {
  return jwt.sign(
    {
      type: "USER_EMAIL_OTP",
      email: cleanEmail(email)
    },
    getJwtSecret(),
    {
      expiresIn: `${getUserSessionMinutes()}m`
    }
  );
}

export function verifyVerifiedEmailToken(token) {
  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (payload?.type !== "USER_EMAIL_OTP") {
      return null;
    }

    const email = cleanEmail(payload.email);

    if (!email) {
      return null;
    }

    return {
      email
    };
  } catch {
    return null;
  }
}

export function getVerifiedEmailFromRequest(request) {
  const token = request.cookies.get(USER_EMAIL_SESSION_COOKIE)?.value;
  const session = verifyVerifiedEmailToken(token);

  return session?.email || null;
}

export function createUserEmailSessionCookieValue(email) {
  return signVerifiedEmailToken(email);
}

export function getUserEmailSessionMaxAgeSeconds() {
  return getUserSessionMinutes() * 60;
}
