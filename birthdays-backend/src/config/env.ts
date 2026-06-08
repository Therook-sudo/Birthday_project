import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.string().trim().min(1),

  JWT_ACCESS_SECRET: z.string().trim().min(10),
  JWT_REFRESH_SECRET: z.string().trim().min(10),

  CORS_ORIGIN: z.string().trim().default("http://localhost:5173"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  SMTP_HOST: z.string().trim().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().trim().optional(),
  SMTP_PASS: z.string().trim().optional(),
  EMAIL_FROM: z.string().trim().optional(),

  GOOGLE_CLIENT_ID: z.string().trim().optional(),
  GOOGLE_CLIENT_SECRET: z.string().trim().optional(),
  GOOGLE_REDIRECT_URI: z.string().trim().optional(),
  FRONTEND_URL: z.string().trim().default("http://localhost:8080"),
});

export const env = envSchema.parse(process.env);