import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Image upload is not configured yet"
    },
    {
      status: 501
    }
  );
}
