import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "my_classifieds_admin";
export const ADMIN_IDLE_TIMEOUT_SECONDS = 10 * 60;
export const ADMIN_IDLE_TIMEOUT_WARNING_SECONDS = 60;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

export function getAdminCookieOptions({ maxAge = ADMIN_IDLE_TIMEOUT_SECONDS } = {}) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  };
}

export function signAdminToken() {
  const now = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      role: "ADMIN",
      project: "MY_CLASSIFIEDS",
      lastActivityAt: now
    },
    getJwtSecret(),
    {
      expiresIn: ADMIN_IDLE_TIMEOUT_SECONDS
    }
  );
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const payload = jwt.verify(token, getJwtSecret());

    if (payload?.role !== "ADMIN" || payload?.project !== "MY_CLASSIFIEDS") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
