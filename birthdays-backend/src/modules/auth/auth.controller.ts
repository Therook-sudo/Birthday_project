import type { Request, Response, NextFunction } from "express";
import {
  signupSchema,
  loginSchema,
  requestCodeSchema,
  verifyCodeSchema,
} from "./auth.schema";import * as authService from "./auth.service";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const input = signupSchema.parse(req.body);
    const result = await authService.signup(input);

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    const user = await authService.getMe(req.user.id);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

export async function logout(_req: Request, res: Response) {
  return res.status(204).send();
}


export async function requestCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = requestCodeSchema.parse(req.body);
    const result = await authService.requestCode(input);

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function verifyCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = verifyCodeSchema.parse(req.body);
    const result = await authService.verifyCode(input);

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}