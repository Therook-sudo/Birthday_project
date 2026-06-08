import type { NextFunction, Request, Response } from "express";
import * as calendarService from "./calendar.service";
import { env } from "../../config/env";

export async function connectGoogle(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const authUrl = calendarService.getGoogleAuthUrl(userId);
    return res.redirect(authUrl);
  } catch (err) {
    return next(err);
  }
}

export async function googleCallback(req: Request, res: Response, next: NextFunction) {
  const code = req.query.code as string;
  const state = req.query.state as string;
  const error = req.query.error as string;

  const frontendUrl = env.FRONTEND_URL;

  if (error) {
    console.error("🔴 Google OAuth Callback Error:", error);
    return res.redirect(`${frontendUrl}/dashboard?calendar=error&message=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return res.redirect(`${frontendUrl}/dashboard?calendar=error&message=Missing+code+or+state`);
  }

  try {
    await calendarService.handleGoogleCallback(code, state);
    return res.redirect(`${frontendUrl}/dashboard?calendar=success`);
  } catch (err: any) {
    console.error("🔴 Google OAuth Callback exception:", err);
    return res.redirect(`${frontendUrl}/dashboard?calendar=error&message=${encodeURIComponent(err.message || "OAuth exchange failed")}`);
  }
}

export async function listConnections(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const connections = await calendarService.getConnections(userId);
    return res.json(connections);
  } catch (err) {
    return next(err);
  }
}

export async function disconnect(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const provider = req.params.provider;
    if (provider !== "google") {
      return res.status(400).json({ message: `Provider ${provider} is not supported.` });
    }

    await calendarService.disconnectCalendar(userId, provider);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export async function syncAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const provider = req.params.provider;
    if (provider !== "google") {
      return res.status(400).json({ message: `Provider ${provider} is not supported.` });
    }

    await calendarService.syncAllBirthdays(userId);
    return res.status(200).json({ message: "Synchronization initiated successfully." });
  } catch (err) {
    return next(err);
  }
}
