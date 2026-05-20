import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AuthUser = {
  id: string;
  email: string;
  isPremium: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required.",
      code: "AUTH_REQUIRED",
    });
  }

  const token = authHeader.split(" ")[1] as string;

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET as string) as unknown as {
      sub: string;
      email: string;
      isPremium: boolean;
    };

    req.user = {
      id: payload.sub,
      email: payload.email,
      isPremium: payload.isPremium,
    };

    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token.",
      code: "INVALID_TOKEN",
    });
  }
}

export function requirePremium(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.isPremium) {
    return res.status(402).json({
      message: "Premium plan required.",
      code: "PREMIUM_REQUIRED",
    });
  }

  return next();
}