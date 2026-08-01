import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_IDLE_TIMEOUT_SECONDS,
  getAdminCookieOptions,
  signAdminToken
} from "../../../lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const password = String(body.password || "x1(sKglo({0;");

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured." },
        { status: 500 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 }
      );
    }

    const token = signAdminToken();

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful.",
      idleTimeoutSeconds: ADMIN_IDLE_TIMEOUT_SECONDS
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      ...getAdminCookieOptions()
    });

    return response;
  } catch (error) {
    console.error("Admin login failed:", error);

    return NextResponse.json(
      { error: "Unable to login." },
      { status: 500 }
    );
  }
}
