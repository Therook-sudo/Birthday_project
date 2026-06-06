import { z } from "zod";

export const createWishlistItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  link: z.string().url().optional().or(z.literal("")),
  note: z.string().max(500).optional().or(z.literal("")),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
});

export type CreateWishlistItemInput = z.infer<
  typeof createWishlistItemSchema
>;