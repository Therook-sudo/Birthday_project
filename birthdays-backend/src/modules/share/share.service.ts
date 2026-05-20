import crypto from "crypto";
import { prisma } from "../../db/prisma";

export async function getOrCreateShareLink(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  let token = user.shareToken;

  if (!token) {
    token = crypto.randomBytes(16).toString("hex");

    await prisma.user.update({
      where: { id: userId },
      data: { shareToken: token },
    });
  }

  return {
    token,
    url: `http://localhost:5173/u/${token}/collect`,
  };
}

export async function regenerateShareLink(userId: string) {
  const token = crypto.randomBytes(16).toString("hex");

  await prisma.user.update({
    where: { id: userId },
    data: { shareToken: token },
  });

  return {
    token,
    url: `http://localhost:5173/u/${token}/collect`,
  };
}