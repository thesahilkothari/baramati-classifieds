import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: {
      nameEn: "asc",
    },
  });

  return NextResponse.json({ categories });
}
