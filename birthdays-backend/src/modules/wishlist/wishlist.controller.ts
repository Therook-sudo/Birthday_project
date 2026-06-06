import type { NextFunction, Request, Response } from "express";
import { createWishlistItemSchema } from "./wishlist.schema";
import * as wishlistService from "./wishlist.service";

export async function listMine(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const items = await wishlistService.listMine(req.user.id);
    return res.json(items);
  } catch (error) {
    return next(error);
  }
}

export async function listByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const items = await wishlistService.listByUser(req.params.userId as string);
    return res.json(items);
  } catch (error) {
    return next(error);
  }
}

export async function createItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const input = createWishlistItemSchema.parse(req.body);
    const item = await wishlistService.createItem(req.user.id, input);

    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
}

export async function removeItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    await wishlistService.removeItem(req.user.id, req.params.id as string);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function getShareLink(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const link = await wishlistService.getShareLink(req.user.id);
    return res.json(link);
  } catch (error) {
    return next(error);
  }
}