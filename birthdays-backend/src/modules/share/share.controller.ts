import type { NextFunction, Request, Response } from "express";
import * as shareService from "./share.service";

export async function getBirthdayShareLink(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const link = await shareService.getOrCreateShareLink(req.user.id);
    return res.json(link);
  } catch (error) {
    return next(error);
  }
}

export async function regenerateBirthdayShareLink(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const link = await shareService.regenerateShareLink(req.user.id);
    return res.json(link);
  } catch (error) {
    return next(error);
  }
}