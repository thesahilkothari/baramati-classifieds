import { NextResponse } from "next/server";
import { runAdLifecycleJob } from "../../../lib/adLifecycleJob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanSecret(value) {
  let secret = String(value || "").trim();

  if (
    (secret.startsWith('"') && secret.endsWith('"')) ||
    (secret.startsWith("'") && secret.endsWith("'"))
  ) {
    secret = secret.slice(1, -1).trim();
  }

  if (secret.startsWith("CRON_SECRET=")) {
    secret = secret.slice("CRON_SECRET=".length).trim();
  }

  return secret;
}

function isAuthorized(request) {
  const cronSecret = cleanSecret(process.env.CRON_SECRET);

  if (!cronSecret && process.env.NODE_ENV !== "production") {
    return true;
  }

  if (!cronSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization") || "";
  const headerSecret = request.headers.get("x-cron-secret") || "";
  const { searchParams } = new URL(request.url);
  const token = cleanSecret(searchParams.get("token") || searchParams.get("secret") || "");

  return (
    authorization === `Bearer ${cronSecret}` ||
    cleanSecret(headerSecret) === cronSecret ||
    token === cronSecret
  );
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
    const summary = await runAdLifecycleJob({
      dryRun: isDryRun(request)
    });

    return NextResponse.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error("Ad lifecycle cron failed:", error);

    return NextResponse.json(
      {
        error: "Ad lifecycle cron failed.",
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
