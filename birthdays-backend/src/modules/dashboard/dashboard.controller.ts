import type { NextFunction, Request, Response } from "express";
import * as dashboardService from "./dashboard.service";

export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    const summary = await dashboardService.getDashboardSummary(req.user.id);

    return res.json(summary);
  } catch (error) {
    return next(error);
  }
}