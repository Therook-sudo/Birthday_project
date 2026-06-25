import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().email().max(255),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must not be more than 128 characters.")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(/[a-z]/, "Password must include at least one lowercase letter.")
    .regex(/[0-9]/, "Password must include at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one symbol."),

  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1),
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
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must not be more than 128 characters.")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(/[a-z]/, "Password must include at least one lowercase letter.")
    .regex(/[0-9]/, "Password must include at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one symbol."),
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