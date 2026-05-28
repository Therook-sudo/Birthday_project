import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;



export const requestCodeSchema = z.object({
  email: z.string().email().max(255),
  fullName: z.string().trim().min(1).max(120).optional(),
});

export const verifyCodeSchema = z.object({
  email: z.string().email().max(255),
  code: z.string().regex(/^\d{5}$/, "Code must be 5 digits"),
  fullName: z.string().trim().min(1).max(120).optional(),
});

export type RequestCodeInput = z.infer<typeof requestCodeSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;