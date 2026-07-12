import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const cities = await prisma.city.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return NextResponse.json({ cities });
}
