import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const token = cookies().get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    return user;
  } catch {
    return null;
  }
}
