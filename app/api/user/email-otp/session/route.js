import { NextResponse } from "next/server";
import {
  getVerifiedEmailFromRequest,
  USER_EMAIL_SESSION_COOKIE
} from "../../../../lib/userAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const email = getVerifiedEmailFromRequest(request);

  return NextResponse.json({
    authenticated: Boolean(email),
    email
  });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true
  });

  response.cookies.set({
    name: USER_EMAIL_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}
