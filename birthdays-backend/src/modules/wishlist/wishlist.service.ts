import { prisma } from "../../db/prisma";
import type { CreateWishlistItemInput } from "./wishlist.schema";

export async function listMine(ownerId: string) {
  return prisma.wishlistItem.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listByUser(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createItem(
  ownerId: string,
  input: CreateWishlistItemInput
) {
  return prisma.wishlistItem.create({
    data: {
      ownerId,
      name: input.name,
      link: input.link || null,
      note: input.note || null,
      priority: input.priority,
    },
  });
}

export async function removeItem(ownerId: string, itemId: string) {
  const existing = await prisma.wishlistItem.findFirst({
    where: {
      id: itemId,
      ownerId,
    },
  });

  if (!existing) {
    const error = new Error("Wishlist item not found.");
    (error as any).statusCode = 404;
    throw error;
  }

  await prisma.wishlistItem.delete({
    where: { id: itemId },
  });
}

export async function getShareLink(ownerId: string) {
  return {
    url: `http://localhost:8080/wishlist/${ownerId}`,
  };
}