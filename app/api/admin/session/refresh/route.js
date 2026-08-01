import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_IDLE_TIMEOUT_SECONDS,
  getAdminCookieOptions,
  getAdminSession,
  signAdminToken
} from "../../../../lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getAdminSession();

  if (!session) {
    const response = NextResponse.json(
      { error: "Admin session expired." },
      { status: 401 }
    );

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: "",
      ...getAdminCookieOptions({ maxAge: 0 })
    });

    return response;
  }

  const token = signAdminToken();
  const response = NextResponse.json({
    success: true,
    message: "Admin session extended.",
    idleTimeoutSeconds: ADMIN_IDLE_TIMEOUT_SECONDS
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    ...getAdminCookieOptions()
  });

  return response;
}
