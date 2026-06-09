import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const setSecurityQuestionSchema = z.object({
  securityQuestion: z.string().trim().min(1).max(255),
  securityAnswer: z.string().trim().min(1).max(255),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(255),
});

export const resetPasswordSchema = z.object({
  email: z.string().email().max(255),
  securityAnswer: z.string().trim().min(1).max(255),
  newPassword: z.string().min(6).max(128),
});

export type SetSecurityQuestionInput = z.infer<typeof setSecurityQuestionSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

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