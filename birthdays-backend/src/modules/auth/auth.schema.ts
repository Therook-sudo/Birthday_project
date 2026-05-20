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