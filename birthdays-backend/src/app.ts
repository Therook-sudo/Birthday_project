import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";

import { env } from "./config/env";

import { authRouter } from "./modules/auth/auth.routes";
import { birthdaysRouter } from "./modules/birthdays/birthdays.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { shareRouter } from "./modules/share/share.routes";
import { publicRouter } from "./modules/public/public.routes";
import { verifyJwt } from "./middleware/auth";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(compression());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 120,
    message: {
      message: "Too many requests. Please try again later.",
      code: "RATE_LIMIT",
    },
  })
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Birthdays backend is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/birthdays", verifyJwt, birthdaysRouter);
app.use("/api/dashboard", verifyJwt, dashboardRouter);
app.use("/api/share", verifyJwt, shareRouter);
app.use("/api/public", publicRouter);
app.use("/api/notifications", notificationsRouter);

// Centralized Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("🔴 Express global error handler caught:", err);

  const statusCode = err.statusCode || err.status || 500;

  // Handle Zod Schema Validation Errors
  if (err && err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation failed.",
      errors: err.errors || err.issues,
      code: "VALIDATION_ERROR",
    });
  }

  // Handle Prisma Database Errors
  if (err && err.code && err.code.startsWith("P2")) {
    return res.status(400).json({
      message: "Database transaction failed or unique constraint violated.",
      code: "DATABASE_ERROR",
      ...(env.NODE_ENV === "development" ? { details: err.message } : {}),
    });
  }

  res.status(statusCode).json({
    message: err.message || "An unexpected error occurred on the server.",
    code: err.code || "INTERNAL_ERROR",
    ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
});