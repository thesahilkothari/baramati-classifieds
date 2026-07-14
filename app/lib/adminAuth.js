import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "my_classifieds_admin";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

export function signAdminToken() {
  return jwt.sign(
    {
      role: "ADMIN",
      project: "MY_CLASSIFIEDS"
    },
    getJwtSecret(),
    {
      expiresIn: "7d"
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

    if (payload?.role !== "ADMIN") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
