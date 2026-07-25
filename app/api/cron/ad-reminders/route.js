import { NextResponse } from "next/server";
import { runAdExpiryReminderJob } from "../../../lib/adReminderJob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret && process.env.NODE_ENV !== "production") {
    return true;
  }

  if (!cronSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization") || "";
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";

  return authorization === `Bearer ${cronSecret}` || token === cronSecret;
}

function isDryRun(request) {
  const { searchParams } = new URL(request.url);
  return searchParams.get("dryRun") === "1" || searchParams.get("dryRun") === "true";
}

async function handleCron(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized cron request." },
      { status: 401 }
    );
  }

  try {
    const summary = await runAdExpiryReminderJob({
      dryRun: isDryRun(request)
    });

    return NextResponse.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error("Ad reminder cron failed:", error);

    return NextResponse.json(
      {
        error: "Ad reminder cron failed.",
        details: error instanceof Error ? error.message.slice(0, 700) : String(error).slice(0, 700)
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return handleCron(request);
}

export async function POST(request) {
  return handleCron(request);
}
